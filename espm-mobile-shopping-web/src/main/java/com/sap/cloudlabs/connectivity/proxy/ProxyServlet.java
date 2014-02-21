/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the LICENSE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.sap.cloudlabs.connectivity.proxy;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.Header;
import org.apache.http.HeaderElement;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.DeflateDecompressingEntity;
import org.apache.http.client.entity.GzipDecompressingEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.core.connectivity.api.DestinationException;
import com.sap.core.connectivity.api.DestinationFactory;
import com.sap.core.connectivity.api.http.HttpDestination;

/**
 * Servlet is used as proxy between a consuming agent, like a Web browser
 * application, and a backend service. The backend service can either be an
 * on-premise backend service which is then accessed via SAP Cloud Connector, or
 * an Internet-accessible service. For both cases, the proxy servlet tries to
 * access the backend service via a configured destination. The destination must
 * be passed by the caller as part of the URL.
 * <p>
 * <b>Contract for calling this servlet:</b> The targeted backend service has to
 * be specified as destination in the URL path following the pattern:
 * 
 * <pre>
 * /<context-path>/<servlet-path>/<destinationName>/relativePathToService
 * </pre>
 * <p>
 * Main purpose of the proxy servlet is to assure the same-origin-policy (SOP)
 * for JavaScript applications running in Web browsers.
 */
public class ProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/** headers which will be blocked from forwarding in backend request */
	private static String[] BLOCKED_REQUEST_HEADERS = { "host",
			"content-length" };

	/** buffer size for piping the content */
	private static final int IO_BUFFER_SIZE = 4 * 1024;

	private static final Logger LOGGER = LoggerFactory
			.getLogger(ProxyServlet.class);

	private static DestinationFactory destinationFactory;

	/*
	 * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
	 */
	@Override
	public void init(ServletConfig servletConfig) throws ServletException {
		super.init(servletConfig);
	}

	@Override
	protected void service(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		int contextPathLength = request.getContextPath().length();
		int servletPathLength = request.getServletPath().length();

		// read destination and relative service path from URL
		if (request.getRequestURI().indexOf(
				request.getContextPath() + request.getServletPath() + "/") == -1) {
			throw new ServletException(writeMessage("no destination specified"));
		}

		String pathInfo = request.getRequestURI().substring(
				contextPathLength + servletPathLength + 1);
		String queryString = request.getQueryString();
		String destinationName = getDestinationFromUrl(pathInfo);
		String urlToService = getRelativePathFromUrl(pathInfo, queryString);

		// get the http client for the destination
		HttpDestination dest = getDestination(destinationName);
		HttpClient httpClient;
		try {
			httpClient = dest.createHttpClient();
		} catch (DestinationException e) {
			throw new ServletException(e);
		}

		// create request to targeted backend service
		HttpRequestBase backendRequest = getBackendRequest(request,
				urlToService);

		// execute the backend request
		HttpResponse backendResponse = httpClient.execute(backendRequest);

		String rewriteUrl = getDestinationUrl(dest);
		String proxyUrl = getProxyUrl(request, destinationName);

		// process response from backend request and pipe it to origin response
		// of client
		processBackendResponse(request, response, backendResponse, proxyUrl,
				rewriteUrl);
	}

	/**
	 * Returns the URL specified in the given destination.
	 */
	private String getDestinationUrl(HttpDestination destination)
			throws ServletException {
		try {
			String rewriteUrl = destination.getURI().toString();
			if (rewriteUrl.endsWith("/")) {
				rewriteUrl = rewriteUrl.substring(0, rewriteUrl.length() - 1);
			}
			return rewriteUrl;
		} catch (URISyntaxException e) {
			throw new ServletException(e);
		}
	}

	/**
	 * Returns the URL to the proxy servlet and used destination.
	 */
	private String getProxyUrl(HttpServletRequest request,
			String destinationName) throws MalformedURLException {
		URL url = new URL(request.getRequestURL().toString());
		String proxyUrl = request.getScheme() + "://" + url.getAuthority()
				+ request.getContextPath() + request.getServletPath() + '/'
				+ destinationName;
		return proxyUrl;
	}

	/**
	 * Process response received from backend service and copy it to origin
	 * response of client.
	 * 
	 * @param request
	 *            origin request of this Web application
	 * @param response
	 *            origin response of this Web application; this is where the
	 *            backend response is copied to
	 * @param backendResponse
	 *            the response of the backend service
	 * @param proxyUrl
	 *            the URL that should replace the <code>rewriteUrl</code>
	 * @param rewriteUrl
	 *            the URL that should be rewritten
	 */
	private void processBackendResponse(HttpServletRequest request,
			HttpServletResponse response, HttpResponse backendResponse,
			String proxyUrl, String rewriteUrl) throws IOException,
			ServletException {
		// copy response status code
		int status = backendResponse.getStatusLine().getStatusCode();
		response.setStatus(status);
		LOGGER.debug("backend response status code: " + status);

		// filter the headers to suppress the authentication dialog (only for
		// 401 - unauthorized)
		List<String> blockedHeaders = null;
		if (status == 401 && request.getHeader("authorization") != null
				&& request.getHeader("suppress-www-authenticate") != null) {
			blockedHeaders = Arrays.asList(new String[] { "www-authenticate" });
		} else {
			// for rewriting the URLs in the response, content-length,
			// content-encoding
			// and transfer-encoding (for chunked content) headers are removed
			// and handled specially.
			blockedHeaders = Arrays.asList(new String[] { "content-length",
					"transfer-encoding", "content-encoding" });
		}

		// copy backend response headers and content
		LOGGER.debug("backend response headers: ");
		for (Header header : backendResponse.getAllHeaders()) {
			if (!blockedHeaders.contains(header.getName().toLowerCase())) {
				response.addHeader(header.getName(), header.getValue());
				LOGGER.debug("    => " + header.getName() + ": "
						+ header.getValue());
			} else {
				LOGGER.debug("    => " + header.getName()
						+ ": blocked response header");
			}
		}

		handleContentEncoding(backendResponse);

		// pipe and return the response
		HttpEntity entity = backendResponse.getEntity();
		if (entity != null) {
			// rewrite URL in the content of the response to make sure that
			// internal URLs point to the proxy servlet as well

			// determine charset and content as String
			String charset = EntityUtils.getContentCharSet(entity);
			String content = EntityUtils.toString(entity);

			// replace the rewriteUrl with the targetUrl
			content = content.replaceAll(rewriteUrl, proxyUrl);

			// get the bytes and open a stream (by default HttpClient uses
			// ISO-8859-1)
			byte[] contentBytes = charset != null ? content.getBytes(charset)
					: content.getBytes("ISO-8859-1");
			InputStream is = new ByteArrayInputStream(contentBytes);

			// set the new content length
			response.setContentLength(contentBytes.length);

			// return the modified content
			pipe(is, response.getOutputStream());
		}

	}

	/**
	 * Returns the request that points to the backend service defined by the
	 * provided <code>urlToService</code> URL. The headers of the origin request
	 * are copied to the backend request, except of "host" and "content-length".
	 * 
	 * @param request
	 *            original request to the Web application
	 * @param urlToService
	 *            URL to the targeted backend service
	 * @return initialized backend service request
	 * @throws IOException
	 */
	private HttpRequestBase getBackendRequest(HttpServletRequest request,
			String urlToService) throws IOException {
		String method = request.getMethod();
		HttpRequestBase backendRequest = null;
		if ("POST".equals(method)) {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			pipe(request.getInputStream(), out);
			ByteArrayEntity entity = new ByteArrayEntity(out.toByteArray());
			entity.setContentType(request.getHeader("Content-Type"));
			HttpPost post = new HttpPost(urlToService);
			post.setEntity(entity);
			backendRequest = post;
		} else if ("GET".equals(method)) {
			HttpGet get = new HttpGet(urlToService);
			backendRequest = get;
		} else if ("PUT".equals(method)) {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			pipe(request.getInputStream(), out);
			ByteArrayEntity entity = new ByteArrayEntity(out.toByteArray());
			entity.setContentType(request.getHeader("Content-Type"));
			HttpPut put = new HttpPut(urlToService);
			put.setEntity(entity);
			backendRequest = put;
		} else if ("DELETE".equals(method)) {
			HttpDelete delete = new HttpDelete(urlToService);
			backendRequest = delete;
		}

		// copy headers from Web application request to backend request, while
		// filtering the blocked headers
		List<String> blockedHeaders = Arrays.asList(BLOCKED_REQUEST_HEADERS);
		LOGGER.debug("backend request headers:");
		for (Enumeration<String> e = request.getHeaderNames(); e
				.hasMoreElements();) {
			String headerName = e.nextElement().toString();
			if (!blockedHeaders.contains(headerName.toLowerCase())) {
				backendRequest.addHeader(headerName,
						request.getHeader(headerName));
				LOGGER.debug("    => " + headerName + ": "
						+ request.getHeader(headerName));
			} else {
				LOGGER.debug("    => " + headerName
						+ ": blocked request header");
			}
		}

		return backendRequest;
	}

	/**
	 * Returns an initialized HttpClient which points to the specified
	 * destination.
	 */
	private HttpDestination getDestination(String destinationName)
			throws ServletException {
		try {
			if (destinationFactory == null) {
				Context ctx = new InitialContext();
				destinationFactory = (DestinationFactory) ctx
						.lookup(DestinationFactory.JNDI_NAME);
			}
			HttpDestination dest = (HttpDestination) destinationFactory
					.getDestination(destinationName);
			return dest;
		} catch (Exception e) {
			throw new ServletException(
					writeMessage("Unable to resolve destination "
							+ destinationName), e);
		}
	}

	/**
	 * Returns the destination name defined in the specified URL path. It is
	 * assumed that the specified path consists of following parts:
	 * 
	 * <pre>
	 *  <destinationName>/relativePathToService
	 * </pre>
	 */
	private String getDestinationFromUrl(String path) throws ServletException {
		String destinationName = "";
		int index = path.indexOf("/");
		if (index != -1) {
			destinationName = path.substring(0, index);
		} else if (path != null && !path.isEmpty()) {
			destinationName = path;
		}
		if ("".equals(destinationName) || destinationName == null) {
			throw new ServletException(writeMessage("no destination specified"));
		}
		LOGGER.debug("destination read from URL path: " + destinationName);
		return destinationName;
	}

	/**
	 * Returns the relative path to the backend service. It assumes that the
	 * specified path is
	 * 
	 * <pre>
	 *  <destinationName>/relativePathToService
	 * </pre>
	 * 
	 * and it returns relativePathToService?queryString.
	 */
	private String getRelativePathFromUrl(String path, String queryString) {
		// strip off first label in the path, as it specifies the destination
		// name
		int index = path.indexOf("/");
		String relativePathToService = index != -1 ? path.substring(index + 1)
				: "";

		// replace spaces with %20 in the path
		relativePathToService = relativePathToService.replace(" ", "%20");

		if (queryString != null && !queryString.isEmpty()) {
			relativePathToService += "?" + queryString;
		}

		LOGGER.debug("relative path to service, incl. query string: "
				+ relativePathToService);
		return relativePathToService;
	}

	private void handleContentEncoding(HttpResponse response)
			throws ServletException {
		HttpEntity entity = response.getEntity();
		if (entity != null) {
			Header ceheader = entity.getContentEncoding();
			if (ceheader != null) {
				HeaderElement[] codecs = ceheader.getElements();
				for (HeaderElement codec : codecs) {
					String codecname = codec.getName().toLowerCase();
					if ("gzip".equals(codecname) || "x-gzip".equals(codecname)) {
						response.setEntity(new GzipDecompressingEntity(response
								.getEntity()));
						return;
					} else if ("deflate".equals(codecname)) {
						response.setEntity(new DeflateDecompressingEntity(
								response.getEntity()));
						return;
					} else if ("identity".equals(codecname)) {
						/* Don't need to transform the content - no-op */
						return;
					} else {
						throw new ServletException(
								"Unsupported Content-Coding: "
										+ codec.getName());
					}
				}
			}
		}
	}

	/**
	 * Pipes a given <code>InputStream</code> into the given
	 * <code>OutputStream</code>
	 * 
	 * @param in
	 *            <code>InputStream</code>
	 * @param out
	 *            <code>OutputStream</code>
	 * @throws IOException
	 */
	private static void pipe(InputStream in, OutputStream out)
			throws IOException {
		byte[] b = new byte[IO_BUFFER_SIZE];
		int read;
		while ((read = in.read(b)) != -1) {
			out.write(b, 0, read);
		}
		in.close();
		out.flush();
		out.close();
	}

	private String writeMessage(String message) {
		StringBuilder b = new StringBuilder();
		b.append("\nInvalid usage: ").append(message);
		b.append("\n");
		b.append("\nUsage of proxy servlet:");
		b.append("\n=======================");
		b.append("\nIt is assumed that the URL to the servlet follows the pattern ");
		b.append("\n==> /<context-path>/proxy/<destination-name>/<relative-path-below-destination-target>");
		b.append("\n");
		return b.toString();
	}
}
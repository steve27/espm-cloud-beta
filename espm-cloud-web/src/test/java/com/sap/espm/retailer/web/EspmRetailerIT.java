package com.sap.espm.retailer.web;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestName;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.espm.model.web.SalesOrderHeaderODataIT;

public class EspmRetailerIT {

	/**
	 * Store name of currently executed test method in field.
	 */
	@Rule
	public TestName testName = new TestName();
	private static final String PRODUCT_SEARCH_STRING = "Laser";
	private static String serverUrl;
	private static String applicationRelPath;
	private static File screenshotFolder;

	private WebDriver webDriver;
	private StartPage startPage;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		// server URL
		serverUrl = System.getProperty("integration.test.server.url");
		if (serverUrl == null) {
			serverUrl = "http://localhost:8080"; // default server as define in
													// pom.xml
		}
		System.out.println("Integration test is running with server URL "
				+ serverUrl);

		// applicationRelPath
		applicationRelPath = System
				.getProperty("integration.test.application.relpath");
		if (applicationRelPath == null) {
			applicationRelPath = "/espm-cloud-web/retailer"; // default
																// application
																// relpath
		}
		System.out.println("Integration test is running with application "
				+ applicationRelPath);

		// Get screenshot folder
		String screenshotPath = System
				.getProperty("integration.test.screenshot.path");
		if (screenshotPath == null) {
			screenshotPath = "./target/screenshots"; // default project relative
		}
		screenshotFolder = new File(screenshotPath, URLEncoder.encode(
				serverUrl, "utf-8"));
		if (!screenshotFolder.exists()) {
			screenshotFolder.mkdirs();
		}
		screenshotFolder = screenshotFolder.getCanonicalFile();
		System.out.println("Screenshots are saved in "
				+ screenshotFolder.getAbsolutePath());

	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {

	}

	@Before
	public void setUp() throws Exception {

		Logger logger = LoggerFactory.getLogger(EspmRetailerIT.class);
		try {

			HttpClient client = new DefaultHttpClient();

			// create a dummy sales order
			HttpPost postReq = new HttpPost(serverUrl
					+ "/espm-cloud-web/espm.svc/"
					+ SalesOrderHeaderODataIT.ENTITY_NAME);
			postReq.setHeader("Content-Type", "application/json");
			// Buy a Notebook for customer id 100000000
			postReq.setEntity(new StringEntity(
					"{\"CustomerId\":\"100000000\",\"SalesOrderItems\":[{\"ProductId\":\"HT-1000\",\"ItemNumber\":10,\"Quantity\":\"1\",\"QuantityUnit\":\"EA\",\"DeliveryDate\":\"2013-07-01T11:55:00\"}]}"));
			HttpResponse resp = client.execute(postReq);

			logger.info(EntityUtils.toString(resp.getEntity()));
			logger.info(resp.getStatusLine().getStatusCode() + "");

			if (resp.getStatusLine().getStatusCode() == HttpStatus.SC_CREATED) {

				String soURL = resp.getHeaders("Location")[0].getValue();

				logger.info("url " + soURL);

				// link customer to sales order
				HttpPut putRequest = new HttpPut(soURL + "/$links/Customer");
				putRequest.setEntity(new StringEntity(
						"{\"uri\":\"Customers('100000000')\"}"));
				putRequest.setHeader("Content-Type", "application/json");
				client = new DefaultHttpClient();
				HttpResponse resp1 = client.execute(putRequest);
				logger.info(resp1.getStatusLine().toString());

				// link Product to SalesOrder item
				String soID = soURL.substring(soURL.indexOf("('") + 2);
				soID = soID.substring(0, soID.length() - 2);
				putRequest = new HttpPut(
						serverUrl
								+ "/espm-cloud-web/espm.svc/SalesOrderItems(ItemNumber=10,SalesOrderId='"
								+ soID + "')/$links/Product");
				putRequest.setEntity(new StringEntity(
						"{\"uri\":\"Products('HT-1000')\"}"));
				putRequest.setHeader("Content-Type", "application/json");
				client = new DefaultHttpClient();
				resp1 = client.execute(putRequest);
				logger.info(resp1.getStatusLine().toString());
			}

		} catch (Exception e) {

			logger.error("Error occured during creation of Sales Order Header. Detailed info: "
					+ e);
		}
		// webDriver = new FirefoxDriver();

		// Open home page on Firefox, i.e. installed web browser Firefox
		// required as described in readme.txt
		final DesiredCapabilities capabilities = new DesiredCapabilities();
		final String proxyHost = System.getProperty("http.proxyHost");
		final String proxyPort = System.getProperty("http.proxyPort");
		if (proxyHost != null) {
			System.out
					.println("Configuring Firefox Selenium web driver with proxy "
							+ proxyHost
							+ (proxyPort == null ? "" : ":" + proxyPort)
							+ " (requires Firefox browser)");
			final Proxy proxy = new Proxy();
			final String proxyString = proxyHost
					+ (proxyPort == null ? "" : ":" + proxyPort);
			proxy.setHttpProxy(proxyString).setSslProxy(proxyString);
			proxy.setNoProxy("localhost");
			capabilities.setCapability(CapabilityType.PROXY, proxy);
		} else {
			System.out
					.println("Configuring Firefox Selenium web driver without proxy (requires Firefox browser)");
		}

		// instantiate firefox driver
		webDriver = new FirefoxDriver(capabilities);
		webDriver.manage().timeouts().implicitlyWait(2, TimeUnit.SECONDS);
		webDriver.manage().window().maximize();

		// launch the browser with the application URL
		startPage = new StartPage(webDriver, serverUrl + applicationRelPath);

	}

	@After
	public void tearDown() throws Exception {
		takeFinalScreenshot();
		webDriver.quit();

	}

	// saving the screenshots for failure instance
	private void takeFinalScreenshot() throws IOException {
		final File tempFile = ((TakesScreenshot) webDriver)
				.getScreenshotAs(OutputType.FILE);
		final String targetName = getClass().getSimpleName() + "."
				+ testName.getMethodName() + ".png";
		final File targetFile = new File(screenshotFolder, targetName);
		FileUtils.copyFile(tempFile, targetFile);
		System.out.println("Screenshot for test " + testName.getMethodName()
				+ " saved in " + targetFile.getAbsolutePath());
	}

	@Test
	public void test() throws InterruptedException {
		// webDriver.get("http://localhost:8080/espm-model-web/retailer");

		// enter the username
		startPage.username();

		// enter the password
		startPage.password();

		// click on the login button
		startPage.login();

		webDriver.manage().timeouts().implicitlyWait(2, TimeUnit.SECONDS);

		startPage.navigateToStock();

		// go to salesorder
		SalesOrderView salesorder = startPage.navigateToSO();
		assertTrue(salesorder.isSOTableAvailable());

		// click on the customer name
		salesorder.selectcustomer();

		// select the SO
		assertTrue(salesorder.isSOTableInCustomerAvailable());

		Thread.sleep(3000);

		// select the sales order
		salesorder.selectcustsalesorder();

		Thread.sleep(2000);

		// select Accept
		salesorder.selectaccept();

		// validate the status
		// assertTrue(salesorder.isSOAccepted());

		Thread.sleep(2000);

		// click on Close
		salesorder.selectclose();

		Thread.sleep(2000);

		// select the salesorder
		salesorder.selectsalesorder();

		Thread.sleep(1000);

		// select cancel
		salesorder.cancel();

		Thread.sleep(1000);

		// go to stock
		StockView stockview = startPage.navigateToStock();

		assertTrue(stockview.isStockTableAvailable());

		Thread.sleep(2000);

		stockview.clickTarget();
		Thread.sleep(2000);

		stockview.enterMinStock();
		Thread.sleep(2000);

		stockview.focusUpdate();

		stockview.clickUpdate();

		Thread.sleep(2000);

		startPage.navigateToSO();

		Thread.sleep(2000);

		// go to stock
		stockview = startPage.navigateToStock();

		assertTrue(stockview.isStockTableAvailable());

		Thread.sleep(2000);

		stockview.openOrderDialog();

		Thread.sleep(1000);

		stockview.placePurchaseOrder();
		Thread.sleep(2000);
	}

}

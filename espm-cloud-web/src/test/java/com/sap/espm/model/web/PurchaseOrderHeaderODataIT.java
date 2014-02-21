package com.sap.espm.model.web;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.Random;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.junit.Test;

import com.sap.espm.model.web.util.HttpResponse;
import com.sap.espm.model.web.util.RequestExecutionHelper;
import com.sap.espm.model.web.util.StreamHelper;

public class PurchaseOrderHeaderODataIT extends AbstractODataIT {
	Random rand = new Random();
	private final String ENTITY_NAME = "PurchaseOrderHeaders";
	private static final String PO_FILENAME = "com/sap/espm/model/web/purchaseOrder.xml";
	private static final String POH_FILENAME = "com/sap/espm/model/web/purchaseOrderHeader.xml";

	/**
	 * Test Create Purchase Order Header via URL.
	 * 
	 * @throws IOException
	 * @throws JSONException
	 */
	@Test
	public void testCreatePurchaseOrderHeaderViaREST() throws IOException,
			JSONException {
		String purchaseOrderHeaderXml = StreamHelper.readFromFile(POH_FILENAME);
		String id = RequestExecutionHelper.createEntityViaREST(ENTITY_NAME,
				purchaseOrderHeaderXml, true);
		HttpResponse resp = RequestExecutionHelper.executeGetRequest(
				ENTITY_NAME + "?$format=json&$filter=PurchaseOrderId%20eq%20'"
						+ id + "'", true);
		assertEquals("Purchase Order not persisted", HttpURLConnection.HTTP_OK,
				resp.getResponseCode());
		JSONArray ja = RequestExecutionHelper.getJSONArrayofResults(resp
				.getBody());
		assertNotNull("Unable to parse JSON response", ja);
		JSONObject jo = (JSONObject) ja.get(0);
		assertEquals(
				"Added Purchase Order Header via REST not persisted in db", id,
				jo.getString("PurchaseOrderId"));
		resp = RequestExecutionHelper.executeDeleteRequest(ENTITY_NAME + "('"
				+ id + "')", true);
		assertEquals(
				"Unable to delete Purchase Order Header via REST or incorrect HTTP Response Code:"
						+ resp.getResponseMessage(), HttpURLConnection.HTTP_OK,
				resp.getResponseCode());
	}

	/**
	 * Test create Purchase Order via URL
	 * 
	 * @throws IOException
	 * @throws JSONException
	 */
	@Test
	public void testCreatPurchaseOrderViaREST() throws IOException,
			JSONException {
		String purchaseOrderXml = StreamHelper.readFromFile(PO_FILENAME);
		String id = RequestExecutionHelper.createPurchaseOrderViaREST(
				ENTITY_NAME, purchaseOrderXml, true);
		HttpResponse resp = RequestExecutionHelper.executeGetRequest(
				ENTITY_NAME + "?$format=json&$filter=PurchaseOrderId%20eq%20'"
						+ id + "'", true);
		assertEquals("Purchase Order not persisted", HttpURLConnection.HTTP_OK,
				resp.getResponseCode());
		JSONArray ja = RequestExecutionHelper.getJSONArrayofResults(resp
				.getBody());
		assertNotNull("Unable to parse JSON response", ja);
		JSONObject jo = (JSONObject) ja.get(0);
		assertEquals(
				"Added Purchase Order Header via REST not persisted in db", id,
				jo.getString("PurchaseOrderId"));
		resp = RequestExecutionHelper.executeDeleteRequest(ENTITY_NAME + "('"
				+ id + "')", true);
		assertEquals(
				"Unable to delete Purchase Order Header via REST or incorrect HTTP Response Code:"
						+ resp.getResponseMessage(), HttpURLConnection.HTTP_OK,
				resp.getResponseCode());

	}

	/**
	 * Test create Purchase Order by an anonymous user.
	 * 
	 * @throws IOException
	 * @throws JSONException
	 */
	@Test
	public void testCreatPurchaseOrderByAnonymous() throws IOException,
			JSONException {
		String purchaseOrderXml = StreamHelper.readFromFile(PO_FILENAME);
		String id = RequestExecutionHelper.createPurchaseOrderViaREST(
				ENTITY_NAME, purchaseOrderXml, false);

		assertNull("Purchase Order Header created by Anonymous user", id);

	}

	/**
	 * Test GetPurchase Order by an anonymous user.
	 * 
	 * @throws IOException
	 * @throws JSONException
	 */
	@Test
	public void testGetPurchaseOrderByAnonymous() throws IOException,
			JSONException {
		String purchaseOrderXml = StreamHelper.readFromFile(PO_FILENAME);
		String id = RequestExecutionHelper.createPurchaseOrderViaREST(
				ENTITY_NAME, purchaseOrderXml, true);
		HttpResponse resp = RequestExecutionHelper.executeGetRequest(
				ENTITY_NAME + "?$format=json&$filter=PurchaseOrderId%20eq%20'"
						+ id + "'", false);
		assertEquals(
				"PurchaseOrderHeader OData service not secured for HTTP GET request",
				HttpURLConnection.HTTP_UNAUTHORIZED, resp.getResponseCode());
		resp = RequestExecutionHelper.executeDeleteRequest(ENTITY_NAME + "('"
				+ id + "')", true);
		assertEquals(
				"Unable to delete Sales Order Header via REST or incorrect HTTP Response Code:"
						+ resp.getResponseMessage(), HttpURLConnection.HTTP_OK,
				resp.getResponseCode());

	}

}

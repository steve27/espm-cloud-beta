package com.sap.espm.model.web;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

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

public class PurchaseOrderItemODataIT extends AbstractODataIT {
	private final String ENTITY_NAME = "PurchaseOrderItems";
	private static final String FILENAME = "com/sap/espm/model/web/purchaseOrderItem.xml";
	private static final String POH_FILENAME = "com/sap/espm/model/web/purchaseOrderHeader.xml";
	Random rand = new Random();

	/**
	 * Create Purchase Order Item via URL.
	 * 
	 * @throws IOException
	 * @throws JSONException
	 */
	@Test
	public void testCreatePurchaseOrderItemViaREST() throws IOException,
			JSONException {
		String purchaseOrderItemXml = StreamHelper.readFromFile(FILENAME);
		String purchaseOrderHeaderXml = StreamHelper.readFromFile(POH_FILENAME);
		String poid = RequestExecutionHelper.createEntityViaREST(
				"PurchaseOrderHeaders", purchaseOrderHeaderXml, true);
		purchaseOrderItemXml = purchaseOrderItemXml.replace(
				"<d:PurchaseOrderId>700000001</d:PurchaseOrderId>",
				"<d:PurchaseOrderId>" + poid + "</d:PurchaseOrderId>");
		String id = RequestExecutionHelper.createEntityViaREST(ENTITY_NAME,
				purchaseOrderItemXml, true);
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
		resp = RequestExecutionHelper.executeDeleteRequest(ENTITY_NAME
				+ "(PurchaseOrderId='" + id + "',ItemNumber=10)", true);
		assertEquals(
				"Unable to delete Purchase Order Header via REST or incorrect HTTP Response Code:"
						+ resp.getResponseMessage(), HttpURLConnection.HTTP_OK,
				resp.getResponseCode());
		resp = RequestExecutionHelper.executeDeleteRequest(
				"PurchaseOrderHeaders('" + poid + "')", true);
	}
}

package com.sap.espm.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.math.BigDecimal;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import org.junit.Test;

import com.sap.espm.model.util.TestFactory;

/**
 * JUnits for Purchase Order Item JPA Entity
 * 
 */
public class PurchaseOrderItemTest extends AbstractTest {
	PurchaseOrderItem poItem = null;

	/**
	 * Test if a single Purchase Order Item can be added and checks if it exists
	 * via entitymanager.find.
	 */
	@Test
	public void testExisitingPurchaseOrderItemSearchFind() {
		EntityManager em = emf.createEntityManager();
		String poId = "99999";
		int itemNumber = 10;
		TestFactory tf = new TestFactory();
		PurchaseOrderItem poItemAct = null;
		try {
			// Add Purchase Order Item
			assertTrue("Purchase order item not created",
					tf.createPurchaseOrderItem(em, poId, itemNumber));
			// Search Purchase Order Item.
			poItemAct = em.find(PurchaseOrderItem.class,
					new PurchaseOrderItemId(poId, itemNumber));

			assertNotNull(
					"Search via find method: Added Purchase Order Item not persisted in database",
					poItemAct);
			if (poItemAct != null) {
				assertEquals(
						"Added Purchase Order Item Currency Code not persisted in the database ",
						"INR", poItemAct.getCurrencyCode());
				tf.deletePurchaseOrderItem(em, poId, itemNumber);
			}

		} finally {
			em.close();
		}
	}

	/**
	 * Tests for a existing single Purchase Order Item via
	 * TypedQuery-SetParamter
	 */
	@Test
	public void testExisitingPurchaseOrderItemSearchTyped() {
		EntityManager em = emf.createEntityManager();
		String poId = "11111";
		int itemNumber = 10;
		TestFactory tf = new TestFactory();
		PurchaseOrderItem poItemAct = null;
		try {
			// Add Purchase Order Item
			assertTrue("Purchase Order Item",
					tf.createPurchaseOrderItem(em, poId, itemNumber));
			// Search for Purchase Order Item
			TypedQuery<PurchaseOrderItem> query = em
					.createQuery(
							"SELECT poi FROM PurchaseOrderItem poi WHERE poi.purchaseOrderItemId.purchaseOrderId=:id",
							PurchaseOrderItem.class);

			poItemAct = query.setParameter("id", poId).getSingleResult();

			assertEquals(
					"Search via typed query for existing Purchase order item: Added Purchase order item Gross Amount not persisted in the database",
					BigDecimal.valueOf(13224), poItemAct.getGrossAmount());
			tf.deletePurchaseOrderItem(em, poId, itemNumber);
		} finally {
			em.close();
		}
	}

	/**
	 * Test if PurchaseOrderItem gets updated in database.
	 */
	@Test
	public void testUpdatePurchaseOrderItem() {
		PurchaseOrderItem poItemAct = null;
		String poId = "111110";
		int itemNumber = 10;
		TestFactory tf = new TestFactory();
		EntityManager em = emf.createEntityManager();
		try {
			if (!tf.createPurchaseOrderItem(em, poId, itemNumber)) {
				fail("Unable to create Purchase Order Item");
				return;
			}
			em.getTransaction().begin();
			// Find Purchase Order Item for update.
			poItem = em.find(PurchaseOrderItem.class, new PurchaseOrderItemId(
					poId, itemNumber));
			// Update Purchase Order Item.
			poItem.setCurrencyCode("EUR");
			em.persist(poItem);
			em.getTransaction().commit();
			// Find Purchase Order Item after update.
			poItemAct = em.find(PurchaseOrderItem.class,
					new PurchaseOrderItemId(poId, itemNumber));
			assertEquals(
					"Update Purchase Orde Item: Purchase Order Item attribute Purchase Order Item Position not updated in the database",
					"EUR", poItemAct.getCurrencyCode());
			tf.deletePurchaseOrderItem(em, poId, itemNumber);
		} finally {
			em.close();
		}
	}

	/**
	 * Test if Purchase Order Item can be removed from database.
	 */
	@Test
	public void testRemovePurchaseOrderItem() {
		PurchaseOrderItem poItemAct = null;
		String poId = "11112";
		int itemNumber = 10;
		TestFactory tf = new TestFactory();
		EntityManager em = emf.createEntityManager();
		try {
			if (!tf.createPurchaseOrderItem(em, poId, itemNumber)) {
				fail("Unable to createPurchase Order Item");
				return;
			}
			em.getTransaction().begin();
			// Remove Item
			assertTrue("Purchase Order Item not deleted",
					tf.deletePurchaseOrderItem(em, poId, itemNumber));
			// Check for deleted Purchase Order Item
			poItemAct = em.find(PurchaseOrderItem.class,
					new PurchaseOrderItemId(poId, itemNumber));
			assertNull(
					"Search via find method for removed Purchase Order Item: Removed Purchase Order Item with ID "
							+ poId + " still exists ", poItemAct);
		} finally {
			em.close();
		}
	}

}

package com.sap.espm.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import org.junit.Test;

import com.sap.espm.model.util.TestFactory;

/**
 * JUnits for PurchaseOrderHeader JPA entity.
 * 
 */
public class PurchaseOrderHeaderTest extends AbstractTest {
	PurchaseOrderHeader poHeader = null;

	/**
	 * Test if a single Purchase Order Header can be added and checks if it
	 * exists via entitymanager.find.
	 */
	@Test
	public void testExisitingPurchaseOrderHeaderSearchFind() {
		String poHeadId = "99999";
		EntityManager em = emf.createEntityManager();
		TestFactory tf = new TestFactory();
		PurchaseOrderHeader poHeaderAct = null;
		try {
			// Add Purchase Order Header
			assertTrue("Purchase Order Header not created",
					tf.createPurchaseOrderHeader(em, poHeadId));

			// Search Purchase Order Header
			poHeaderAct = em.find(PurchaseOrderHeader.class, poHeadId);

			assertNotNull(
					"Search via find method: Added Purchase Order Header not persisted in database",
					poHeaderAct);
			if (poHeaderAct != null) {
				assertEquals(
						"Added Purchase Order Header Currency Code not persisted in the database ",
						"INR", poHeaderAct.getCurrencyCode());
				tf.deletePurchaseOrderHeader(em, poHeadId);
			}

		} finally {
			em.close();
		}
	}

	/**
	 * Tests for a existing single Purchase Order Header via
	 * TypedQuery-SetParamter
	 */
	@Test
	public void testExisitingPurchaseOrderHeaderSearchTyped() {
		EntityManager em = emf.createEntityManager();
		String poHeadId = "91111";
		TestFactory tf = new TestFactory();
		PurchaseOrderHeader poHeaderAct = null;
		try {
			// Add Purchase Order Header
			assertTrue("Purchase Order Header not created",
					tf.createPurchaseOrderHeader(em, poHeadId));
			// Search for Purchase Order Header.
			TypedQuery<PurchaseOrderHeader> query = em
					.createQuery(
							"SELECT po FROM PurchaseOrderHeader po WHERE po.purchaseOrderId=:id",
							PurchaseOrderHeader.class);

			poHeaderAct = query.setParameter("id", poHeadId).getSingleResult();

			assertEquals(
					"Search via typed query for existing Purchase order header: Added Purchase order header not persisted in the database",
					poHeadId, poHeaderAct.getPurchaseOrderId());
			tf.deletePurchaseOrderHeader(em, poHeadId);
		} finally {
			em.close();
		}
	}

	/**
	 * Test removing of a Purchase Order Header.
	 */
	@Test
	public void testRemovePurchasesOrderHeader() {
		PurchaseOrderHeader poHeaderAct = null;
		String poHeadId = "111112";
		TestFactory tf = new TestFactory();
		EntityManager em = emf.createEntityManager();
		try {
			if (!tf.createPurchaseOrderHeader(em, poHeadId)) {
				fail("Unable to create PurchaseOrder Header");
				return;
			}
			em.getTransaction().begin();
			// Remove Purchase Order Header.
			assertTrue("Purchase Order Header not deleted",
					tf.deletePurchaseOrderHeader(em, poHeadId));
			// Check for deleted Purchase Order Header
			poHeaderAct = em.find(PurchaseOrderHeader.class, poHeadId);
			assertNull(
					"Search via find method for removed Purchase Order Header: Removed Purchase Order Header with ID "
							+ poHeadId + " still exists ", poHeaderAct);
		} finally {
			em.close();
		}
	}

}

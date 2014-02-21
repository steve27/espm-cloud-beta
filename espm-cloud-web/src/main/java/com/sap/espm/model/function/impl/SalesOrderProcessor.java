package com.sap.espm.model.function.impl;

import java.util.Locale;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;

import com.sap.core.odata.api.annotation.edm.FunctionImport;
import com.sap.core.odata.api.annotation.edm.FunctionImport.Multiplicity;
import com.sap.core.odata.api.annotation.edm.FunctionImport.ReturnType;
import com.sap.core.odata.api.annotation.edm.Parameter;
import com.sap.core.odata.api.commons.HttpStatusCodes;
import com.sap.core.odata.api.exception.ODataApplicationException;
import com.sap.core.odata.api.exception.ODataException;
import com.sap.espm.model.SalesOrderHeader;
import com.sap.espm.model.util.Utility;

/**
 * 
 * Function Import processor class for Sales Orders
 * 
 */
public class SalesOrderProcessor {

	/**
	 * Function Import implementation for confirming a sales order
	 * 
	 * @param salesOrderId
	 *            sales order id of sales order to be confirmed
	 * @return SalesOrderHeader entity
	 * @throws ODataException
	 */
	@FunctionImport(name = "ConfirmSalesOrder", entitySet = "SalesOrderHeaders", returnType = ReturnType.ENTITY_TYPE, multiplicity = Multiplicity.ONE)
	public SalesOrderHeader confirmSalesOrder(
			@Parameter(name = "SalesOrderId") String salesOrderId)
			throws ODataException {
		EntityManagerFactory emf = Utility.getEntityManagerFactory();
		EntityManager em = emf.createEntityManager();
		try {
			TypedQuery<SalesOrderHeader> query = em
					.createQuery(
							"SELECT s FROM SalesOrderHeader s WHERE s.salesOrderId = :salesOrderId",
							SalesOrderHeader.class);
			try {
				SalesOrderHeader so = query.setParameter("salesOrderId",
						salesOrderId).getSingleResult();
				em.getTransaction().begin();
				so.setLifeCycleStatus("P");
				so.setLifeCycleStatusName("In Process");
				em.persist(so);
				em.getTransaction().commit();
				query = em
						.createQuery(
								"SELECT s FROM SalesOrderHeader s WHERE s.salesOrderId = :salesOrderId",
								SalesOrderHeader.class);
				return query.setParameter("salesOrderId", salesOrderId)
						.getSingleResult();

			} catch (NoResultException e) {
				throw new ODataApplicationException(
						"No Sales Order with Sales Order Id:" + salesOrderId,
						Locale.ENGLISH, HttpStatusCodes.BAD_REQUEST);
			}
		} finally {
			em.close();
		}
	}

	/**
	 * Function Import implementation for cancelling a sales order
	 * 
	 * @param salesOrderId
	 *            sales order id of sales order to be cancelled
	 * @return SalesOrderHeader entity
	 * @throws ODataException
	 */
	@FunctionImport(name = "CancelSalesOrder", entitySet = "SalesOrderHeaders", returnType = ReturnType.ENTITY_TYPE, multiplicity = Multiplicity.ONE)
	public SalesOrderHeader cancelSalesOrder(
			@Parameter(name = "SalesOrderId") String salesOrderId)
			throws ODataException {
		EntityManagerFactory emf = Utility.getEntityManagerFactory();
		EntityManager em = emf.createEntityManager();
		try {
			TypedQuery<SalesOrderHeader> query = em
					.createQuery(
							"SELECT s FROM SalesOrderHeader s WHERE s.salesOrderId = :salesOrderId",
							SalesOrderHeader.class);
			try {
				SalesOrderHeader so = query.setParameter("salesOrderId",
						salesOrderId).getSingleResult();
				em.getTransaction().begin();
				so.setLifeCycleStatus("X");
				so.setLifeCycleStatusName("Cancelled");
				em.persist(so);
				em.getTransaction().commit();
				query = em
						.createQuery(
								"SELECT s FROM SalesOrderHeader s WHERE s.salesOrderId = :salesOrderId",
								SalesOrderHeader.class);
				return query.setParameter("salesOrderId", salesOrderId)
						.getSingleResult();
			} catch (NoResultException e) {
				throw new ODataApplicationException(
						"No Sales Order with Sales Order Id:" + salesOrderId,
						Locale.ENGLISH, HttpStatusCodes.BAD_REQUEST);
			}
		} finally {
			em.close();
		}
	}

}

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
import com.sap.espm.model.Customer;
import com.sap.espm.model.util.Utility;

/**
 * 
 * Function Import processor class for Customer
 * 
 */
public class CustomerProcessor {

	/**
	 * Function Import implementation for getting customer by email address
	 * 
	 * @param emailAddress
	 *            email address of the customer
	 * @return customer entity.
	 * @throws ODataException
	 */
	@FunctionImport(name = "GetCustomerByEmailAddress", entitySet = "Customers", returnType = ReturnType.ENTITY_TYPE, multiplicity = Multiplicity.ONE)
	public Customer getCustomerByEmailAddress(
			@Parameter(name = "EmailAddress") String emailAddress)
			throws ODataException {
		EntityManagerFactory emf = Utility.getEntityManagerFactory();
		EntityManager em = emf.createEntityManager();
		try {
			TypedQuery<Customer> query = em
					.createQuery(
							"SELECT c FROM Customer c WHERE c.emailAddress = :emailAddress",
							Customer.class);
			try {
				return query.setParameter("emailAddress", emailAddress)
						.getSingleResult();

			} catch (NoResultException e) {
				throw new ODataApplicationException(
						"No matching customer with Email Address:"
								+ emailAddress, Locale.ENGLISH,
						HttpStatusCodes.BAD_REQUEST);
			}
		} finally {
			em.close();
		}
	}

}

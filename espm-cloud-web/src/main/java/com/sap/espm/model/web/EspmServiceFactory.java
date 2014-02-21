package com.sap.espm.model.web;

import javax.persistence.EntityManagerFactory;

import com.sap.core.odata.core.exception.ODataRuntimeException;
import com.sap.core.odata.processor.api.jpa.ODataJPAContext;
import com.sap.core.odata.processor.api.jpa.ODataJPAServiceFactory;
import com.sap.core.odata.processor.api.jpa.exception.ODataJPARuntimeException;

/**
 * Odata JPA Processor implementation class
 */
public class EspmServiceFactory extends ODataJPAServiceFactory {

	private static final String PERSISTENCE_UNIT_NAME = "com.sap.espm.model";

	@Override
	public ODataJPAContext initializeODataJPAContext()
			throws ODataJPARuntimeException {
		ODataJPAContext oDataJPAContext = this.getODataJPAContext();
		try {
			EntityManagerFactory emf = JpaEntityManagerFactory
					.getEntityManagerFactory();
			oDataJPAContext.setEntityManagerFactory(emf);
			oDataJPAContext.setPersistenceUnitName(PERSISTENCE_UNIT_NAME);
			oDataJPAContext.setJPAEdmExtension(new EspmProcessingExtension());
			oDataJPAContext.setJPAEdmMappingModel("EspmEdmMapping.xml");
			return oDataJPAContext;
		} catch (Exception e) {
			throw new ODataRuntimeException(e);
		}

	}
}

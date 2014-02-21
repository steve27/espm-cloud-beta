package com.sap.espm.model.web;

import com.sap.core.odata.processor.api.jpa.model.JPAEdmExtension;
import com.sap.core.odata.processor.api.jpa.model.JPAEdmSchemaView;
import com.sap.espm.model.function.impl.CustomerProcessor;
import com.sap.espm.model.function.impl.SalesOrderProcessor;

/**
 * 
 * Class for registering function imports.
 * 
 */
public class EspmProcessingExtension implements JPAEdmExtension {

	/**
	 * Register function imports.
	 */
	@Override
	public void extend(JPAEdmSchemaView view) {
		view.registerOperations(CustomerProcessor.class, null);
		view.registerOperations(SalesOrderProcessor.class, null);
	}

	@Override
	public void extendWithOperation(JPAEdmSchemaView view) {

	}

	@Override
	public void extendJPAEdmSchema(JPAEdmSchemaView view) {

	}
}

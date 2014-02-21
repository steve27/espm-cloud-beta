package com.sap.espm.model.web;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({ CustomerODataIT.class, ProductCategoryODataIT.class,
		ProductODataIT.class, SalesOrderHeaderODataIT.class,
		PurchaseOrderHeaderODataIT.class, SupplierODataIT.class,
		SalesOrderItemODataIT.class, PurchaseOrderItemODataIT.class })
public class AllODataTests {

}

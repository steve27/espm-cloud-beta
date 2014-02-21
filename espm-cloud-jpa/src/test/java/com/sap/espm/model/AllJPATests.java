package com.sap.espm.model;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({ CustomerTest.class, ProductTest.class,
		SalesOrderHeaderTest.class, SalesOrderItemTest.class, StockTest.class,
		SupplierTest.class, PurchaseOrderHeaderTest.class,
		PurchaseOrderItemTest.class, ProductCategoryTest.class })
public class AllJPATests {

}

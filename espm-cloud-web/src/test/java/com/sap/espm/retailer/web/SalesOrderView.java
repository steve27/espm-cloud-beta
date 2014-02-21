package com.sap.espm.retailer.web;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.internal.seleniumemulation.JavascriptLibrary;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class SalesOrderView {

	private WebDriver driver;

	@FindBy(id = "__link0-col0-row0")
	private WebElement customer;

	@FindBy(id = "__link1-col1-row0")
	private WebElement sono;

	@FindBy(id = "__link2-col0-row0")
	private WebElement csalesorder;

	@FindBy(id = "__inspector1-actionBar-items-sales-order-acceptButton")
	private WebElement accept;

	@FindBy(id = "__inspector0-actionBar-cust-sales-order-closeButton")
	private WebElement close;

	@FindBy(id = "__inspector1-actionBar-items-sales-order-closeButton")
	private WebElement cancel;

	// __image2-__repeater0-0(product image)

	public SalesOrderView(WebDriver webDriver) {
		// initialize the webdriver
		PageFactory.initElements(webDriver, this);
		driver = webDriver;
	}

	public boolean isSOTableAvailable() {
		// verify that the sales order table is available
		if (driver.findElement(By.id("sales-order-main-table-table")) != null) {
			return true;
		} else {
			return false;
		}
	}

	public void selectcustomer() {
		customer.click();
	}

	public void selectsalesorder() {
		sono.click();
	}

	public boolean isSOTableInCustomerAvailable() {
		if (driver.findElement(By.id("customerSOTable")) != null) {
			return true;
		} else {
			return false;
		}
	}

	public void selectcustsalesorder() {
		csalesorder.click();
	}

	public void selectaccept() {

		JavascriptLibrary jsLib = new JavascriptLibrary();
		jsLib.callEmbeddedSelenium(driver, "triggerMouseEventAt", accept,
				"click", "0,0");

		// accept.click();
	}

	public boolean isSOAccepted() {
		// verify that the sales order is accepted
		if (driver.findElement(By.id("__image1-col2-row0")) != null) {
			return true;
		} else {
			return false;
		}
	}

	public void selectclose() {

		JavascriptLibrary jsLib = new JavascriptLibrary();
		jsLib.callEmbeddedSelenium(driver, "triggerMouseEventAt", close,
				"click", "0,0");

		// close.click();
	}

	public void cancel() {

		JavascriptLibrary jsLib = new JavascriptLibrary();
		jsLib.callEmbeddedSelenium(driver, "triggerMouseEventAt", cancel,
				"click", "0,0");

		// cancel.click();
	}

}

package com.sap.espm.retailer.web;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.internal.seleniumemulation.JavascriptLibrary;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class StockView {

	private WebDriver driver;

	@FindBy(id = "stock-main-table-table")
	private WebElement stocktable;

	@FindBy(id = "__link5-col3-row0")
	private WebElement targetstock;

	@FindBy(id = "__view43")
	private WebElement itemsinstock;

	@FindBy(id = "__field4")
	private WebElement minstock;

	@FindBy(id = "__inspector3-actionBar-updateButton")
	private WebElement update;

	@FindBy(id = "__button0-col4-row0")
	private WebElement orderButton;

	@FindBy(id = "__inspector2-actionBar-orderButton")
	private WebElement orderPurchaseOrder;

	public StockView(WebDriver webDriver) {
		// initialize the webdriver
		PageFactory.initElements(webDriver, this);
		driver = webDriver;
	}

	public boolean isStockTableAvailable() {
		// verify that the address field is available
		if (driver.findElement(By.id("stock-main-table-table")) != null) {
			return true;
		} else {
			return false;
		}
	}

	public void clickTarget() {
		targetstock.click();
	}

	public void enterMinStock() {
		String value = itemsinstock.getAttribute("title");
		int increment = 10;
		int newValue = 100;
		if (value.contains(".")) {
			newValue = (Integer
					.parseInt(value.substring(0, value.indexOf("."))) + increment);
		} else {
			newValue = (Integer.parseInt(value) + increment);
		}
		minstock.clear();
		minstock.sendKeys(newValue + "");
	}

	public void clickUpdate() {
		JavascriptLibrary jsLib = new JavascriptLibrary();
		jsLib.callEmbeddedSelenium(driver, "triggerMouseEventAt", update,
				"click", "1,1");

		// update.click();
	}

	public void openOrderDialog() {
		orderButton.click();
	}

	public void placePurchaseOrder() {
		JavascriptLibrary jsLib = new JavascriptLibrary();
		jsLib.callEmbeddedSelenium(driver, "triggerMouseEventAt",
				orderPurchaseOrder, "click", "0,0");

		// orderPurchaseOrder.click();
	}

	public void focusUpdate() {
		new Actions(driver).moveToElement(update).perform();

	}

}

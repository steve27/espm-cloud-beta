package com.sap.espm.retailer.web;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class StartPage {

	private WebDriver driver;

	@FindBy(id = "j_username")
	private WebElement username;

	@FindBy(id = "j_password")
	private WebElement password;

	@FindBy(name = "login")
	private WebElement login;

	@FindBy(id = "nav-sales-orders")
	private WebElement salesorder;

	@FindBy(id = "nav-stock")
	private WebElement stock;

	/**
	 * Construct Selenium page object from home page loaded with given web
	 * driver from given application URL.
	 */

	public StartPage(WebDriver webDriver, String applicationUrl) {
		driver = webDriver;
		webDriver.get(applicationUrl);
		PageFactory.initElements(webDriver, this);
	}

	public void username() {
		username.sendKeys("ret");
	}

	public void password() {
		password.sendKeys("123");
	}

	public void login() {
		login.click();
	}

	public SalesOrderView navigateToSO() {
		salesorder.click();
		return new SalesOrderView(driver);
	}

	public StockView navigateToStock() {
		stock.click();
		return new StockView(driver);
	}

}

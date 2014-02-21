package com.sap.espm.shopping.web;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CheckoutAddressView {

	private WebDriver driver;

	@FindBy(id = "address-email")
	private WebElement emailInputField;

	@FindBy(id = "addr-firstname")
	private WebElement firstNameInputField;

	@FindBy(id = "addr-lastname")
	private WebElement lastNameInputField;

	@FindBy(id = "addr-street")
	private WebElement streetInputField;

	@FindBy(id = "addr-city")
	private WebElement cityInputField;

	@FindBy(id = "addr-zipcode")
	private WebElement zipcodeInputField;

	@FindBy(id = "addr-dob-input")
	private WebElement dateInputField;

	@FindBy(id = "rbg_customer-0")
	private WebElement existingCustomerRadioButton;

	@FindBy(id = "rbg_customer-1")
	private WebElement newCustomerRadioButton;

	@FindBy(id = "countries-ddlb-input")
	private WebElement countries;

	public CheckoutAddressView(WebDriver webDriver) {
		PageFactory.initElements(webDriver, this);
		driver = webDriver;
	}

	public void enterEmail(String text) {
		emailInputField.clear();
		emailInputField.sendKeys(text);
		emailInputField.sendKeys(Keys.RETURN);
	}

	public void enterFirstName(String text) {
		firstNameInputField.clear();
		firstNameInputField.sendKeys(text);
		firstNameInputField.sendKeys(Keys.RETURN);
	}

	public void enterLastName(String text) {
		lastNameInputField.clear();
		lastNameInputField.sendKeys(text);
		lastNameInputField.sendKeys(Keys.RETURN);
	}

	public void enterStreet(String text) {
		streetInputField.clear();
		streetInputField.sendKeys(text);
		streetInputField.sendKeys(Keys.RETURN);
	}

	public void enterCity(String text) {
		cityInputField.clear();
		cityInputField.sendKeys(text);
		cityInputField.sendKeys(Keys.RETURN);
	}

	public void enterZipcode(String text) {
		zipcodeInputField.clear();
		zipcodeInputField.sendKeys(text);
		zipcodeInputField.sendKeys(Keys.RETURN);
	}

	public void enterDateAsString(String text) {
		dateInputField.clear();
		dateInputField.sendKeys(text);
		dateInputField.sendKeys(Keys.RETURN);
	}

	public void switchToNewCustomer() {
		newCustomerRadioButton.click();
	}

	public void switchToExistingCustomer() {
		existingCustomerRadioButton.click();
	}

	public boolean isAddressFormAvailable() {
		// verify that the address field is available
		if (driver.findElement(By.id("address-fields")) != null) {
			return true;
		} else {
			return false;
		}
	}

	public boolean isCountryAvailable() {
		// verify that the address field is available and dropdown listbox not
		// empty
		if (countries != null && !countries.getAttribute("value").isEmpty()) {
			return true;
		} else {
			return false;
		}
	}

}

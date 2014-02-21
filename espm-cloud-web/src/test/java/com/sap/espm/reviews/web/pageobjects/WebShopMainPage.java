package com.sap.espm.reviews.web.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Page object for customer reviews view
 */
public class WebShopMainPage extends PageObject {

	@FindBy(id = "categories-list-body")
	private WebElement catListBodyDiv;

	@FindBy(id = "dontShowAgainBox")
	private WebElement dontShowAgainDisclaimerChkBox;

	@FindBy(id = "welcomePageOkButton")
	private WebElement disclaimerOkBtn;

	@FindBy(id = "main-settings")
	private WebElement settingsLnk;

	@FindBy(id = "nav-reviews")
	private WebElement reviewsWorksetItemLnk;

	@FindBy(id = "__alert0--btn-OK")
	private WebElement confirmRefreshBtn;

	public WebShopMainPage(WebDriver driver) {
		super(driver);
	}

	public static WebShopMainPage create(final WebDriver driver) {
		return PageObject.create(driver, WebShopMainPage.class);
	}

	@Override
	protected boolean isCurrentPage() {
		return checkElementIsDisplayed(catListBodyDiv);
	}

	public void waitForPageAfterRefresh() {
		this.checkIfWeAreOnCurrentPage();
	}

	public void confirmRefresh() {
		confirmRefreshBtn.click();
	}

	public void dontShowAgainDisclaimer() {
		dontShowAgainDisclaimerChkBox.click();
	}

	public void disclaimerOk() {
		disclaimerOkBtn.click();
	}

	public SettingsPage navigateToSettings() {
		settingsLnk.click();
		return PageObject.create(driver, SettingsPage.class);
	}

	public CustomerReviewsPage navigateToReviews() {
		reviewsWorksetItemLnk.click();
		return CustomerReviewsPage.create(driver);
	}

	public void waitForDisclaimer() {
		WebElement myDynamicElement = (new WebDriverWait(driver, 20))
				.until(ExpectedConditions.presenceOfElementLocated(By
						.id("welcomePageOkButton")));

	}
}

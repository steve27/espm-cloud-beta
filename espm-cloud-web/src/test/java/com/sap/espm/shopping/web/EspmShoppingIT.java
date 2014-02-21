package com.sap.espm.shopping.web;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestName;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.internal.seleniumemulation.JavascriptLibrary;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class EspmShoppingIT {

	/**
	 * Store name of currently executed test method in field.
	 */
	@Rule
	public TestName testName = new TestName();
	private static final String PRODUCT_SEARCH_STRING = "Laser";
	private static String serverUrl;
	private static String applicationRelPath;
	private static File screenshotFolder;

	private WebDriver webDriver;
	private StartPage startPage;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		// server URL
		serverUrl = System.getProperty("integration.test.server.url",
				"http://localhost:8080");
		System.out.println("Integration test is running with server URL "
				+ serverUrl);

		// applicationRelPath
		applicationRelPath = System
				.getProperty("integration.test.application.relpath");
		if (applicationRelPath == null) {
			// default application relpath
			applicationRelPath = "/espm-cloud-web/webshop/index.html";
		}
		System.out.println("Integration test is running with application "
				+ applicationRelPath);

		// Get screenshot folder
		String screenshotPath = System
				.getProperty("integration.test.screenshot.path");
		if (screenshotPath == null) {
			screenshotPath = "./target/screenshots"; // default project relative
		}
		screenshotFolder = new File(screenshotPath, URLEncoder.encode(
				serverUrl, "utf-8"));
		if (!screenshotFolder.exists()) {
			screenshotFolder.mkdirs();
		}
		screenshotFolder = screenshotFolder.getCanonicalFile();
		System.out.println("Screenshots are saved in "
				+ screenshotFolder.getAbsolutePath());

	}

	@Before
	public void setUp() throws Exception {
		// Open home page on Firefox, i.e. installed web browser Firefox
		// required as described in readme.txt
		final DesiredCapabilities capabilities = new DesiredCapabilities();
		final String proxyHost = System.getProperty("http.proxyHost");
		final String proxyPort = System.getProperty("http.proxyPort");
		if (proxyHost != null) {
			System.out
					.println("Configuring Firefox Selenium web driver with proxy "
							+ proxyHost
							+ (proxyPort == null ? "" : ":" + proxyPort)
							+ " (requires Firefox browser)");
			final Proxy proxy = new Proxy();
			final String proxyString = proxyHost
					+ (proxyPort == null ? "" : ":" + proxyPort);
			proxy.setHttpProxy(proxyString).setSslProxy(proxyString);
			proxy.setNoProxy("localhost");
			capabilities.setCapability(CapabilityType.PROXY, proxy);
		} else {
			System.out
					.println("Configuring Firefox Selenium web driver without proxy (requires Firefox browser)");
		}

		// instantiate firefox driver
		webDriver = new FirefoxDriver(capabilities);
		webDriver.manage().timeouts().implicitlyWait(2, TimeUnit.SECONDS);
		webDriver.manage().window().maximize();

		// launch the browser with the application URL
		startPage = new StartPage(webDriver, serverUrl + applicationRelPath);
	}

	@After
	public void tearDown() throws Exception {
		takeFinalScreenshot();

		webDriver.quit();
	}

	// saving the screenshots for failure instance
	private void takeFinalScreenshot() throws IOException {
		final File tempFile = ((TakesScreenshot) webDriver)
				.getScreenshotAs(OutputType.FILE);
		final String targetName = getClass().getSimpleName() + "."
				+ testName.getMethodName() + ".png";
		final File targetFile = new File(screenshotFolder, targetName);
		FileUtils.copyFile(tempFile, targetFile);
		System.out.println("Screenshot for test " + testName.getMethodName()
				+ " saved in " + targetFile.getAbsolutePath());
	}

	@Test
	public void testExistingCustomerOrdersProducts() {

		// handles the disclaimer pop up
		startPage.checkBox();
		startPage.selectOk();

		// In Firefox we fist have to navigate to the settings
		SettingsView settingsview = startPage.navigateToSettings();
		assertTrue(settingsview.isSettingView());

		// loop for three cases HANA Cloud (local + remote) and ABAP Backend
		// System
		for (int i = 0; i < 3; i++) {

			if (i == 0) { // (default) HANA Cloud local setting
				if (!settingsview.isHanaCloudLocalSelected()) {
					settingsview.switchToHanaCloudLocal();
				}
				settingsview.pressOk();
				startPage.doRefresh();
			} else if (i == 1) { // HANA Cloud remote setting
				SettingsView cloudsettingsview = startPage.navigateToSettings();
				cloudsettingsview.switchToHanaCloudRemote();
				cloudsettingsview.pressOk();
				startPage.doRefresh();
			} else { // ABAP Backend System setting
				SettingsView abapsettingsview = startPage.navigateToSettings();
				abapsettingsview.switchToAbapBackend();
				abapsettingsview.pressOk();
				startPage.doRefresh();
			}

			try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			// navigate to CHECKOUT
			startPage.navigateToCheckout();

			// navigate back to SHOPPING
			ShoppingAreaView shoppingArea = startPage.navigateToShopping();

			// verify that the categories are available
			ShoppingCategoriesView shoppingCategoriesView = shoppingArea
					.getCategoriesView();
			assertTrue(shoppingCategoriesView.areCategoriesAvailable());

			// choose Category 'Laser' and verify whether the products are
			// displayed under it
			ShoppingProductListView productListView = shoppingCategoriesView
					.clickCategoryLink();

			WebElement myDynamicElement = (new WebDriverWait(webDriver, 20))
					.until(ExpectedConditions.presenceOfElementLocated(By
							.id("product-rr-body")));

			assertFalse(productListView.isProductListEmpty());

			// navigate back to Categories
			productListView.navigateBackToCategories();

			// enter the search text
			ShoppingSearchView searchView = shoppingArea.getSearchView();
			productListView = searchView.searchFor(PRODUCT_SEARCH_STRING);

			try {
				Thread.sleep(4000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			// verify that the searched product is available
			assertFalse(productListView.isProductListEmpty());

			// select the 'Add to Cart' button of the selected product
			productListView.addToCart(PRODUCT_SEARCH_STRING);

			// verify that the added product is available in the cart
			ShoppingCartView shoppingCartView = startPage.openShoppingCart();
			assertFalse(shoppingCartView.isShoppingCartEmpty());

			// navigate to CHECKOUT
			CheckoutAreaView checkoutArea = startPage.navigateToCheckout();
			checkoutArea.getCheckoutShoppingCart();

			// choose 'Proceed'
			checkoutArea.navigateForward();
			CheckoutAddressView checkoutAddressView = checkoutArea
					.getAddressView();

			// the next roadmap step should not be active if the e-mail address
			// is not yet maintained
			assertFalse(checkoutArea.isRoadMapStepActive(3));
			// the same applies to the proceed button
			assertFalse(checkoutArea.isProceedButtonActive());

			// new customer testcase (address fields check only)
			// String customerTestEmail = "customer.testemail@" +
			// UUID.randomUUID().toString() + ".com";
			checkoutAddressView.switchToNewCustomer();
			assertTrue(checkoutAddressView.isAddressFormAvailable());
			assertTrue(checkoutAddressView.isCountryAvailable());

			// existing customer testcase (with email id as
			// 'maria.brown@delbont.com')
			checkoutAddressView.switchToExistingCustomer();

			checkoutAddressView.enterEmail("maria.brown@delbont.com");

			// now the next roadmap step should be enabled
			assertTrue(checkoutArea.isRoadMapStepActive(3));
			// the same applies to the proceed button
			assertTrue(checkoutArea.isProceedButtonActive());

			// but the last roadmap step (summary page) should be inactive as
			// long as the payment data is not yet maintained
			assertFalse(checkoutArea.isRoadMapStepActive(4));
			checkoutArea.clickRoadMapItem(3);
			CheckoutPaymentView checkoutPaymentView = checkoutArea
					.getPaymentView();

			// enter the credit card details/inputs
			checkoutPaymentView.completeMandatoryInput();

			// now the next roadmap step should be enabled
			assertTrue(checkoutArea.isRoadMapStepActive(4));
			// the same applies to the proceed button
			assertTrue(checkoutArea.isProceedButtonActive());

			// choose 'Proceed'
			checkoutArea.navigateForward();
			CheckoutSummaryView checkoutSummaryView = checkoutArea
					.getSummaryView();

			// choose 'Order'
			checkoutSummaryView.pressButtonOrder();

			CheckoutConfirmationView checkoutConfirmationView = checkoutArea
					.getConfirmationView();
			// the o.k. image is an indicator for successfull order creation
			assertTrue(checkoutConfirmationView.isConfirmationImagePresent());

			// navigate to Shopping view
			startPage.navigateToShopping();
		}

	}

	@Test
	public void testNewCustomerOrdersProducts() {

		// handles the disclaimer pop up
		startPage.checkBox();
		startPage.selectOk();

		// In Firefox we fist have to navigate to the settings
		SettingsView settingsview = startPage.navigateToSettings();
		assertTrue(settingsview.isSettingView());

		// loop for three cases HANA Cloud (local + remote) and ABAP Backend
		// System
		for (int i = 0; i < 3; i++) {

			if (i == 0) {
				// (default) HANA Cloud local setting
				if (!settingsview.isHanaCloudLocalSelected()) {
					settingsview.switchToHanaCloudLocal();
				}
				settingsview.pressOk();
				clickAlertOk();
				// startPage.doRefresh();
			} else if (i == 1) {
				// HANA Cloud remote setting
				SettingsView cloudsettingsview = startPage.navigateToSettings();
				cloudsettingsview.switchToHanaCloudRemote();
				cloudsettingsview.pressOk();
				clickAlertOk();
				// startPage.doRefresh();
			} else {
				// ABAP Backend System setting
				SettingsView abapsettingsview = startPage.navigateToSettings();
				abapsettingsview.switchToAbapBackend();
				abapsettingsview.pressOk();
				clickAlertOk();
				// startPage.doRefresh();
			}

			try {
				synchronized (webDriver) {
					webDriver.wait(4000);
				}

			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			WebElement myDynamicElement = (new WebDriverWait(webDriver, 20))
					.until(ExpectedConditions.presenceOfElementLocated(By
							.id("search-field-tf-input")));

			// navigate back to shopping
			startPage.navigateToCheckout();
			ShoppingAreaView shoppingArea = startPage.navigateToShopping();

			try {
				synchronized (webDriver) {
					webDriver.wait(6000);
				}

			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			// enter the search text
			ShoppingSearchView searchView = shoppingArea.getSearchView();
			ShoppingProductListView productListView = searchView
					.searchFor(PRODUCT_SEARCH_STRING);

			// select the 'Add to Cart' button of the selected product
			productListView.addToCart(PRODUCT_SEARCH_STRING);

			// navigate to checkout tab
			CheckoutAreaView checkoutArea = startPage.navigateToCheckout();
			checkoutArea.getCheckoutShoppingCart();

			// choose 'Proceed'
			checkoutArea.navigateForward();
			CheckoutAddressView checkoutAddressView = checkoutArea
					.getAddressView();

			// the next roadmap step should not be active if the e-mail address
			// is not yet maintained
			assertFalse(checkoutArea.isRoadMapStepActive(3));
			// the same applies to the proceed button
			assertFalse(checkoutArea.isProceedButtonActive());

			// new customer testcase (address fields check only)
			String newCustomerTestEmail = "customer.testemail@"
					+ UUID.randomUUID().toString() + ".com";
			checkoutAddressView.switchToNewCustomer();
			assertTrue(checkoutAddressView.isAddressFormAvailable());
			assertTrue(checkoutAddressView.isCountryAvailable());

			checkoutAddressView.enterEmail(newCustomerTestEmail);

			try {
				synchronized (webDriver) {
					webDriver.wait(6000);
				}

			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			checkoutAddressView.enterFirstName("Lisa");
			checkoutAddressView.enterLastName("Gordan");
			checkoutAddressView.enterDateAsString("Apr 1, 2006");
			checkoutAddressView.enterStreet("Longstreet");
			checkoutAddressView.enterCity("New York");
			checkoutAddressView.enterZipcode("1234567890");

			// now the next roadmap step should be enabled
			assertTrue(checkoutArea.isRoadMapStepActive(3));
			// the same applies to the proceed button
			assertTrue(checkoutArea.isProceedButtonActive());

			// proceed to enter payment data
			checkoutArea.clickRoadMapItem(3);
			CheckoutPaymentView checkoutPaymentView = checkoutArea
					.getPaymentView();

			// enter some credit card data
			checkoutPaymentView.completeMandatoryInput();

			// now the next roadmap step should be enabled
			assertTrue(checkoutArea.isRoadMapStepActive(4));
			// the same applies to the proceed button
			assertTrue(checkoutArea.isProceedButtonActive());

			// choose 'Proceed'
			checkoutArea.navigateForward();
			CheckoutSummaryView checkoutSummaryView = checkoutArea
					.getSummaryView();

			// choose 'Order'
			checkoutSummaryView.pressButtonOrder();

			CheckoutConfirmationView checkoutConfirmationView = checkoutArea
					.getConfirmationView();
			// the o.k. image is an indicator for successful order creation
			assertTrue(checkoutConfirmationView.isConfirmationImagePresent());

			// navigate to Shopping view
			startPage.navigateToShopping();
		}
	}

	public void clickAlertOk() {
		WebElement element =
		// driver.findElement(By.id("__inspector1-actionBar-items-sales-order-acceptButton"));
		webDriver.findElement(By.xpath("//button[@id='__alert0--btn-OK']"));

		if (element != null) {
			JavascriptLibrary jsLib = new JavascriptLibrary();
			jsLib.callEmbeddedSelenium(webDriver, "triggerMouseEventAt",
					element, "click", "0,0");
		}
	}

}

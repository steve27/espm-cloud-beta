package com.sap.espm.reviews.web;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.UUID;

import org.junit.Test;

import com.sap.espm.reviews.web.pageobjects.CustomerReviewCreationPage;
import com.sap.espm.reviews.web.pageobjects.CustomerReviewsPage;
import com.sap.espm.reviews.web.pageobjects.SettingsPage;
import com.sap.espm.reviews.web.pageobjects.WebShopMainPage;

public class EspmReviewsIT extends UiTestBase {

	@Test
	public void testCreateReviewWithAbapBackend() throws InterruptedException {
		driver.get(serverUrl + applicationPath);

		WebShopMainPage webShopMainPage = WebShopMainPage.create(driver);

		// disclaimer pop up
		webShopMainPage.disclaimerOk();

		// navigate to settings
		SettingsPage settingsPage = webShopMainPage.navigateToSettings();
		assertTrue(settingsPage.isSettingView());
		settingsPage.switchToAbapBackend();
		settingsPage.selectDisplayReviewsTab();
		settingsPage.pressOk();
		webShopMainPage.confirmRefresh();

		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		webShopMainPage.waitForPageAfterRefresh();
		webShopMainPage.waitForDisclaimer();

		webShopMainPage.disclaimerOk();

		// navigate to Reviews tab
		CustomerReviewsPage reviewsPage = webShopMainPage.navigateToReviews();
		Thread.sleep(4000);
		reviewsPage.waitUntilCategoriesFieldIsRendered();
		assertEquals("Default category does not match", "All Categories",
				reviewsPage.getCategory());
		assertEquals("Default product does not match",
				"10\" Portable DVD player", reviewsPage.getProduct());
		assertFalse("First reviewer name is empty", reviewsPage
				.getFirstReviewer().isEmpty());
		assertFalse("First review comment is empty", reviewsPage
				.getFirstReviewComment().isEmpty());

		reviewsPage.selectCategory("Speakers");
		reviewsPage.selectProduct("Sound Booster");

		CustomerReviewCreationPage reviewCreationPage = reviewsPage
				.writeCustomerReview();

		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		String reviewId = UUID.randomUUID().toString();
		reviewCreationPage.writeReviewComments("Good performance (" + reviewId
				+ ")");

		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		reviewCreationPage.setReviewRating(3);
		reviewCreationPage.setFirstName("James");
		reviewCreationPage.setLastName("Field");

		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		reviewsPage = reviewCreationPage.submitAndConfirmReview();

		assertEquals(3, reviewsPage.getFirstReviewRating());
		assertTrue(reviewsPage.getFirstReviewComment().contains(reviewId));
		assertEquals("James Field", reviewsPage.getFirstReviewer());

		// navigate to settings and init display Reviews
		settingsPage = webShopMainPage.navigateToSettings();
		settingsPage.selectDisplayReviewsTab();
		settingsPage.pressOk();
	}

	// TODO: Enable as soon as ESPM OData service bug for reviews case is fixed
	// @Test
	public void testCreateReviewWithRemoteCloudBackend() {
		driver.get(serverUrl + applicationPath);

		WebShopMainPage webShopMainPage = WebShopMainPage.create(driver);

		// disclaimer pop up
		webShopMainPage.disclaimerOk();

		// navigate to settings
		SettingsPage settingsPage = webShopMainPage.navigateToSettings();
		assertTrue(settingsPage.isSettingView());
		settingsPage.switchToHanaCloudRemote();
		settingsPage.selectDisplayReviewsTab();
		settingsPage.pressOk();
		webShopMainPage.confirmRefresh();

		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		webShopMainPage.waitForPageAfterRefresh();
		webShopMainPage.disclaimerOk();

		// navigate to Reviews tab
		CustomerReviewsPage reviewsPage = webShopMainPage.navigateToReviews();
		assertEquals("Default category does not match", "All Categories",
				reviewsPage.getCategory());
		assertEquals("Default product does not match",
				"10\" Portable DVD player", reviewsPage.getProduct());
		assertFalse("First reviewer name is empty", reviewsPage
				.getFirstReviewer().isEmpty());
		assertFalse("First review comment is empty", reviewsPage
				.getFirstReviewComment().isEmpty());

		reviewsPage.selectCategory("Speakers");
		reviewsPage.selectProduct("Sound Booster");

		CustomerReviewCreationPage reviewCreationPage = reviewsPage
				.writeCustomerReview();

		String reviewId = UUID.randomUUID().toString();
		reviewCreationPage.writeReviewComments("Good performance (" + reviewId
				+ ")");
		reviewCreationPage.setReviewRating(3);
		reviewCreationPage.setFirstName("James");
		reviewCreationPage.setLastName("Field");

		reviewsPage = reviewCreationPage.submitAndConfirmReview();

		assertEquals(3, reviewsPage.getFirstReviewRating());
		assertTrue(reviewsPage.getFirstReviewComment().contains(reviewId));
		assertEquals("James Field", reviewsPage.getFirstReviewer());

		// navigate to settings and init display Reviews
		settingsPage = webShopMainPage.navigateToSettings();
		settingsPage.selectDisplayReviewsTab();
		settingsPage.pressOk();
	}

	// TODO: Enable as soon as ESPM OData service bug for reviews case is fixed
	// @Test
	public void testCreateReviewWithLocalCloudBackend() {
		driver.get(serverUrl + applicationPath);

		WebShopMainPage webShopMainPage = WebShopMainPage.create(driver);

		// disclaimer pop up
		webShopMainPage.disclaimerOk();

		// navigate to settings
		SettingsPage settingsPage = webShopMainPage.navigateToSettings();
		assertTrue(settingsPage.isSettingView());
		settingsPage.switchToHanaCloudLocal();
		settingsPage.selectDisplayReviewsTab();
		settingsPage.pressOk();
		webShopMainPage.confirmRefresh();

		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		webShopMainPage.waitForPageAfterRefresh();
		webShopMainPage.disclaimerOk();

		// navigate to Reviews tab
		CustomerReviewsPage reviewsPage = webShopMainPage.navigateToReviews();
		assertEquals("Default category does not match", "All Categories",
				reviewsPage.getCategory());
		assertEquals("Default product does not match",
				"10\" Portable DVD player", reviewsPage.getProduct());
		assertFalse("First reviewer name is empty", reviewsPage
				.getFirstReviewer().isEmpty());
		assertFalse("First review comment is empty", reviewsPage
				.getFirstReviewComment().isEmpty());

		reviewsPage.selectCategory("Speakers");
		reviewsPage.selectProduct("Sound Booster");

		CustomerReviewCreationPage reviewCreationPage = reviewsPage
				.writeCustomerReview();

		String reviewId = UUID.randomUUID().toString();
		reviewCreationPage.writeReviewComments("Good performance (" + reviewId
				+ ")");
		reviewCreationPage.setReviewRating(3);
		reviewCreationPage.setFirstName("James");
		reviewCreationPage.setLastName("Field");

		reviewsPage = reviewCreationPage.submitAndConfirmReview();

		assertEquals(3, reviewsPage.getFirstReviewRating());
		assertTrue(reviewsPage.getFirstReviewComment().contains(reviewId));
		assertEquals("James Field", reviewsPage.getFirstReviewer());

		// navigate to settings and init display Reviews
		settingsPage = webShopMainPage.navigateToSettings();
		settingsPage.selectDisplayReviewsTab();
		settingsPage.pressOk();
	}

}

package com.sap.espm.ui.reviews.web;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.UUID;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.sap.espm.ui.reviews.web.pageobjects.CustomerReviewCreationPage;
import com.sap.espm.ui.reviews.web.pageobjects.CustomerReviewsPage;
import com.sap.espm.ui.reviews.web.pageobjects.SettingsPage;

public class CustomerReviewsIT extends UiTestBase {

	@Test
	public void testCreateReviewWithAbapBackend() {
		driver.get(serverUrl + applicationPath);
		CustomerReviewsPage reviewsPage = CustomerReviewsPage.create(driver);

		// ABAP backend system (default as defined in config.js)
		SettingsPage abapsettingsview = reviewsPage.navigateToSettings();
		abapsettingsview.switchToAbapBackend();
		abapsettingsview.pressOk();
		abapsettingsview.confirmRefresh();

		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		reviewsPage.waitForPageAfterRefresh();

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

		WebElement myDynamicElement = (new WebDriverWait(driver, 20))
				.until(ExpectedConditions.presenceOfElementLocated(By
						.id("review-comment-text-area-id")));

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
	}

	// TODO: Enable as soon as ESPM OData service bug for reviews case is fixed
	// @Test
	public void testCreateReviewWithCloudBackend() {
		driver.get(serverUrl + applicationPath);
		CustomerReviewsPage reviewsPage = CustomerReviewsPage.create(driver);

		// HANA Cloud remote
		SettingsPage cloudsettingsview = reviewsPage.navigateToSettings();
		cloudsettingsview.switchToHanaCloudRemote();
		cloudsettingsview.pressOk();
		cloudsettingsview.confirmRefresh();

		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		reviewsPage.waitForPageAfterRefresh();

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

		WebElement myDynamicElement = (new WebDriverWait(driver, 20))
				.until(ExpectedConditions.presenceOfElementLocated(By
						.id("review-comment-text-area-id")));

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
	}
}

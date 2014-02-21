package com.sap.espm.reviews.web.pageobjects;

import static org.junit.Assert.assertEquals;

import java.util.List;
import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

/**
 * Page object for customer reviews view
 */
public class CustomerReviewsPage extends PageObject {

	@FindBy(id = "categories-selection-dropdown-box-id-input")
	private WebElement categories;

	@FindBy(id = "categories-selection-dropdown-box-id-icon")
	private WebElement categoriesBtn;

	@FindBy(id = "product-selection-dropdown-box-id-input")
	private WebElement products;

	@FindBy(id = "product-selection-dropdown-box-id-icon")
	private WebElement productsBtn;

	@FindBy(id = "selected-product-image-id")
	private WebElement productImage;

	@FindBy(id = "selected-product-name-view-id")
	private WebElement productName;

	@FindBy(id = "selected-product-desc-view-id")
	private WebElement productDetails;

	@FindBy(id = "customer-reviews-header-layout-id")
	private List<WebElement> reviewsHeaderLayout;

	@FindBy(id = "customer-reviews-footer-layout-id")
	private List<WebElement> reviewsFooterLayout;

	@FindBy(id = "product-selection-create-customer-review-button-id")
	private WebElement writeReview;

	@FindBy(id = "customer-reviews-row-repeater-id-fp--forwardLink")
	private WebElement forwardButton;

	@FindBy(id = "__indicator0-customer-reviews-row-repeater-id-0")
	private List<WebElement> displayedRating;

	@FindBy(id = "__area0-customer-reviews-row-repeater-id-0")
	private WebElement displayedReviewComment;

	@FindBy(id = "reviewer-first-name-customer-reviews-row-repeater-id-0")
	private WebElement displayedFirstName;

	@FindBy(id = "reviewer-last-name-customer-reviews-row-repeater-id-0")
	private WebElement displayedLastName;

	public CustomerReviewsPage(WebDriver driver) {
		super(driver);
	}

	public static CustomerReviewsPage create(final WebDriver driver) {
		return PageObject.create(driver, CustomerReviewsPage.class);
	}

	@Override
	protected boolean isCurrentPage() {
		return isProductListLoaded() && isReviewListLoaded();
	}

	private boolean isProductListLoaded() {
		return checkElementIsDisplayed(products)
				&& check(!getProduct().isEmpty(), "Products not loaded");
	}

	private boolean isReviewListLoaded() {
		return check(hasAverageReviewsRatingIndicator()
				|| hasEmptyReviewsIndicator(), "Reviews not loaded");
	}

	private boolean hasAverageReviewsRatingIndicator() {
		return !reviewsHeaderLayout.isEmpty()
				&& reviewsHeaderLayout.get(0).isDisplayed();
	}

	private boolean hasEmptyReviewsIndicator() {
		return !reviewsFooterLayout.isEmpty()
				&& reviewsFooterLayout.get(0).isDisplayed();
	}

	private boolean isProductDetailsLoaded() {
		return checkElementIsDisplayed(productDetails)
				&& check(!productDetails.getText().isEmpty(),
						"Product details not loaded");
	}

	private Function<WebDriver, Boolean> productListIsLoaded() {
		return new Function<WebDriver, Boolean>() {
			@Override
			public Boolean apply(final WebDriver driver) {
				return isProductListLoaded();
			}
		};
	}

	private Function<WebDriver, Boolean> productDetailsAreLoaded() {
		return new Function<WebDriver, Boolean>() {
			@Override
			public Boolean apply(final WebDriver driver) {
				return isProductDetailsLoaded();
			}
		};
	}

	public String getCategory() {
		return categories.getAttribute("value");
	}

	public void selectCategory(String text) {
		categories.clear();
		categories.sendKeys(text);
		categories.sendKeys(Keys.RETURN);
		assertEquals(text, getCategory());
		waitUntil(productListIsLoaded());
	}

	public String getProduct() {
		return products.getAttribute("value");
	}

	public void selectProduct(String text) {
		products.clear();
		products.sendKeys(text);
		products.sendKeys(Keys.RETURN);
		assertEquals(text, getProduct());
		waitUntil(productDetailsAreLoaded());
	}

	public int getFirstReviewRating() {
		waitUntil(firstRowRatingIsShown());
		return Integer.parseInt(displayedRating.get(0).getAttribute("title"));
	}

	public String getFirstReviewComment() {
		return displayedReviewComment.getText();
	}

	public String getFirstReviewer() {
		return displayedFirstName.getText() + " " + displayedLastName.getText();
	}

	public CustomerReviewCreationPage writeCustomerReview() {
		writeReview.click();
		return CustomerReviewCreationPage.create(driver);
	}

	private Function<WebDriver, Boolean> firstRowRatingIsShown() {
		return new Function<WebDriver, Boolean>() {
			@Override
			public Boolean apply(final WebDriver driver) {
				return !displayedRating.isEmpty();
			}
		};
	}

	public void waitUntilCategoriesFieldIsRendered()
			throws InterruptedException {
		iWait().until(categoriesFieldIsRendered());
	}

	private Function<WebDriver, Boolean> categoriesFieldIsRendered() {
		return new Function<WebDriver, Boolean>() {
			@Override
			public Boolean apply(WebDriver driver) {
				try {
					WebElement cat = driver.findElement(By
							.id("categories-selection-dropdown-box-id-input"));
					if (cat.getAttribute("value").equals("All Categories")) {

						return true;
					} else {
						return false;
					}

				} catch (NoSuchElementException e) {
					return false;
				}
			}
		};
	}

	private WebDriverWait iWait() {
		return new WebDriverWait(driver, 6);
	}
}

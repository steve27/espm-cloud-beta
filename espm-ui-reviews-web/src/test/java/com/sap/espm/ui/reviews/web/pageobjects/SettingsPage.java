package com.sap.espm.ui.reviews.web.pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class SettingsPage extends PageObject {

	@FindBy(id = "settings-dialog-id")
	private WebElement settingdialog;

	@FindBy(id = "settings-cancel-button-id")
	private WebElement settingcancel;

	@FindBy(id = "settings-ok-button-id")
	private WebElement settingok;

	@FindBy(id = "settings-cloud-backend-rb1-id")
	private WebElement hanacloudremote;

	@FindBy(id = "settings-abap-backend-rb2-id")
	private WebElement abapbackendsystem;

	@FindBy(id = "__alert0--btn-OK")
	private WebElement confirmrefresh;

	public SettingsPage(WebDriver driver) {
		super(driver);
	}

	public static SettingsPage create(final WebDriver driver) {
		return PageObject.create(driver, SettingsPage.class);
	}

	@Override
	protected boolean isCurrentPage() {
		return isSettingView();
	}

	public boolean isSettingView() {
		return settingdialog.getAttribute("style").contains("visible");
	}

	public void switchToHanaCloudRemote() {
		hanacloudremote.click();
	}

	public boolean isHanaCloudRemoteSelected() {
		return !hanacloudremote.getAttribute("checked").isEmpty();
	}

	public void switchToAbapBackend() {
		abapbackendsystem.click();
	}

	public boolean isAbapBackendSelected() {
		return !abapbackendsystem.getAttribute("checked").isEmpty();
	}

	public void pressOk() {
		settingok.click();
	}

	public void pressCancel() {
		settingcancel.click();
	}

	public void confirmRefresh() {
		confirmrefresh.click();
	}
}

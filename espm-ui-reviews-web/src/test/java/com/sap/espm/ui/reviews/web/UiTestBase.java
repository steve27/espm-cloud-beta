package com.sap.espm.ui.reviews.web;

import java.io.File;
import java.io.IOException;
import java.util.Locale;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.rules.TestName;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

public class UiTestBase {
	enum Browser {
		FIREFOX {
			@Override
			protected RemoteWebDriver setupDriver() {
				final DesiredCapabilities capabilities = new DesiredCapabilities();
				setupProxy(capabilities);
				return new FirefoxDriver(capabilities);
			}

			private void setupProxy(final DesiredCapabilities capabilities) {
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
			}

			@Override
			void teardown() throws IOException {
			}
		},
		CHROME {
			ChromeDriverService service;

			@Override
			RemoteWebDriver setupDriver() throws IOException {
				service = ChromeDriverService.createDefaultService();
				service.start();
				return new RemoteWebDriver(service.getUrl(),
						getChromeCapabilities());
			}

			private DesiredCapabilities getChromeCapabilities() {
				ChromeOptions options = new ChromeOptions();
				options.addArguments("allow-file-access-from-files");
				DesiredCapabilities capabilities = DesiredCapabilities.chrome();
				capabilities.setCapability(ChromeOptions.CAPABILITY, options);
				return capabilities;
			}

			@Override
			void teardown() throws IOException {
				service.stop();
			}
		};

		abstract RemoteWebDriver setupDriver() throws IOException;

		abstract void teardown() throws IOException;
	};

	@Rule
	public TestName testName = new TestName();

	public static String serverUrl = System.getProperty(
			"integration.test.server.url", "http://localhost:8080");

	public static String applicationPath = System.getProperty(
			"integration.test.application.path",
			"/espm-ui-reviews-web/index.html?sap-ui-language=en");

	public static File screenshotFolder = new File(System.getProperty(
			"integration.test.screenshot.path", "target/screenshots"))
			.getAbsoluteFile();

	public static WebDriver driver;

	private static Browser browser;

	@BeforeClass
	public static void setupClass() throws Exception {
		setupScreenshotFolder();
		browser = Browser.valueOf(System.getProperty("uitest.browser",
				"firefox").toUpperCase(Locale.US));
		driver = browser.setupDriver();
	}

	private static void setupScreenshotFolder() {
		if (!screenshotFolder.exists()) {
			screenshotFolder.mkdirs();
		}
		System.out.println("Screenshots are saved in " + screenshotFolder);
	}

	@AfterClass
	public static void teardownClass() throws IOException {
		driver.quit();
		browser.teardown();
	}

	@After
	public void tearDown() throws Exception {
		takeScreenshot();
	}

	private void takeScreenshot() throws IOException {
		final File tempFile = ((TakesScreenshot) driver)
				.getScreenshotAs(OutputType.FILE);
		final String targetName = getClass().getSimpleName() + "."
				+ testName.getMethodName() + ".png";
		final File targetFile = new File(screenshotFolder, targetName);
		FileUtils.copyFile(tempFile, targetFile);
		System.out.println("Screenshot for test " + testName.getMethodName()
				+ " saved in " + targetFile.getAbsolutePath());
	}

}

sap.ui.controller("espm-mobile-shopping.Category", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
	 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function() {

	},

	onBeforeShow : function(evt) {
		var con = this;
		var abap = window.localStorage.getItem("ABAP");
		if (abap === null) {
			abap = false;
		} else {
			abap = (abap === 'true');
		}

		if (abap) {
			// if ABAP Gateway radio button is selected in the settings dialog
			con.loadDataAbap();
		} else {
			// if HANA Cloud radio button is selected in the settings dialog
			con.loadDataCloud();
		}
	},

	// loading the data from HANA Cloud backend
	loadDataCloud : function() {
		sap.app.config.useAbap = false;
		var newUrl = "";
		var sServiceUrl = "";
		appC.appCID = "ESPM" + new Date().getTime();
		newUrl = sap.app.config.smpUrl + sap.app.config.connUrl + sap.app.config.cloudAppName;
		jQuery.sap.require("sap.ui.model.odata.ODataModel");
		mHeaders = {
			"X-SUP-APPCID" : appC.appCID
		};
		this.loginModel = new sap.ui.model.odata.ODataModel(newUrl, false, null, null, mHeaders);
		var oEntry = {};
		oEntry.DeviceType = sap.app.config.deviceType;
		this.loginModel.create(sap.app.config.connection, oEntry, null, null);
		if (sap.app.config.useWeb == true) {
			sServiceUrl = "proxy/cloudmobilebackend";
		} else {
			sServiceUrl = sap.app.config.smpUrl + sap.app.config.reqRepUrl + sap.app.config.cloudAppName;
		}

		$(function() {
			jQuery.sap.require("sap.ui.model.odata.ODataModel");
			mHeaders = {
				"X-SUP-APPCID" : appC.appCID
			};
			appC.oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true, null, null, mHeaders);
			appC.oModel.setSizeLimit(100);
			appC.oModel.attachRequestFailed(function(evt) {
				alert("Server error: " + evt.getParameter("message") + " - " + evt.getParameter("statusText"));
			});
			jQuery.sap.log.debug(appC.oModel);
			sap.ui.getCore().setModel(appC.oModel);
		});
	},

	// loading the data from ABAP Gateway backend
	loadDataAbap : function() {
		sap.app.config.useAbap = true;
		var newUrl = "";
		var sServiceUrl = "";
		appC.appCID = "ESPM" + new Date().getTime();
		newUrl = sap.app.config.smpUrl + sap.app.config.connUrl + sap.app.config.abapAppName;
		jQuery.sap.require("sap.ui.model.odata.ODataModel");
		mHeaders = {
			"X-SUP-APPCID" : appC.appCID
		};
		this.loginModel = new sap.ui.model.odata.ODataModel(newUrl, false, null, null, mHeaders);

		var oEntry = {};
		oEntry.DeviceType = sap.app.config.deviceType;
		this.loginModel.create(sap.app.config.connection, oEntry, null, null);
		if (sap.app.config.useWeb == true) {
			sServiceUrl = "proxy/abapmobilebackend";
		} else {
			sServiceUrl = sap.app.config.smpUrl + sap.app.config.reqRepUrl + sap.app.config.abapAppName;
		}
		$(function() {
			jQuery.sap.require("sap.ui.model.odata.ODataModel");
			mHeaders = {
				"X-SUP-APPCID" : appC.appCID
			};
			appC.oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true, null, null, mHeaders);

			appC.oModel.refreshSecurityToken();
			appC.oModel.setSizeLimit(100);
			appC.oModel.attachRequestFailed(function(evt) {
				alert("Server error: " + evt.getParameter("message") + " - " + evt.getParameter("statusText"));
			});
			jQuery.sap.log.debug(appC.oModel);
			sap.ui.getCore().setModel(appC.oModel);
		});
	},

	// navigation from Category to Products
	productListTap : function(evt) {
		var param = {
			categoryId : evt.oSource.data("id"),
			categoryName : evt.oSource.getTitle()
		};
		appC.navTo("Product", true, undefined, param);
	},

	// clicking on the cart icon
	cartButtonTap : function(evt) {
		appC.navTo("Order", true, undefined, "");
	},

	// clicking on the settings button
	settingsTap : function(evt) {
		var con = this;
		var abap = window.localStorage.getItem("ABAP");
		if (abap === null) {
			abap = false;
		} else {
			abap = (abap === 'true');
		}
		var infoDialog = new sap.m.Dialog({
			title : "{i18n>SETTINGS_TEXT}",
			type : sap.m.DialogType.Message,
			content : [ new sap.m.VBox({
				items : [ appC.radioButton6 = new sap.m.RadioButton({
					text : "{i18n>CLOUD_LABEL}",
					groupName : "GroupA",
					selected : !abap,
				}), appC.radioButton7 = new sap.m.RadioButton({
					text : "{i18n>ABAP_LABEL}",
					groupName : "GroupA",
					selected : abap
				}) ]
			}) ],
			rightButton : new sap.m.Button({
				text : "OK",
				tap : function() {
					infoDialog.close();
					if (appC.radioButton7.getSelected() == true) {
						// reset cart
						appC.cartItems = new Array();
						window.localStorage.setItem("ABAP", true);
						con.loadDataAbap();
					} else if (appC.radioButton6.getSelected() == true) {
						// reset cart
						appC.cartItems = new Array();
						window.localStorage.setItem("ABAP", false);
						con.loadDataCloud();
					}
				}
			}),
			leftButton : new sap.m.Button({
				text : "Close",
				tap : function() {
					infoDialog.close();
				}
			}),
			afterClose : function(evt) {
				infoDialog.close();

			}
		});
		appC.openDialog(infoDialog);
	},

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered (NOT before the
 * first rendering! onInit() is used for that one!).
 */
// onBeforeRendering: function() {
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the
 * HTML could be done here. This hook is the same one that SAPUI5 controls get after being rendered.
 */
// onAfterRendering: function() {
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 */
// onExit: function() {
// }
});
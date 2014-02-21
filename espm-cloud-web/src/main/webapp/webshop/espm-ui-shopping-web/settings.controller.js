sap.ui.controller("espm-ui-shopping-web.settings", {

	oDialog : null,

	openDialog : function() {
		if (!this.oDialog) {
			this.oDialog = new sap.ui.commons.Dialog({
				id : "settings-dialog-id",
				showCloseButton : true,
				resizable : true,
				title : "{i18n>SETTINGS_DIALOG_TITLE}",
				buttons : [ new sap.ui.commons.Button({
					id : "settings-dialog-ok-button-id",
					text : "{i18n>SETTINGS_OK_BUTTON}",
					press : [ function() {
						this.save();
						this.oDialog.close();
						this.reloadPage();
					}, this ]
				}), new sap.ui.commons.Button({
					id : "settings-dialog-cancel-button-id",
					text : "{i18n>SETTINGS_CANCEL_BUTTON}",
					press : [ function() {
						this.oDialog.close();
					}, this ]
				}) ],
				content : [ this.getView() ],
			});
		}
		this.load();
		this.oDialog.open();
	},

	load : function() {
		// used backend type
		var prefBackendType = this.getPreferenceUsedBackendType();
		if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP) {
			var oAbapRadioButton = sap.ui.getCore().byId("settings-abap-backend-rb2-id");
			oAbapRadioButton.setSelected(true);
		} else {
			if (prefBackendType === sap.app.localStorage.PREF_USED_BACKEND_TYPE_CLOUD_REMOTE) {
				var oRemoteCloudRadioButton = sap.ui.getCore().byId("settings-cloud-remote-backend-rb2-id");
				oRemoteCloudRadioButton.setSelected(true);
			} else {
				var oLocalCloudRadioButton = sap.ui.getCore().byId("settings-cloud-local-backend-rb1-id");
				oLocalCloudRadioButton.setSelected(true);
			}
		}

		// display data source info
		var oDisplayDataSourceInfoChkBox = sap.ui.getCore().byId("cloud-odata-display-data-source-info-chkbox-id");
		oDisplayDataSourceInfoChkBox.setChecked(sap.app.localStorage
				.getPreference(sap.app.localStorage.PREF_DISPLAY_DATA_SOURCE_INFO));

		// display customer reviews
		var oDisplayCustomerReviewsChkBox = sap.ui.getCore().byId("display-customer-reviews-chkbox-id");
		oDisplayCustomerReviewsChkBox.setChecked(sap.app.localStorage
				.getPreference(sap.app.localStorage.PREF_DISPLAY_CUSTOMER_REVIEWS));
	},

	save : function() {
		// used backend type
		var oLocalCloudRadioButton1 = sap.ui.getCore().byId("settings-cloud-local-backend-rb1-id");

		if (oLocalCloudRadioButton1.getSelected()) {
			sap.app.localStorage.storePreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE,
					sap.app.localStorage.PREF_USED_BACKEND_TYPE_CLOUD_LOCAL);
		} else {
			var oRemoteCloudRadioButton2 = sap.ui.getCore().byId("settings-cloud-remote-backend-rb2-id");
			if (oRemoteCloudRadioButton2.getSelected()) {
				sap.app.localStorage.storePreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE,
						sap.app.localStorage.PREF_USED_BACKEND_TYPE_CLOUD_REMOTE);
			} else {
				sap.app.localStorage.storePreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE,
						sap.app.localStorage.PREF_USED_BACKEND_TYPE_ABAP);
			}
		}

		// display data source info
		var oDisplayDataSourceInfoChkBox = sap.ui.getCore().byId("cloud-odata-display-data-source-info-chkbox-id");
		sap.app.localStorage.storePreference(sap.app.localStorage.PREF_DISPLAY_DATA_SOURCE_INFO,
				oDisplayDataSourceInfoChkBox.getChecked());

		// display customer reviews
		var oDisplayCustomerReviewsChkBox = sap.ui.getCore().byId("display-customer-reviews-chkbox-id");
		sap.app.localStorage.storePreference(sap.app.localStorage.PREF_DISPLAY_CUSTOMER_REVIEWS,
				oDisplayCustomerReviewsChkBox.getChecked());
	},

	reloadPage : function() {
		sap.ui.commons.MessageBox.alert(sap.app.i18n.getProperty("SETTINGS_STORED_SUCCESS_MSG"), function() {
			window.location.reload();
		});
	},

	getPreferenceUsedBackendType : function() {
		return (sap.app.localStorage.getPreference(sap.app.localStorage.PREF_USED_BACKEND_TYPE));
	}

});
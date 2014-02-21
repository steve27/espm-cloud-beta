sap.ui.controller("espm-ui-shopping-web.main", {

	onInit : function() {
	},

	openSettingsDialog : function() {
		var oSettingsView = sap.app.viewCache.get("settings");
		oSettingsView.getController().openDialog();
	},

	openWelcomeDialog : function() {
		var showWelcomeDialog = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_DISPLAY_WELCOME_DIALOG);
		if (showWelcomeDialog) {
			var welcomeDialog = new sap.account.WelcomeDialog(this);
			welcomeDialog.open();
		}
	},

});

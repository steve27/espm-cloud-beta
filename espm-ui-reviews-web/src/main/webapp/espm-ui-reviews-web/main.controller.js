sap.ui.controller("espm-ui-reviews-web.main", {

	openSettingsDialog : function() {
		var oSettingsView = sap.app.viewCache.get("settings");
		oSettingsView.getController().openDialog();
	}
});

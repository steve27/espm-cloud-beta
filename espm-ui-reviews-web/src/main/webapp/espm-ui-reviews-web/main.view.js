sap.ui.jsview("espm-ui-reviews-web.main", {

	getControllerName : function() {
		return "espm-ui-reviews-web.main";
	},

	createContent : function(oController) {

		var oView = sap.app.viewCache.get("reviews");

		if (sap.app.config.displayShell) {
			var oShell = new sap.ui.ux3.Shell({
				id : oController.createId("shell-id"),
				appTitle : "{i18n>SHELL_HEADER_TITLE}",
				showLogoutButton : true,
				showSearchTool : false,
				showFeederTool : false,
				showTools : true,
				showPane : true,
				paneWidth : 500,
				worksetItems : [ new sap.ui.ux3.NavigationItem({
					id : "nav-customer-reviews-id",
					text : "{i18n>SHELL_WORKSET_ITEM_CUSTOMER_REVIEWS}"
				}) ]
			});

			var oSettingsButton = new sap.ui.commons.Button({
				id : oController.createId("settings-button-id"),
				text : "{i18n>SHELL_HEADER_ITEM_SETTINGS_TEXT}",
				tooltip : "{i18n>SHELL_HEADER_ITEM_SETTINGS_TOOLTIP}",
				press : function(oEvent) {
					oController.openSettingsDialog();
				}
			});
			oShell.addHeaderItem(oSettingsButton);
			oShell.addContent(oView);
			return oShell;
		} else {
			// only display view (w/o shell)
			return oView;
		}
	},
});

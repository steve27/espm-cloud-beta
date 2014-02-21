sap.ui.jsview("espm-ui-retailer-web.main", {

	getControllerName : function() {
		return "espm-ui-retailer-web.main";
	},

	/**
	 * createContent: instantiate the shell which is the main container embedding all other content
	 * 
	 * @param oController
	 * @returns {sap.ui.ux3.Shell}
	 */
	createContent : function(oController) {
		sap.app.mainController = oController;

		var oShell = new sap.ui.ux3.Shell({
			id : "main",
			appTitle : "{i18n>SHELL_HEADER_TITLE}",
			showLogoutButton : true,
			showSearchTool : false,
			showInspectorTool : false,
			showFeederTool : false,
			showTools : true,
			showPane : true,
			paneWidth : 500,
			notificationBar : new sap.ui.ux3.NotificationBar({
				messageNotifier : sap.ui.ux3.Notifier({
					messageSelected : sap.app.messages.handleMessageSelected
				})
			}),
			worksetItems : [ new sap.ui.ux3.NavigationItem({
				id : "nav-sales-orders",
				text : "{i18n>SHELL_WORKSET_SALES_ORDER}"
			}), new sap.ui.ux3.NavigationItem({
				id : "nav-stock",
				text : "{i18n>SHELL_WORKSET_STOCK}",
			}) ],
		});

		// action when shell workset item are clicked
		oShell.attachWorksetItemSelected(function(oEvent) {
			var sViewName = oEvent.getParameter("id").replace("nav-", "");
			oShell.setContent(oController.getCachedView(sViewName));
		});

		// initial shell content
		oShell.addContent(oController.getCachedView("sales-orders"));

		return oShell;
	}

});

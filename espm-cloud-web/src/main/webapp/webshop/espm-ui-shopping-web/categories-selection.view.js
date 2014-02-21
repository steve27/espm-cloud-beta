sap.ui.jsview("espm-ui-shopping-web.categories-selection", {

	oCategoriesDropdownBox : null,

	getControllerName : function() {
		return "espm-ui-shopping-web.categories-selection";
	},

	createContent : function(oController) {
		this.oCategoriesDropdownBox = new sap.ui.commons.DropdownBox({
			id : "categories-selection-dropdown-box-id",
			width : "100%",
			enabled : false,
			change : function(oEvent) {
				oController.selectedCategoryChanged(oEvent.oSource.getSelectedKey());
			}
		});

		var oCategoriesLabel = new sap.ui.commons.Label({
			text : "{i18n>CATEGORIES_LABEL}"
		});

		return new sap.ui.commons.layout.VerticalLayout({
			content : [ oCategoriesLabel, this.oCategoriesDropdownBox ]
		});
	},

	bindCategoriesInDropDownBox : function() {
		this.oCategoriesDropdownBox.setEnabled(true);
		this.oCategoriesDropdownBox.bindItems("/AvailableCategories", new sap.ui.core.ListItem({
			text : "{}",
			key : "{}"
		}));
	},

	setSelectedCategoryInDropDownBox : function(sKey) {
		this.oCategoriesDropdownBox.setSelectedKey(sKey);
	}

});

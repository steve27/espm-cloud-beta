jQuery.sap.declare("sap.account.WelcomeDialog");

sap.account.WelcomeDialog = function(oFrameController) {
	this.controller = oFrameController;
};

sap.account.WelcomeDialog.prototype.open = function() {

	var showWelcomeDialog = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_DISPLAY_WELCOME_DIALOG);

	var oNotShowAgainChkBox = new sap.ui.commons.CheckBox('dontShowAgainBox', {
		text : "{i18n>DISCLAIMER_DO_NOT_SHOW}",
		checked : showWelcomeDialog === "false"
	});

	var oContent = new sap.ui.commons.layout.VerticalLayout({
		height : "100%",
		width : "100%"
	});

	var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
		layoutFixed : false,
		columns : 1,
		width : '100%',
		height : '100%',
		widths : [ '100%' ]
	});

	// header
	oContentMatrix.addRow(createWelcomeHeaderRow());

	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '30px'
	}));

	// disclaimer
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left
	});
	oTextView = new sap.ui.commons.TextView({
		text : "{i18n>DISCLAIMER_LABEL}",
		design : sap.ui.commons.TextViewDesign.H2,
		width : '100%',
		textAlign : sap.ui.core.TextAlign.Center,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '30px'
	}));

	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		width : '100%'
	});
	oTextView = new sap.ui.commons.TextView({
		text : "{i18n>DISCLAIMER_TEXT}",
		design : sap.ui.commons.TextViewDesign.Standard
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '30px'
	}));

	oContentMatrix.addRow(createDividerRow());

	// do not show again checkbox
	oContentMatrix.addRow(createNotShowAgainChkBoxRow(oNotShowAgainChkBox));

	oContent.addContent(oContentMatrix);

	var destroyDialog = function(oEvent) {
		oEvent.getSource().destroy();
	};

	var oWelcomeDialog = new sap.ui.commons.Dialog("WelcomeDialog", {
		modal : true,
		// a percentage width does result in an ugly vertical slider in Chrome
		width : '600px',
		content : oContent,
		closed : destroyDialog
	});

	var ok = function(oEvent) {
		sap.app.localStorage.storePreference(sap.app.localStorage.PREF_DISPLAY_WELCOME_DIALOG, !oNotShowAgainChkBox
				.getChecked());
		oWelcomeDialog.close();
	};
	var okButton = new sap.ui.commons.Button("welcomePageOkButton", {
		text : "{i18n>SETTINGS_OK_BUTTON}",
		press : ok
	});
	oWelcomeDialog.addStyleClass("welcomeDlg");
	oWelcomeDialog.addButton(okButton).setDefaultButton(okButton).open();

	function createWelcomeHeaderRow() {
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();// {height : '25px'});
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Left
		});
		var textView = new sap.ui.commons.TextView({
			text : "{i18n>DISCLAIMER_TITLE}",
			design : sap.ui.commons.TextViewDesign.H1
		});
		textView.addStyleClass("welcomeHeaderTextAlign");
		var oHorizontalLayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ new sap.ui.commons.Image({
				src : "images/SAPLogo.gif"
			}), textView ]
		});
		oCell.addContent(oHorizontalLayout);
		oRow.addCell(oCell);
		return (oRow);
	}

	function createNotShowAgainChkBoxRow(oNotShowAgainChkBox) {
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Right
		});
		oCell.addContent(oNotShowAgainChkBox);
		oRow.addCell(oCell);
		return (oRow);
	}

	function createDividerRow() {
		// hDevider row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		// horizontal divider
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Left
		});
		var hDevider = new sap.ui.commons.HorizontalDivider();
		oCell.addContent(hDevider);
		oRow.addCell(oCell);
		return (oRow);
	}
};
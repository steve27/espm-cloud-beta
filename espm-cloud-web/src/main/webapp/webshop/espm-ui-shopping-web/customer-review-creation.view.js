sap.ui.jsview("espm-ui-shopping-web.customer-review-creation", {

	oProductNameLabel : null,
	oCommentTextArea : null,
	oRatingIndicator : null,
	oFirstNameField : null,
	oLastNameField : null,
	oSubmitButton : null,
	oCustomerReviewCreationDialog : null,

	getControllerName : function() {
		return "espm-ui-shopping-web.customer-review-creation";
	},

	createContent : function(oController) {
		var that = this;
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			width : "100%",
			columns : 2,
			widths : [ '50%', '50%' ]
		});

		this.oCommentTextArea = new sap.ui.commons.TextArea({
			id : "review-comment-text-area-id",
			editable : true,
			wrapping : sap.ui.core.Wrapping.Soft,
			maxLength : 1023, // limit is 1024, but count starts from 0
			value : '',
			width : "500px",
			height : "150px",
			liveChange : function(oEvent) {
				oController.checkSubmitButtonEnabledState(oEvent.getParameter("liveValue"), that.oFirstNameField
						.getValue(), that.oLastNameField.getValue());
			}
		});

		this.oRatingIndicator = new sap.ui.commons.RatingIndicator({
			id : "review-rating-indicator-id",
			editable : true,
			maxValue : 5,
			value : 0,
			visualMode : sap.ui.commons.RatingIndicatorVisualMode.Half,
			change : function() {
				oController.checkSubmitButtonEnabledState(that.oCommentTextArea.getValue(), that.oFirstNameField
						.getValue(), that.oLastNameField.getValue());
			}
		});

		this.oFirstNameField = new sap.ui.commons.TextField({
			id : "review-first-name-field-id",
			value : "",
			liveChange : function(oEvent) {
				oController.checkSubmitButtonEnabledState(that.oCommentTextArea.getValue(), oEvent
						.getParameter("liveValue"), that.oLastNameField.getValue());
			}
		});

		this.oLastNameField = new sap.ui.commons.TextField({
			id : "review-last-name-field-id",
			value : "",
			liveChange : function(oEvent) {
				oController.checkSubmitButtonEnabledState(that.oCommentTextArea.getValue(), that.oFirstNameField
						.getValue(), oEvent.getParameter("liveValue"));
			}
		});

		this.oProductNameLabel = new sap.ui.commons.TextView({
			id : "review-product-name-text-id",
			text : {
				path : "Name",
				mode : sap.ui.model.BindingMode.OneWay,
				formatter : function(sVal) {
					return sap.app.i18n.getProperty("PRODUCT_NAME_LABEL") + ": " + sVal;
				}
			},
			design : sap.ui.commons.TextViewDesign.Bold
		});

		oMatrixLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ this.oProductNameLabel ]
		}));

		// review comment
		oMatrixLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : [ new sap.ui.commons.Label({
				text : "{i18n>COMMENT_LABEL}"
			}) ]
		}));
		oMatrixLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : [ this.oCommentTextArea ]
		}));

		// rating
		oMatrixLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ new sap.ui.commons.Label({
				text : "{i18n>RATING_LABEL}"
			}) ]
		}), new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Right,
			content : [ this.oRatingIndicator ]
		}));

		// firstName
		oMatrixLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ new sap.ui.commons.Label({
				text : "{i18n>FIRST_NAME_LABEL}"
			}) ]
		}), new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Right,
			content : [ this.oFirstNameField ]
		}));
		// lastName
		oMatrixLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ new sap.ui.commons.Label({
				text : "{i18n>LAST_NAME_LABEL}"
			}) ]
		}), new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Right,
			content : [ this.oLastNameField ]
		}));

		return (oMatrixLayout);
	},

	setProductBindingContext : function(oBindingContext) {
		this.oProductNameLabel.setBindingContext(oBindingContext);
	},

	setSubmitButtonEnabled : function(bEnable) {
		this.oSubmitButton.setEnabled(bEnable);
	},

	resetReviewCreationForm : function() {
		this.oCommentTextArea.setValue("");
		this.oRatingIndicator.setValue(0.0);
		this.oFirstNameField.setValue("");
		this.oLastNameField.setValue("");
	},

	submitButtonClicked : function(oController) {
		var oProductId = this.oProductNameLabel.getBindingContext().getProperty("ProductId");
		var oCustomerReview = {
			Comment : this.oCommentTextArea.getValue(),
			Rating : this.oRatingIndicator.getValue(),
			FirstName : this.oFirstNameField.getValue(),
			LastName : this.oLastNameField.getValue()
		};
		oController.publishReview(oProductId, oCustomerReview);
		this.oCustomerReviewCreationDialog.close();
	},

	openDialog : function(oController) {
		var that = this;
		if (this.oCustomerReviewCreationDialog) {
			this.resetReviewCreationForm();
		} else {
			this.oSubmitButton = new sap.ui.commons.Button({
				id : "customer-review-creation-submit-button-id",
				text : "{i18n>SUBMIT_BUTTON}",
				enabled : false,
				press : function() {
					that.submitButtonClicked(oController);
				},
			});
			this.oCustomerReviewCreationDialog = new sap.ui.commons.Dialog({
				id : "customer-review-creation-dialog-id",
				showCloseButton : true,
				resizable : true,
				title : "{i18n>CREATE_REVIEW_DIALOG_TITLE}",
				buttons : [ this.oSubmitButton ],
				content : [ this ],
			});
		}
		this.oCustomerReviewCreationDialog.open();
	},
});

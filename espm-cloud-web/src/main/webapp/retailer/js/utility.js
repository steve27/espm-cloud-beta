/**
 * utility.js
 * 
 * 
 */

jQuery.sap.declare("sap.app.utility");

sap.app.utility = {

	/**
	 * getServiceUrl: build correct URL for local test and productive run
	 * 
	 * @param sUrl
	 */
	getServiceUrl : function(sUrl) {
		if (!sUrl) {
			return sUrl;
		}
		// for local testing prefix with proxy
		if (window.location.hostname == "localhost") {
			return "proxy" + sUrl;
		} else {
			return sUrl;
		}
	},

	clearMessagesAfter : function(iMs) {
		window.setTimeout(function() {
			sap.app.messages.removeAllMessages();
		}, iMs);
	},

};

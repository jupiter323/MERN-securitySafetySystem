XPMobileSDK.library.Ajax = new function () {
	
	this.Request = function (connectionUrl, params) {
		
		params = Object.assign({
			method: 'POST',
			contentType: 'plain/text',
			responseType: 'text',
			encoding: 'utf-8',
			postBody: null,
			asynchronous: true,
			onLoading: function() {},
			onComplete: function() {},
			onSuccess: function() {},
			onFailure: function() {}
		}, params);
			
		var ajaxRequest = new XMLHttpRequest();
		
		var checkReadyState = function () {
			
			if (ajaxRequest.readyState == 1) {
				params.onLoading(ajaxRequest);
			}
			
			else if (ajaxRequest.readyState == 4) {
				
				params.onComplete(ajaxRequest);
				
				if ((ajaxRequest.responseType == '' || ajaxRequest.responseType == 'text') && ajaxRequest.status == 0 && ajaxRequest.responseText == '') {
					params.onFailure(ajaxRequest);
					return;
				}
				
				if (ajaxRequest.status == 200 || ajaxRequest.status == 0) {
					params.onSuccess(ajaxRequest);
				} else {
					params.onFailure(ajaxRequest);
				}
			}
		};
		
		ajaxRequest.onreadystatechange = checkReadyState;
		ajaxRequest.open(params.method, connectionUrl, params.asynchronous);
		
		if (params.asynchronous) {
			ajaxRequest.responseType = params.responseType;
		}
		
		ajaxRequest.setRequestHeader('Content-Type', params.contentType + '; charset=' + params.encoding);
		ajaxRequest.send(params.postBody);

		return ajaxRequest;
		
	};
		
};
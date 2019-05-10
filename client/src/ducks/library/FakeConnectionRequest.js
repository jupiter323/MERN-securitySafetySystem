/**
 * An instance of FakeConnectionRequest can replace an original ConnectionRequest for RequestStream command in case the Network API
 * does not send a request, and instead tries to reuse an existing video connection.
 * This reuse should be transparent to the client of the Network API, thus the FakeConnectionRequest provides the same interface as ConnectionRequest.
 * 
 * @param {String} cameraId
 * @param {Function} callback
 * @author rvp
 */
XPMobileSDK.library.FakeConnectionRequest = function (cameraId, callback) {
	
    if (callback && typeof callback == "function")
    {
        var response = XPMobileSDK.library.VideoConnectionPool.getCameraResponse(cameraId);
        var error = response && response.error ? response.error : null;
        callback(null, error, response);
    }

	this.cancel = function() {
	    XPMobileSDK.library.VideoConnectionPool.cancelFakeRequest(cameraId, callback);
	};
	
};

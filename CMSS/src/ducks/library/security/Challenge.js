/**
 * Generate a challenge that will be used to hash connectino id
 * 
 * @param 		value			string		Value of the challenge
 * @author 		tvh
 */
XPMobileSDK.library.Challenge = function(value) {
	
	/**
	 * Stores context of execution
	 * 
	 * @var			object
	 * @access		private
	 */
	var self = this;
	
	/**
	 * Stores the number of seconds sinse challeve was received from server
	 * 
	 * @var			integer
	 * @access		private
	 */
	var seconds = 1;
	
	/**
	 * Stores a reference from setInterval function that is used to calculate the number of seconds sinse challege was received from server
	 * 
	 * @var			integer
	 * @access		private
	 */
	var clockInterval = null;
	
	/**
	 * Stores a flag that points our of the challenge is valid or not
	 * 
	 * @var			boolean
	 * @access		private
	 */
	var valid = true;
	
	/**
	 * Time to live constant - in seconds
	 * 
	 * @var			integer
	 * @access		public
	 */
	this.ttl = 59 * 60; // 5 * Connection.serverTimeout;
	
	/**
	 * Starts the clock that will calcute the number of seconds sinse challenge was received from server
	 * 
	 * @access					private
	 */
	var startClock = function() {
		if(!clockInterval) {
			clockInterval = setInterval(function () {
				computeTime();
			}, 1000);
		}
	};
	
	startClock();
	
	/**
	 * Calculete the number of seconds sinse challenge was received from server
	 * 
	 * @access					private
	 */
	var computeTime = function() {
		valid = seconds >= this.ttl ? false : true;
		if(!valid) {
			self.destroy();
		}
		else {
			seconds++;
		}
	};
	
	/**
	 * Check if the challenge is valid or not
	 * 
	 * @access					public
	 * @return					boolean		true if challenge is suitable for usage / false otherwise
	 */
	this.isValid = function() {
		return valid;
	};
	

	/**
	 * Return the value of the challege
	 * 
	 * @access					public
	 * @return					string		Value of the challenge
	 */
	this.getValue = function() {
		return value;
	};
	
	/**
	 * Return the time in seconds of how long we keep the challenge in memory
	 * 
	 * @access					public
	 * @return					number		seconds
	 */
	this.getTime = function() {
		return seconds;
	};
	
	/**
	 * Destructor
	 * 
	 * @access					public
	 */
	this.destroy = function() {
		if(clockInterval) {
			clearInterval(clockInterval);
			clockInterval = null;
		}
		valid = false;
	};

};
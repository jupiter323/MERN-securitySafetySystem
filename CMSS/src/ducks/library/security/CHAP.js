/**
 * Implement the CHAP security alorythm that will secure the connection(session) ID
 * 
 *  This library requires SHA512 (http://code.google.com/p/crypto-js/#SHA-2)
 *
 * @see			http://en.wikipedia.org/wiki/Challenge-Handshake_Authentication_Protocol
 * 
 * @author 		tvh
 */
 
XPMobileSDK.library.CHAP = {
	/**
	 * Stores a list of salts that will be used for hashing
	 */
	challenges: [],
	
	/**
	 * Time interval constant in ms which defines how often the clallenges status will be checked
	 */
	monitorTime: 1000,
	
	/**
	 * Diffie-Hellman shared key
	 */
	sharedKey: '',
	
	/**
	 * Minimum amount of challenges that needs to be kept in cache
	 */
	minChallenges: 50,
	
	/**
	 * Constructor
	 */
	initialize: function() {
		XPMobileSDK.library.Connection.addObserver(this);
	},
	
	/**
	 * Start the checking mechanism of the challenges status
	 */
	start: function() {
		if(!this.challengeInterval) {
			this.challengeInterval = setInterval(function () {
				XPMobileSDK.library.CHAP.monitor();
			}, this.monitorTime);
		}
	},
	
	/**
	 * Check challenges
	 */
	monitor: function() {
		// Uncomment this line if sorting is required.
		// Currently it is made without sorting because the rule is first in last out from the array
		//this.challenges.sort(this.sort);
		
		if(!XPMobileSDK.library.Connection.connectionId) return;
		
		if(this.challenges.length > 0) {
		    for(var i = 0; i < this.challenges.length; i++) {
		        if(!this.challenges[i].isValid()) {
		            this.challenges[i].destroy();
		        }
		    }
		}
		if(this.challenges.length < this.minChallenges) {
			var params = {NumChallenges: this.minChallenges};
			if(this.challenges.length <= this.minChallenges*10/100) {
				params.Reset = 'Yes';
			}
			XPMobileSDK.requestChallenges(params);
		}
	},
	
	/**
	 * Add new challenges
	 *
	 * @param	challenges		array		List of challenges
	 */
	add: function(challenges) {
		if(typeof challenges == 'string') {
			var challenge = new XPMobileSDK.library.Challenge(challenges);
			this.challenges.push(challenge);
		}
		else if(typeof challenges == 'object' && challenges.length > 0) {
			for(var i = 0; i < challenges.length; i++) {
				var challenge = new XPMobileSDK.library.Challenge(challenges[i]);
				this.challenges.push(challenge);
			}
		}
		this.start();
	},
	
	/**
	 * Try to find a valid challenge
	 *
	 * @return		string		Valid challege value
	 */
	takeValidChallenge: function() {
		if(this.challenges.length > 0) {
			for(var i = 0; i < this.challenges.length; i++) {
				var challenge = this.challenges.shift();
				if(challenge.isValid()) {
					return challenge;
				}
				challenge.destroy();
			}
		}
		else {
			console.log('No challenges in the list!');
			return {getValue: function(){}, getTime: function(){}};
		}
	},
	
	/**
	 * Export all challenges. Used for stored in the localStorage when page is reloaded
	 *
	 * @return		array		Array of all challeges
	 */
	exportAll: function() {
		var result = [];
		this.challenges.forEach(function(challenge){
			var value = challenge.getValue();
			if(value) {
				result.push(value);
			}
		});
		return result;
	},
	
	/**
	 * Sort an array of Challenge object based on their expiration time.
	 *
	 * @param	first		object		Challenge object
	 * @param	second		object		Challenge object
	 */
	sort: function(first, second) {
		return second.getTime() - first.getTime();
	},
	
	/**
	 * Calculate the challenge answer
	 */
	calculate: function() {
		var challenge = this.takeValidChallenge();
		return {'Challenge': challenge.getValue(), 
			    'ChalAnswer': CryptoJS.SHA512((challenge.getValue()+this.sharedKey).toUpperCase()).toString(CryptoJS.enc.Base64),
			    'timeout': (challenge.ttl - challenge.getTime())*1000};
	},
	
	/**
	 * Connection state observing
	 */ 
	connectionLostConnection: function () {
		this.destroy();
	},
	
	/**
	 * Connection state observing
	 */ 
	connectionDidDisconnect: function () {
		this.destroy();
	},
	
	/**
	 * Connection request observer
	 */ 
	connectionRequestSucceeded: function(request, response) {
	    if (XPMobileSDK.library.Connection.CHAPSupported == 'Yes'
            && response
            && response.parameters
            && response.parameters.Challenge
            && XPMobileSDK.library.Connection.connectionId) {
			this.add(response.parameters.Challenge);
		}
	},
	
	/**
	 * Destructor
	 */
	destroy: function() {
		if(this.challengeInterval) {
			clearInterval(this.challengeInterval);
			this.challengeInterval = null;
		}
		if(this.challenges.length > 0) {
			for(var i = 0; i < this.challenges.length; i++) {
				var challenge = this.challenges.shift();
				challenge.destroy();
			}
		}
		this.challenges = [];
		XPMobileSDK.library.SecureString.sharedKey = null;
	}
};
define(function() {
	var utils = {
		mode: "PROD",

		logger: function(message) {
			console.log(message);
		},

		memoize: function(func, hasher) {
		    var memo = {};
		    hasher || (hasher = this.identity);
		    return function() {
		      var key = hasher.apply(this, arguments);
		      return this.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
		    };
		},

		has: function(obj, key) {
		    return hasOwnProperty.call(obj, key);
		},

		identity: function(value) {
		    return value;
		},

		fuzzy_match: function() {
			var cache = this.memoize(function(str) {
				return new RexEgp("^" + str.replace(/./g, function(x) {
					return /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/.test(x) ? "\\" + x + "?" : x + "?";
				}) + "$");
			});
			return function(str, pattern) {
				return cache(str).test(pattern)
			};
		}
	}
	return utils;
});
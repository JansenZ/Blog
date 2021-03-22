/**
 * ES6 Proxy Polyfill
 * @version 1.2.1
 * @author Ambit Tsai <ambit_tsai@qq.com>
 * @license Apache-2.0
 * @see {@link https://github.com/ambit-tsai/es6-proxy-polyfill}
 */

(function (context) {
	if (context.Proxy) return; // return if Proxy already exist

	var noop = function () {},
		assign = Object.assign || noop,
		getProto = Object.getPrototypeOf || noop,
		setProto = Object.setPrototypeOf || noop;

	/**
	 * Throw a type error
	 * @param {String} message
	 */
	function throwTypeError(message) {
		throw new TypeError(message);
	}

	/**
	 * The internal member constructor
	 * @constructor
	 * @param {Function} target
	 * @param {Object} handler
	 */
	function InternalMember(target, handler) {
		this.target = target; // [[ProxyTarget]]
		this.handler = handler; // [[ProxyHandler]]
	}

	/**
	 * The [[Call]] internal method
	 * @param {Object} thisArg
	 * @param {Object} argsList
	 */
	InternalMember.prototype.$call = function (thisArg, argsList) {
		var target = this.target,
			handler = this.handler;
		if (!handler) {
			throwTypeError('Cannot perform \'call\' on a proxy that has been revoked');
		}
		if (handler.apply == null) {
			return target.apply(thisArg, argsList);
		} else if (typeof handler.apply === 'function') {
			return handler.apply(target, thisArg, argsList);
		} else {
			throwTypeError('Proxy handler\'s apply trap must be a function');
		}
	};

	/**
	 * The [[Construct]] internal method
	 * @param {Object} thisArg
	 * @param {Object} argsList
	 * @returns {Object}
	 */
	InternalMember.prototype.$construct = function (thisArg, argsList) {
		var target = this.target,
			handler = this.handler,
			result;
		if (!handler) {
			throwTypeError('Cannot perform \'construct\' on a proxy that has been revoked');
		}
		if (handler.construct == null) {
			result = target.apply(thisArg, argsList);
			return result instanceof Object ? result : thisArg;
		} else if (typeof handler.construct === 'function') {
			result = handler.construct(target, argsList);
			if (result instanceof Object) {
				return result;
			} else {
				throwTypeError('Proxy handler\'s construct trap must return an object');
			}
		} else {
			throwTypeError('Proxy handler\'s construct trap must be a function');
		}
	};

	/**
	 * Create a Proxy object
	 * @param {Function} target
	 * @param {Object} handler
	 * @param {Object} revokeResult
	 * @returns {Function}
	 */
	function createProxy(target, handler, revokeResult) {
		// Check the type of arguments
		if (typeof target !== 'function') {
			throwTypeError('Proxy polyfill only support function target');
		} else if (!(handler instanceof Object)) {
			throwTypeError('Cannot create proxy with a non-object handler');
		}

		// Create an internal member object
		var member = new InternalMember(target, handler);

		// Create a proxy object - `P`
		function P() {
			return this instanceof P ?
				member.$construct(this, arguments) :
				member.$call(this, arguments);
		}

		assign(P, target); // copy target's properties
		P.prototype = target.prototype; // copy target's prototype
		setProto(P, getProto(target)); // copy target's [[Prototype]]

		if (revokeResult) {
			// Set the revocation function
			revokeResult.revoke = function () {
				member.target = null;
				member.handler = null;
				for (var key in P) { // delete proxy's properties
					P.hasOwnProperty(key) && delete P[key];
				}
				P.prototype = {}; // reset proxy's prototype
				setProto(P, {}); // reset proxy's [[Prototype]]
			};
		}

		return P;
	}

	/**
	 * The Proxy constructor
	 * @constructor
	 * @param {Function} target
	 * @param {Object} handler
	 * @returns {Function}
	 */
	function Proxy(target, handler) {
		if (this instanceof Proxy) {
			return createProxy(target, handler);
		} else {
			throwTypeError('Constructor Proxy requires \'new\'');
		}
	}

	/**
	 * Create a revocable Proxy object
	 * @param {Function} target
	 * @param {Object} handler
	 * @returns {{proxy, revoke}}
	 */
	Proxy.revocable = function (target, handler) {
		var result = {};
		result.proxy = createProxy(target, handler, result);
		return result;
	};

	context.Proxy = Proxy;
}(
	typeof window === 'object' ?
		window :
		typeof global === 'object' ? global : this // using `this` for web workers & supports Browserify / Webpack
));
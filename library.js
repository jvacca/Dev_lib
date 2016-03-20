//Some useful Utility functions

/* check for IE */
if(Browser.Version() <8) {
 // make crazy IE shit
}
 
var Browser = {
    Version: function(){
        var version = 999; // we assume a sane browser
        if (navigator.appVersion.indexOf("MSIE") !== -1) 
            // bah, IE again, lets downgrade version number
            version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        return version;
    }
};

/* search for elements by class name */
function getElementsByClass(searchClass,node,tag) {

	var classElements = [];

	if ( node === null )

		node = document;

	if ( tag === null )

		tag = '*';

	var els = node.getElementsByTagName(tag);

	var elsLen = els.length;

	var pattern = new RegExp('(^|\\\\s)'+searchClass+'(\\\\s|$)');

	for (i = 0, j = 0; i < elsLen; i++) {

		if ( pattern.test(els[i].className) ) {

			classElements[j] = els[i];

			j++;

		}

	}

	return classElements;

}

/* Make sure I can itereate through arrays */
	var forEach = function () {
		if (Array.prototype.forEach) {
			return function (arr, callback, self) {
				Array.prototype.forEach.call(arr, callback, self);
			};
		}

		else {
			return function (arr, callback, self) {
				for (var i=0, len=arr.length; i<len; i++) {
					if (i in arr) {
						callback.call(self, arr[i], i, arr);
					}
				}
			};
		}
	}();

	/* Make sure I can search through arrays */
	var indexOf = function () {
		if (Array.prototype.indexOf) {
			return function (arr, item, startIndex) {
				return Array.prototype.indexOf.call(arr, item, startIndex);
			};
		}

		else {
			return function (arr, item, startIndex) {
				for (var i=startIndex || 0, len=arr.length; i<len; i++) {
					if ((i in arr) && (arr[i] === item)) {
						return i;
					}
				}

				return -1;
			};
		}
	}();

	/* Make sure I can map arrays */
	var map = function () {
		if (Array.prototype.map) {
			return function (arr, callback, self) {
				return Array.prototype.map.call(arr, callback, self);
			};
		}

		else {
			return function (arr, callback, self) {
				var len = arr.length,
					mapArr = new Array(len);

				for (var i=0; i<len; i++) {
					if (i in arr) {
						mapArr[i] = callback.call(self, arr[i], i, arr);
					}
				}

				return mapArr;
			};
		}
	}();

	/* Make sure I can filter arrays */
	var filter = function () {
		if (Array.prototype.filter) {
			return function (arr, func, self) {
				return Array.prototype.filter.call(arr, func, self);
			};
		}

		else {
			return function (arr, func, self) {
				var filterArr = [];

				for (var val, i=0, len=arr.length; i<len; i++) {
					val = arr[i];

					if ((i in arr) && func.call(self, val, i, arr)) {
						filterArr.push(val);
					}
				}

				return filterArr;
			};
		}
	}();

	/* Bind event listener to element */
	var boundEvents = {};

	function bind (elem, eventName, callback) {
		if (elem.addEventListener) {
			elem.addEventListener(eventName, callback, false);
		}

		else if (elem.attachEvent) {
			var eID = elem.attachEvent('on'+eventName, callback);
			boundEvents[eID] = { name: eventName, callback: callback };
		}
	}

	function unbind (elem, eventName, callback) {
		if (elem.removeEventListener) {
			elem.removeEventListener(eventName, callback, false);
		}

		else if (elem.detachEvent) {
			for (var eID in boundEvents) {
				if ((boundEvents[eID].name === eventName) &&
						(boundEvents[eID].callback === callback)) {
					elem.detachEvent(eID);
					delete boundEvents[eID];
				}
			}
		}
	}

// Dynamic Script loading
var loadScript = function(src) {
	var script = document.createElement('script');
	script.src= src;
	var firstScript = document.getElementsByTagName('script')[0];
	firstScript.parentNode.insertBefore(script, firstScript);
};

/* search for elements by id and add returns an array */
function $() {

	var elements = [];

	for (var i = 0; i < arguments.length; i++) {

		var element = arguments[i];

		if (typeof element == 'string')

			element = document.getElementById(element);

		if (arguments.length == 1)

			return element;

		elements.push(element);

	}

	return elements;

}

/* cookie setting and getting */
function getCookie( name ) {	

	var start = document.cookie.indexOf( name + "=" );

	var len = start + name.length + 1;

	if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {

		return null;

	}

	if ( start == -1 ) return null;

	var end = document.cookie.indexOf( ';', len );

	if ( end == -1 ) end = document.cookie.length;

	return unescape( document.cookie.substring( len, end ) );

}



function setCookie( name, value, expires, path, domain, secure ) {

	var today = new Date();

	today.setTime( today.getTime() );

	if ( expires ) {

		expires = expires * 1000 * 60 * 60 * 24;

	}

	var expires_date = new Date( today.getTime() + (expires) );

	document.cookie = name+'='+escape( value ) +

		( ( expires ) ? ';expires='+expires_date.toGMTString() : '' ) + //expires.toGMTString()

		( ( path ) ? ';path=' + path : '' ) + 

		( ( domain ) ? ';domain=' + domain : '' ) +

		( ( secure ) ? ';secure' : '' );

}



function deleteCookie( name, path, domain ) {

	if ( getCookie( name ) ) document.cookie = name + '=' +

			( ( path ) ? ';path=' + path : '') +

			( ( domain ) ? ';domain=' + domain : '' ) +

			';expires=Thu, 01-Jan-1970 00:00:01 GMT';

}

/* get number of pixels user has scrolled down */
function getScrollXY() {
    var scrOfX = 0, scrOfY = 0;
 
    if( typeof( window.pageYOffset ) == 'number' ) {
        //Netscape compliant
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
        //DOM compliant
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
    }
    return [ scrOfX, scrOfY ];
}

/* get width and height of window */
function getWindowSize() {
    var myWidth = 0, myHeight = 0;
 
    if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return [ myWidth, myHeight ];
}
// CONSTRUCTORS self-invoking constructor to fix accidental call without "new"
function Constructor() {
    if (!(this instanceof Constructor)) {
       return new Constructor();
    }
    // add your properties here
}

// CHECKING FOR ARRAYNESS implement isArray method when it's missing

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function (arg) {
       return Object.prototype.toString.call(arg) === '[object Array]';
    };
}



// JSON METHODS
// preferred
var data = JSON.parse(jstr);
console.log(data.mykey); // 'my value'

var dog = {
    name: "Fido",
    dob: new Date(),
    legs: [1, 2, 3, 4]
};

var jsonstr = JSON.stringify(dog);

// jsonstr is now:
// {"name":"Fido","dob":"2012-01-01T19:00:00.436Z","legs":[1,2,3,4]}



// TRY..CATCH..ERROR OBJECTS throwing a custom error object

try {
    // something bad happened, throw an error
    throw {
        name: 'MyErrorType', // custom error type
        message: 'oops',
        extra: 'This was rather embarrassing',
        remedy: genericErrorHandler // who should handle it
    };
} catch (e) {
    // inform the user
    alert(e.message); // 'oops'

    // gracefully handle the error
    e.remedy(); // calls genericErrorHandler()
}


// CALLBACKS calling a callback function with a contect object, the string name is passed as a string
findNodes('paint', myapp);

var findNodes = function (callback, callback_obj) {
    if (typeof callback === 'string') {
        callback = callback_obj[callback];
    }

    //...
	if (typeof callback === 'function') {
	    callback.call(callback_obj, found);
	}
};



// INIT TIME BRANCHING

var utils = {
    addListener: null,
    removeListener: null
};

// the implementation
if (typeof window.addEventListener === 'function') {
    utils.addListener = function (el, type, fn) {
        el.addEventListener(type, fn, false);
    };
    utils.removeListener = function (el, type, fn) {
        el.removeEventListener(type, fn, false);
    };
} else if (typeof document.attachEvent === 'function') { // IE
    utils.addListener = function (el, type, fn) {
        el.attachEvent('on' + type, fn);
    };
    utils.removeListener = function (el, type, fn) {
        el.detachEvent('on' + type, fn);
    };
} else { // older browsers
    utils.addListener = function (el, type, fn) {
        el['on' + type] = fn;
    };
    utils.removeListener = function (el, type, fn) {
        el['on' + type] = null;
    };
}





/**********   FUNCTIONS   ***********/

// MEMOIZATION
var myFunc = function () {

    var cachekey = JSON.stringify(Array.prototype.slice.call(arguments)),
        result;

    if (!myFunc.cache[cachekey]) {
        result = {};
        // ... expensive operation ...
        myFunc.cache[cachekey] = result;
    }
    return myFunc.cache[cachekey];
};

// cache storage
myFunc.cache = {};




// CURRYING (SHONFINKELIZATION)
function curry(fn) {
    var slice = Array.prototype.slice,
        stored_args = slice.call(arguments, 1);
    return function () {
        var new_args = slice.call(arguments),
            args = stored_args.concat(new_args);
        return fn.apply(null, args);
    };
}

// Testing the schonfinkelize() function

// a normal function
function add(x, y) {
    return x + y;
}

// curry a function to get a new function
var newadd = schonfinkelize(add, 5);
newadd(4); // 9

// another option -- call the new function directly
schonfinkelize(add, 6)(7); // 13


// Example 10 - More usage examples

// a normal function
function add(a, b, c, d, e) {
    return a + b + c + d + e;
}

// works with any number of arguments
schonfinkelize(add, 1, 2, 3)(5, 5); // 16

// two-step currying
var addOne = schonfinkelize(add, 1);
addOne(10, 10, 10, 10); // 41
var addSix = schonfinkelize(addOne, 2, 3);
addSix(5, 5); // 16





// NAMESPACING
var MYAPP = MYAPP || {};
MYAPP.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = MYAPP,
        i;

    // strip redundant leading global
    if (parts[0] === 'MYAPP') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};


// Example 5 - how it can be used

// assign returned value to a local var
var module2 = MYAPP.namespace('MYAPP.modules.module2');
module2 === MYAPP.modules.module2; // true

// skip initial 'MYAPP'
MYAPP.namespace('modules.module51');

// long namespace
MYAPP.namespace('once.upon.a.time.there.was.this.long.nested.property');

/**********   MODULE PATTERNS   ***********/

//MODULE PATTERN
MYAPP.namespace('MYAPP.utlities.sample');

MYAPP.utilities.sample = (function() {
	// declare depencies by caching them
	var obj = Object.prototype.toString;

	//private properties or methods
	var val;
	var afunc = function() {
		//
	};

	// Public API
	return {
		publicAPIFunction: function() {
			//
		}
	};
}());

/**********   MODULE PATTERN CREATING CONSTRUCTORS   ***********/
// this one can be used to return a extendible instance object
MYAPP.namespace('MYAPP.utlities.sample');

MYAPP.utilities.sample = (function() {
    // declare depencies by caching them
    var obj = Object.prototype.toString;

    //private properties or methods
    var Constr;
    Constr = function(o) {
        this.elements = this.toArray(0);
    };

    Constr.prototype = {
        toArray: function() {
            //
        }
    };

    // Public API
    return Constr;
    
}());




/**********   CODE REUSE   ***********/

// mix-in pattern
function objectCopy(parent, child) {
    var i,
        achild = child || {};

    for (i in parent) {
        if (parent.hasOwnProperty(i)) {
            achild[i] = parent[i];
        }
    }

    return achild;
}

function deepCopy(parent, child) {
    var i,
    toStr = Object.prototype.toString,
    astr = "[object Array]";

    child = child || {};

    for (i in parent) {
        if (parent.hasOwnProperty(i)) {
            if (typeof parent[i] === "object") {
                child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                deepCopy(parent[i], child[i]);
            } else {
                child[i] = parent[i];
            }
        }
    }

    return child;
}

// for extending prototypes or mix-ins
function extend() {
    var arg, prop, child = {};

    for(arg = 0; arg < arguments.length; arg += 1) {
        for (prop in arguments[arg]) {
            if (arguments[arg].hasOwnProperty(prop)) {
                child[prop] = arguments[arg][prop];
            }
        }
    }

    return child;
}

// proxy pattern
var proxy = function(fn, context) {
	return (function() {
		return fn.apply(context, arguments);
	});
};

//Polly-fill for Function.prototype.bind
// it has the option of prefilling arguments as defaults (by using partial function application)
if (typeof Function.prototype.bind === "undefined") {
    Function.prototype.bind = function (thisArg) {
        var fn = this,
            slice = Array.prototype.slice,
            args = slice.call(arguments, 1);

        return function() {
            return fn.apply(thisArg, args.concat(slice.call(arguments)));
        };
    };
}

// Polly-fill for Object.create()
if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}

//Polly-fill for map
if (!Array.prototype.map)
{
   Array.prototype.map = function(fun /*, thisp*/)
   {
      var len = this.length;
      
      if (typeof fun != "function")
      throw new TypeError();
      
      var res = new Array(len);
      var thisp = arguments[1];
      
      for (var i = 0; i < len; i++)
      {
         if (i in this)
         res[i] = fun.call(thisp, this[i], i, this);
      }
      return res;
   };
}

/***** The Holy Grail of Prototypal Inheritance functions ******/

function inherit(C, P) {
    var F = function() {};
    F.prototype = P.prototype;
    C.prototype =  new F();
    C.uber = P.prototype;
    C.prototype.constructor = C;
}

// dynamically loading or lazy loading scripts
window.onload = function() {
    var script = document.createElement("script");
    script.src= "[ enter path to script here ]";
    document.documentElement.firstChild.appendChild(script);
};

;(function (window, document, undefined) {
    var $o = function (selector) {
		return new $o.fn.init(selector);
	};
    
    // Polyfills
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (search) {
            var all = document.getElementsByTagName('*'),
                len = all.length,
                match = [], i, j;
            
            for (i = 0; i < len; i++) {
                var el = all[i],
                    class_list = el.className.split(' ');
                
                for (j = 0; j < class_list.length; j++) {
                    if (class_list[j] === search) {
                        match.push(el);
                        break;
                    }
                }
            }
            
            return match;
        };
    }
    
    // Private functions
    var isElementSelector = function (selector) {
        
    };
    
    var isHasAttrSelector = function (selector) {
          
    };
    
    var isEqualAttrSelector = function (selector) {
          
    };
    
    var getElementsByAttribute = function (selector) {
          
    };
    
    $o.fn = $o.prototype = {
        init: function (selector) {
            if (!selector) return this;
            
            // DOMElement
            if (selector.nodeType) {
                this.target = selector;
            }
            
            // HTML string
            if (typeof selector === 'string') {
                // Class
                if (selector.charAt(0) === '.') {
                    this.target = document.getElementsByClassName(selector.slice(1, selector.length));
                }
                // ID
                else if (selector.charAt(0) === '#') {
                    this.target = document.getElementById(selector.slice(1, selector.length));   
                }
                else if (isElementSelector(selector)) {
                    this.target = document.getElementsByTagName(selector);
                }
                else if (isHasAttrSelector(selector)) {
                    
                }
                else if (isEqualAttrSelector(selector)) {
                    
                }
                // All
                else if (selector = '*') {
                    this.target = document.getElementsByTagName(selector);
                }
            }
            
            this.length = this.target.length || 0;
        },
    };
    
    window.$o = $o;
})(window, document);
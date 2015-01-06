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
        return !/[^a-z]/i.test(selector);
    };
    
    var isHasAttrSelector = function (selector) {
        return /\[((?!=).)+\]/g.exec(selector);
    };
    
    var isEqualAttrSelector = function (selector) {
        return /\[(.+)=(.+)\]/g.exec(selector);
    };
    
    var getElementsByAttribute = function (attr) {
        var all = document.getElementsByTagName('*'),
            match = [];
        
        for (var i = 0, len = all.length; i < len; i++) {
            var el = all[i];
            if (el.hasAttribute(attr))
                match.push(el);
        }
        
        return match;
    };
    
    var getElementsByAttributeValue = function (attr, value) {
        var all = document.getElementsByTagName('*'),
            match = [];
        
        for (var i = 0, len = all.length; i < len; i++) {
            var el = all[i];
            if (el.hasAttribute(attr) && el.getAttribute(attr) === value)
                match.push(el);
        }
        
        return match;
    };
    
    var insertAfter = function (el, content) {
        if (typeof content === 'string') {
            el.insertAdjacentHTML('afterEnd', content);   
        }
        else if ((content.nodeType && content.nodeType === 3) || content instanceof $o.fn.init) {
            el.insertAdjacentHTML('afterEnd', content.textContent);   
        }
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
                else if ((match = isHasAttrSelector(selector)) !== null) {
                    // Get attribute name
                    var attrName = match[0].slice(1, selector.length - 1);
                    
                    this.target = getElementsByAttribute(attrName);
                }
                else if ((match = isEqualAttrSelector(selector)) !== null) {
                    this.target = getElementsByAttributeValue(match[1], match[2]);
                }
                // All
                else if (selector === '*') {
                    this.target = document.getElementsByTagName(selector);
                }
                else return this;
            }
            
            this.length = this.target.length || 0;
        },
        
        addClass: function (className) {
            if (this.length === 0) {
                this.target.className += (this.target.className === '' ? className : ' ' + className);
            }
            else {
                for (var i = 0, len = this.length; i < len; i++) {
                    var el = this.target[i];
                    el.className += (el.className === '' ? className : ' ' + className);
                }
            }
            
            return this;
        },
        
        after: function (content) {
            if (this.length === 0) {
                insertAfter(this.target, content);
            }
            else {
                for (var i = 0, len = this.length; i < len; i++) {
                    insertAfter(this.target[i], content);   
                }
            }
            
            return this;
        },
        
        // Remove class
    };
    
    window.$o = $o;
})(window, document);
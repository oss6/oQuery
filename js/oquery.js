;(function (window, document, undefined) {
    var
    
    $o = function (selector) {
        $o.fn.init.prototype = $o.fn;
        return new $o.fn.init(selector);
	},
    lst = function() {
        var events = {};

        if (typeof window.addEventListener === 'function') {
            events.addListener = function(el, type, fn) {
                el.addEventListener(type, fn, false);
            };
            events.removeListener = function(el, type, fn) {
                el.removeEventListener(type, fn, false);
            };
        } else if (typeof document.attachEvent === 'function') { // IE
            events.addListener = function(el, type, fn) {
                el.attachEvent('on' + type, fn);
            };
            events.removeListener = function(el, type, fn) {
                el.detachEvent('on' + type, fn);
            };
        } else { // Older
            events.addListener = function(el, type, fn) {
                el['on' + type] = fn;
            };
            events.removeListener = function(el, type, fn) {
                el['on' + type] = null;
            };
        };

        return events;
    }(),
    isElementSelector = function (selector) {
        return !/[^a-z]/i.test(selector);
    },
    isHasAttrSelector = function (selector) {
        return /\[((?!=).)+\]/g.exec(selector);
    },
    isEqualAttrSelector = function (selector) {
        return /\[(.+)=(.+)\]/g.exec(selector);
    },
    getElementsByAttribute = function (attr) {
        var all = document.getElementsByTagName('*'),
            match = [];
        
        for (var i = 0, len = all.length; i < len; i++) {
            var el = all[i];
            if (el.hasAttribute(attr))
                match.push(el);
        }
        
        return match;
    },
    getElementsByAttributeValue = function (attr, value) {
        var all = document.getElementsByTagName('*'),
            match = [];
        
        for (var i = 0, len = all.length; i < len; i++) {
            var el = all[i];
            if (el.hasAttribute(attr) && el.getAttribute(attr) === value)
                match.push(el);
        }
        
        return match;
    },
    insertAfter = function (el, content) {
        if (typeof content === 'string') {
            el.insertAdjacentHTML('afterEnd', content);   
        }
        else if ((content.nodeType && content.nodeType === 3) || content instanceof $o.fn.init) {
            el.insertAdjacentHTML('afterEnd', content.textContent);   
        }
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
    
    $o.fn = $o.prototype = {
        constructor: $o,
        
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
                // Element selector (e.g. div)
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
            }
            
            this.length = this.target.length || 0;
        },
        
        addListener: lst.addListener,
        
        removeListener: lst.removeListener,
        
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
        
        attr: function (attr, value) {
            
            // Get attr value
            if (value === undefined) {
                var el = (this.length === 0 ? this.target : this.target[0]);
                return el.getAttribute(attr);
            }
            // Set attr with string
            else {
                if (this.length === 0) {
                    this.target.setAttribute(attr, value);
                }
                else {
                    for (var i = 0, len = this.length; i < len; i++)
                        this.target[i].setAttribute(attr, value);
                }
                
                return this;
            }
        },
        
        bind: function (eventType, handler) {
            this.addListener(this.target, eventType, handler);
            return this;
        },
        
        css: function (prop, value) {
            if (!prop) return;
            
            if (value === undefined) {
                return window.getComputedStyle(this.length ? this.target[0] : this.target, null).getPropertyValue(prop);
            }
            else {
                if (this.length) {
                    for (var i = 0, len = this.length; i < len; i++) {
                        this.target[i][prop] = value;
                    }
                } else {
                    this.target[prop] = value;
                }
                
                return this;
            }
        },
        
        eq: function (idx) {
            var el = this.target[idx];
            return el ? new $o.fn.init(selector) : this;
        },
        
        first: function () {
            return this.eq(0);   
        },
        
        last: function () {
            return this.eq(this.length - 1);
        },
        
        removeClass: function () {
            
        },
        
        unbind: function (eventType, handler) {
            this.removeListener(this.target, eventType, handler);
            return this;
        },
    };
    
    window.$o = $o;
})(window, document);
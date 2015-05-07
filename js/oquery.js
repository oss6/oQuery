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
        }

        return events;
    }(),

    decorator = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var target = args[0];

            if (!target.length) {
                fn.apply(null, args);
            }
            else {
                forEach(target, function (e) {
                    fn.apply(null, [e].concat(args.slice(1)));
                });
            }
        };
    },
        
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

    append = function (el, content) {
        if (typeof content === 'string') {
            el.insertAdjacentHTML('beforeend', content);
        }
        else if (content.nodeType && content.nodeType === 3) {
            el.insertAdjacentHTML('beforeend', content.textContent);
        }
        else if (content instanceof $o.fn.init) {
            el.appendChild(content.target);
        }
    },

    insertAfter = function (el, content) {
        if (el.parentNode) {
            if (typeof content === 'string') {
                el.insertAdjacentHTML('afterend', content);
            }
            else if (content.nodeType && content.nodeType === 3) {
                el.insertAdjacentHTML('afterend', content.textContent);
            }
            else if (content instanceof $o.fn.init) {
                var target = content.target,
                    clone = target.cloneNode(true);

                el.parentNode.insertBefore(clone, el.nextSibling);
            }
        }
    },

    removeChildNodes = function (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    },

    forEach = function (arr, fn) {
        for (var i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    },

    formatStr = function (str) {
        return str.replace(/\s{2,}/g, ' ');
    },

    classy = (function () {

        var exp = {};

        var trim = function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        };

        exp.add = function (el, name) {
            if (exp.has(el, name)) return;

            if (el.className === '') {
                el.className = name;
            }
            else {
                el.className += ' ' + name;
            }
        };

        exp.remove = function (el, name) {
            var className = el.className;
            el.className = trim(className.replace(name, '').replace(/\s{2,}/g, ' '));
        };

        exp.has = function (el, name) {
            return el.className && new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
        };

        return exp;

    })();
    
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

            var match;

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
            var _addClass = decorator(classy.add);
            _addClass(this.target, className);
            
            return this;
        },
        
        after: function (content) {
            var _after = decorator(insertAfter);
            _after(this.target, content);
            
            return this;
        },

        append: function (content) {
            var _append = decorator(append);
            _append(this.target, content);

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
                var _setAttr = decorator(function (el, name, value) { el.setAttribute(name, value); });
                _setAttr(this.target, attr, value);

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
                        this.target[i].style[prop] = value;
                    }
                } else {
                    this.target.style[prop] = value;
                }
                
                return this;
            }
        },
        
        eq: function (idx) {
            var el = this.target[idx];
            return el ? new $o.fn.init(selector) : this;
        },

        empty: function () {
            // Remove all child nodes
            var _empty = decorator(removeChildNodes);
            _empty(this.target);

            return this;
        },
        
        first: function () {
            return this.eq(0);   
        },

        hasClass: function (className) {
            if (this.length === 0) {
                return classy.has(this.target, className);
            }

            for (var i = 0, len = this.length; i < len; i++) {
                if (classy.has(this.target[i], className))
                    return true;
            }

            return false;
        },

        hide: function () {
            var _hide = decorator(function (e) {
                if (e.style.display !== 'none') {
                    e.style.display = 'none';
                }
            });
            _hide(this.target);
        },

        html: function (htmlStr) {
            var elem = this.length === 0 ? this.target : this.target[0];

            // Getter
            if (typeof htmlStr === 'undefined') {
                return elem.innerHTML;
            }
            // Setter
            else {
                elem.innerHTML = htmlStr;
            }
        },

        last: function () {
            return this.eq(this.length - 1);
        },

        remove: function () {
            // Remove without filtering
            var _remove = decorator(function (e) {
                e.parentNode.removeChild(e);
            });
            _remove(this.target);
        },

        removeClass: function (className) {
            var _removeClass = decorator(classy.remove);
            _removeClass(this.target, className);
            
            return this;
        },

        show: function () {
            // Back to previous (olddisplay) display property

        },
        
        unbind: function (eventType, handler) {
            this.removeListener(this.target, eventType, handler);
            return this;
        }
    };
    
    window.$o = $o;
})(window, document);
var $t = (function () {

    var _ = {};

    _.suite = function (name, fn) {
        var host = document.getElementsByClassName('tiny-assert')[0],
            suite = document.createElement('div'),
            title = document.createElement('h1');

        suite.className = 'suite';

        title.appendChild(document.createTextNode(name));
        suite.appendChild(title);
        host.appendChild(suite);
    };

    _.assert = function (expr, desc) {
        var li = document.createElement('li');
        li.className = expr ? 'pass' : 'fail';
        li.appendChild(document.createTextNode(desc));
        document.getElementsByClassName('tiny-assert')[0].appendChild(li);
    };

    return _;

})();
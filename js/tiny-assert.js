var $t = (function () {

    var _ = {};
    var suiteDiv,
        list,
        host = document.getElementsByClassName('tiny-assert')[0];

    _.suite = function (name, fn) {
        suiteDiv = document.createElement('div');
        suiteDiv.className = 'suite';
        list = document.createElement('ul');
        var title = document.createElement('h1');

        title.appendChild(document.createTextNode(name));
        suiteDiv.appendChild(title);
        suiteDiv.appendChild(list);
        host.appendChild(suiteDiv);

        fn();
    };

    _.assert = function (expr, desc) {
        var li = document.createElement('li');
        li.className = expr ? 'pass' : 'fail';
        li.appendChild(document.createTextNode(desc));
        list.appendChild(li);
    };

    return _;

})();
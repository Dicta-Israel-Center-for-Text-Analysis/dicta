jTextMinerApp.filter("positiveInfluence", function () { // register new filter
    return function (items, className) { // filter arguments
        // http://stackoverflow.com/questions/11753321/passing-arguments-to-angularjs-filters
        if (angular.isUndefined(items))
            return [];
        return items.filter(item =>
            (item.tTestForEachClass[className] === Math.max(...Object.values(item.tTestForEachClass))
                && item.influence > 0));
    };
});
jTextMinerApp.filter("negativeInfluence", function () { // register new filter
    return function (items, className) { // filter arguments
        // http://stackoverflow.com/questions/11753321/passing-arguments-to-angularjs-filters
        if (angular.isUndefined(items))
            return [];
        return items.filter(item =>
            (item.tTestForEachClass[className] === Math.max(...Object.values(item.tTestForEachClass))
                && item.influence < 0));
    };
});

jTextMinerApp.filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };
});


jTextMinerApp.filter('makeValidId', function () {
    return function (text) {
        var str = text.replace('.', '');
        str = str.replace(/ /g,'-')
        return str;
    };
});



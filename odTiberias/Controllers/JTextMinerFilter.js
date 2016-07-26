jTextMinerApp.filter("positiveInfluence", function () { // register new filter
    return function (items, index) { // filter arguments
        // http://stackoverflow.com/questions/11753321/passing-arguments-to-angularjs-filters
        var arrayToReturn = [];
        if (angular.isUndefined(items))
            return arrayToReturn;
        for (var i = 0; i < items.length; i++) {
            if (items[i].maxClassIndex == index && items[i].influence > 0) {
                arrayToReturn.push(items[i]);
            }
        }
        return arrayToReturn;
    };
});
jTextMinerApp.filter("negativeInfluence", function () { // register new filter
    return function (items, index) { // filter arguments
        // http://stackoverflow.com/questions/11753321/passing-arguments-to-angularjs-filters
        var arrayToReturn = [];
        if (angular.isUndefined(items))
            return arrayToReturn;
        for (var i = 0; i < items.length; i++) {
            if (items[i].maxClassIndex == index && items[i].influence < 0) {
                arrayToReturn.push(items[i]);
            }
        }
        return arrayToReturn;
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


jTextMinerApp.filter('removeDot', function () {
    return function (text) {
        var str = text.replace('.', '');
        return str;
    };
});



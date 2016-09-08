

jTextMinerApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
jTextMinerApp.directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
});
jTextMinerApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

//http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
jTextMinerApp.directive('autoFocus', function ($timeout) { // not in use
    return {
        restrict: 'AC',
        link: function (_scope, _element) {
            $timeout(function () {
                _element[0].focus();
            }, 0);
        }
    };
});
jTextMinerApp.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on('focusOn', function (e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});
// it does not work: http://stackoverflow.com/questions/14968690/sending-event-when-angular-js-finished-loading
// it works:         http://stackoverflow.com/questions/21715256/angularjs-event-to-call-after-content-is-loaded
jTextMinerApp.directive('elemReady', function ($parse) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            elem.ready(function () {
                $scope.$apply(function () {
                    var func = $parse(attrs.elemReady);
                    func($scope);
                })
            })
        }
    }
});




/* test directives */
jTextMinerApp.directive('myTemplate', function () {
    return {
        restrict: 'A',
        template: 'Name: {{template.name}} Address: {{template.address}}'
    };
});
jTextMinerApp.directive('myTemplateUrl', function () {
    return {
        restrict: 'A',
        templateUrl: 'partials/templates/test/my-template.html'
    };
});
jTextMinerApp.directive('myTemplateUrlFunction', function () {
    return {
        restrict: 'AE',
        templateUrl: function(elem, attr){
            return 'partials/templates/test/my-template-' + attr.type + '.html';
        }
    };
});
jTextMinerApp.directive('myTemplateUrlUsingScope', function () {
    return {
        restrict: 'E',
        scope: {
            templateInfo: '=infoData'
        },
        templateUrl: 'partials/templates/test/my-template-info.html'
    };
});
jTextMinerApp.directive('myTemplateUrlUsingTransclude', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/templates/test/my-template-transclude.html'
    };
});
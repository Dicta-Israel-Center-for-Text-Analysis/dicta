jTextMinerApp.component('bibleViewSelectedText',
{
    bindings: {
        onSearch: '&',
        onClassify: '&',
        onSegment: '&'
    },
    templateUrl: 'Components/ViewSelectedText/bibleViewSelectedText.component.html',
    controller: ['$scope', 'SelectClassService', 'APIService', 'FeatureCollectionFactory', 'bibleContextMenu', '$q','$http',
        function ($scope, SelectClassService, APIService, FeatureCollectionFactory, bibleContextMenu, $q, $http) {
            var ctrl = this;
            ctrl.RESULTS_AT_A_TIME = 10;
            ctrl.currentPage = 1;
            ctrl.running = true;
            ctrl.selectClassService = SelectClassService;
            ctrl. featureCollection = FeatureCollectionFactory.newCollection();
            ctrl.featureCollection.Feature_sets[0].fromEachClass = true;
            
            $scope.$watchCollection("$ctrl.selectClassService.testText", updateText);
            function updateText() {
                APIService.call('TextFeatures/GetTextLargeAndSmall', SelectClassService.testText.keys)
                    .then(function (response) {
                        ctrl.chunks = response.data;
                        ctrl.running = false;
                    });
            }

            ctrl.processText = function (text) {
                return text.split(' ').map(word => '<span>' + word + '</span>').join(' ');
            };

            ctrl.menuOptions = bibleContextMenu.menu(ctrl.onSearch);

            ctrl.updateResults = function () {

            }

            ctrl.isNotEmpty = function (collection) {
                return !_.isEmpty(collection);
            };
        }]
}); 
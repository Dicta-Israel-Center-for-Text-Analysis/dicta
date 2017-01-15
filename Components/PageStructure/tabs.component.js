jTextMinerApp.component('tabs',
{
    templateUrl: "Components/PageStructure/tabs.component.html",
    controller: function ($scope, ClassService, $rootScope, SelectClassService) {
        $scope.tabNumber = 0;
        $scope.goToTab = function (tabNumber) {
            tiberias_tour_pause();
            $scope.tabNumber = tabNumber;
            switch(tabNumber) {
                case 1: tiberias_tour(ParallelsTour); break;
                case 2: tiberias_tour(ClassificationTour); break;
                case 3: tiberias_tour(SegmentationTour); break;
            }
        };

        $scope.tabClass = function(tabNumber){
            return $scope.tabNumber == tabNumber ? "active" : "";
        };

        $scope.SelectedTestClassText = function () {
            if (SelectClassService.testText && (SelectClassService.testText.mode == 'SelectOnlineCorpus'))
                return SelectClassService.testText.keys.join(', ');
            else
                return "Uploaded Text";
        }
    }
}
);
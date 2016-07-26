// create the controller and inject Angular's $scope
jTextMinerApp.controller('AddFeatureSetDialogController', function ($scope, ngDialog, InProgressService, APIService, FeatureService, ClassService) {
    
    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    $scope.isAllBible = ClassService.isAllBible
    $scope.$on('isAllBibleValueUpdated', function () {
        $scope.isAllBible = ClassService.isAllBible;
    });

    $scope.TokenizerType = 'Word';
    $scope.FeatureType = 'Unigram';
    $scope.NormalizerType = 'Frequency';
    $scope.FilterType = 'Common';
    $scope.FilterCount = 250;
    $scope.isTakeFromFile = false;
    $scope.isDescending = true;
    $scope.isFromEachClass = false;
    $scope.isIncludeLexeme = false;
    $scope.isSpoOnly = false;
    $scope.isVocalized = true;
    $scope.isSinDot = false;
    $scope.isTokenized = false;
    $scope.isIncludingNumbers = false;
    $scope.isIncludingPunctuation = false;
    

    $scope.addFeatureSet = function () {
        FeatureService.FeatureSet_maxId = FeatureService.FeatureSet_maxId + 1;
        console.log("isIncludeLexeme: " + $scope.isIncludeLexeme);
        console.log("isSpoOnly: " + $scope.isSpoOnly);
        FeatureService.Feature_sets.push({
            id: FeatureService.FeatureSet_maxId,
            featureSetName: 'Default name' + FeatureService.FeatureSet_maxId,
            tokenizerType: $scope.TokenizerType,
            featureType: $scope.FeatureType,
            normalizerType: $scope.NormalizerType,
            filterType: $scope.FilterType,
            filterCount: $scope.FilterCount,
            takeFromFile: $scope.isTakeFromFile,
            descending: $scope.isDescending,
            fromEachClass: $scope.isFromEachClass,
            includeLexeme: $scope.isIncludeLexeme,
            spoOnly: $scope.isSpoOnly,
            vocalized: $scope.isVocalized,
            sinDot: $scope.isSinDot,
            tokenized: $scope.isTokenized,
            includeNumber: $scope.isIncludingNumbers,
            includePunctuation: $scope.isIncludingPunctuation
        });

    }

    $scope.addFeatureSetAndReturn = function () {
        $scope.addFeatureSet();
        $scope.confirm();
    }
    

});
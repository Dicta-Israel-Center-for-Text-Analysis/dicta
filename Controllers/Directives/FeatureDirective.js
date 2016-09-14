var morphologyIdDict = {
    "PREFIX_FUNCTION_CONJUNCTION": "conjunction",
    "PREFIX_FUNCTION_DEFINITEARTICLE": "definite article",
    "PREFIX_FUNCTION_INTERROGATIVE": "interrogative",
    "PREFIX_FUNCTION_PREPOSITION": "preposition",
    "PREFIX_FUNCTION_RELATIVIZER_SUBORDINATINGCONJUNCTION": "relativizer / subordinating conjunction",
    "PREFIX_FUNCTION_TEMPORALSUBCONJ": "temporal subordinating conjunction",
    "PREFIX_FUNCTION_ADVERB": "adverb",
    "BASEFORM_POS_ADJECTIVE": "adjective",
    "BASEFORM_POS_ADVERB": "adverb",
    "BASEFORM_POS_CONJUNCTION": "conjunction",
    "BASEFORM_POS_AT_PREP": "at-preposition",
    "BASEFORM_POS_NEGATION": "negation",
    "BASEFORM_POS_NOUN": "noun",
    "BASEFORM_POS_NUMERAL": "numeral",
    "BASEFORM_POS_PREPOSITION": "preposition",
    "BASEFORM_POS_PRONOUN": "pronoun",
    "BASEFORM_POS_PROPERNAME": "proper name",
    "BASEFORM_POS_VERB": "verb",
    "BASEFORM_POS_PUNCUATION": "punctuation",
    "BASEFORM_POS_PARTICLE": "particle",
    "BASEFORM_POS_INTERROGATIVE": "interrogative",
    "BASEFORM_POS_INTERJECTION": "interjection",
    "BASEFORM_POS_UNKNOWN": "unknown",
    "BASEFORM_POS_QUANTIFIER": "quantifier",
    "BASEFORM_POS_EXISTENTIAL": "existential",
    "BASEFORM_POS_MODAL": "modal",
    "BASEFORM_POS_PREFIX": "prefix",
    "BASEFORM_POS_URL": "url",
    "BASEFORM_POS_JUNK": "junk",
    "BASEFORM_POS_PARTICIPLE": "participle",
    "BASEFORM_POS_COPULA": "copula",
    "BASEFORM_POS_NUMEXP": "number expression",
    "BASEFORM_POS_TITULAR": "titular",
    "BASEFORM_POS_SHEL_PREP": "shel-preposition",
    "BASEFORM_GENDER_MASCULINE": "masculine",
    "BASEFORM_GENDER_FEMININE": "feminine",
    "BASEFORM_GENDER_MASCULINEFEMININE": "masculine/feminine",
    "BASEFORM_NUMBER_SINGULAR": "singular",
    "BASEFORM_NUMBER_PLURAL": "plural",
    "BASEFORM_NUMBER_DUAL": "dual",
    "BASEFORM_NUMBER_DUALPLURAL": "dual/plural",
    "BASEFORM_NUMBER_SINGULARPLURAL": "singular/plural",
    "BASEFORM_PERSON_1": "first",
    "BASEFORM_PERSON_2": "second",
    "BASEFORM_PERSON_3": "third",
    "BASEFORM_PERSON_ANY": "any",
    "BASEFORM_STATUS_ABSOLUTE": "absolute",
    "BASEFORM_STATUS_CONSTRUCT": "construct",
    "BASEFORM_STATUS_ABSOLUTECONSTRUCT": "absolute-construct",
    "BASEFORM_TENSE_PAST": "past",
    "BASEFORM_TENSE_ALLTIME": "all",
    "BASEFORM_TENSE_PRESENT": "present",
    "BASEFORM_TENSE_FUTURE": "future",
    "BASEFORM_TENSE_TOINFINITIVE": "infinitive",
    "BASEFORM_TENSE_BAREINFINITIVE": "origin",
    "BASEFORM_POLARITY_POSITIVE": "positive",
    "BASEFORM_POLARITY_NEGATIVE": "negative",
    "BASEFORM_BINYAN_PAAL": "paal",
    "BASEFORM_BINYAN_NIFAL": "nifal",
    "BASEFORM_BINYAN_HIFIL": "hifil",
    "BASEFORM_BINYAN_HUFAL": "hufal",
    "BASEFORM_BINYAN_PIEL": "piel",
    "BASEFORM_BINYAN_PUAL": "pual",
    "BASEFORM_BINYAN_HITPAEL": "hitpael",
    "SUFFIX_FUNCTION_POSSESIVEPRONOUN": "possessive",
    "SUFFIX_FUNCTION_ACCUSATIVENOMINATIVE": "accusative/nominative",
    "SUFFIX_FUNCTION_PRONOMIAL": "pronomial",
    "SUFFIX_GENDER_MASCULINE": "masculine",
    "SUFFIX_GENDER_FEMININE": "feminine",
    "SUFFIX_GENDER_MASCULINEFEMININE": "masculine/feminine",
    "SUFFIX_NUMBER_SINGULAR": "singular",
    "SUFFIX_NUMBER_PLURAL": "plural",
    "SUFFIX_NUMBER_DUAL": "dual",
    "SUFFIX_NUMBER_DUALPLURAL": "dual/plural",
    "SUFFIX_NUMBER_SINGULARPLURAL": "singular/plural",
    "SUFFIX_PERSON_1": "first",
    "SUFFIX_PERSON_2": "second",
    "SUFFIX_PERSON_3": "third",
    "SUFFIX_PERSON_ANY": "any",
    "BASEFORM_CONJUNCTIONTYPE_COORDINATING": "coordinating",
    "BASEFORM_CONJUNCTIONTYPE_SUBORDINATING": "subordinating",
    "BASEFORM_CONJUNCTIONTYPE_RELATIVIZING": "relativizing",
    "BASEFORM_PRONOUNTYPE_PERSONAL": "personal",
    "BASEFORM_PRONOUNTYPE_DEMONSTRATIVE": "demonstrative",
    "BASEFORM_PRONOUNTYPE_IMPERSONAL": "impersonal",
    "BASEFORM_PRONOUNTYPE_REFLEXIVE": "reflexive",
    "BASEFORM_NUMBERTYPE_ORDINAL": "ordinal",
    "BASEFORM_NUMBERTYPE_CARDINAL": "cardinal",
    "BASEFORM_NUMBERTYPE_FRACTIONAL": "fractional",
    "BASEFORM_NUMBERTYPE_LITERAL": "literal",
    "BASEFORM_NUMBERTYPE_GEMATRIA": "gematria",
    "BASEFORM_NERTYPE_PERSON": "person",
    "BASEFORM_NERTYPE_LOCATION": "location",
    "BASEFORM_NERTYPE_ORGANIZATION": "organization",
    "BASEFORM_NERTYPE_PRODUCT": "product",
    "BASEFORM_NERTYPE_DATETIME": "date/time",
    "BASEFORM_NERTYPE_COUNTRY": "country",
    "BASEFORM_NERTYPE_LANGUAGE": "language",
    "BASEFORM_NERTYPE_COIN": "coin",
    "BASEFORM_NERTYPE_SYMBOL": "symbol",
    "BASEFORM_NERTYPE_OTHER": "other",
    "BASEFORM_NERTYPE_TOWN": "town",
    "BASEFORM_PUNCTUATIONTYPE_BRACKETSTART": "bracket start",
    "BASEFORM_PUNCTUATIONTYPE_BRACKETEND": "bracket end",
    "BASEFORM_PUNCTUATIONTYPE_COMMA": "comma",
    "BASEFORM_PUNCTUATIONTYPE_DOT": "dot",
    "BASEFORM_PUNCTUATIONTYPE_ARITHMETICOPERATION": "arithmetic operation",
    "BASEFORM_PUNCTUATIONTYPE_QUOTE": "quote",
    "BASEFORM_PUNCTUATIONTYPE_QUESTION": "question",
    "BASEFORM_PUNCTUATIONTYPE_EXCLAMQATION": "exclamqation",
    "BASEFORM_PUNCTUATIONTYPE_COLON": "colon",
    "BASEFORM_PUNCTUATIONTYPE_SEMICOLON": "semi colon",
    "BASEFORM_PUNCTUATIONTYPE_HYPHEN": "hyphen",
    "BASEFORM_PUNCTUATIONTYPE_SLASH": "slash start",
    "BASEFORM_PUNCTUATIONTYPE_AND": "and",
    "BASEFORM_PUNCTUATIONTYPE_OR": "or",
    "BASEFORM_PUNCTUATIONTYPE_OTHER": "other",
    "BASEFORM_INTERROGATIVETYPE_PRONOUN": "pronoun",
    "BASEFORM_INTERROGATIVETYPE_PROADVERB ": "proadverb",
    "BASEFORM_INTERROGATIVETYPE_PRODET": "prodet",
    "BASEFORM_INTERROGATIVETYPE_YESNO": "yesno",
    "BASEFORM_QUANTIFIERTYPE_AMOUNT": "amount",
    "BASEFORM_QUANTIFIERTYPE_PARTITIVE": "partitive",
    "BASEFORM_QUANTIFIERTYPE_DETERMINER": "determiner",
    "BASEFORM_PARTICIPLE_VERB": "verb",
    "BASEFORM_PARTICIPLE_NOUN_ADJ": "noun/adjective"
}

function prettyPrintMorphology(converted) {
    converted = converted.replace(/^@/, '').replace(/_$/, '');
    for (var term in morphologyIdDict) {
        converted = converted.replace('#' + term,', ' + morphologyIdDict[term]);
    }
    converted = converted.replace(/#/g, ', ').replace(/^, /, '');
    return converted;
}

jTextMinerApp.directive('featureSets', function (ngDialog) {
    return {
        restrict: 'AE',
        scope: {
            showDeleteButton: '=showDeleteButton',
            featureCollection: '='
        },
        templateUrl: 'partials/templates/FeatureSetTemplate.html',
        controller: ['$scope', function ($scope) {
            $scope.Feature_sets = $scope.featureCollection.Feature_sets;
            $scope.deleteFeatureSet = function (index) {
                $scope.featureCollection.deleteFeatureSet(index);
            };
            $scope.editFeatureSet = function (index) {
                ngDialog.openConfirm({
                    template: 'partials/Dialogs/partial-EditFeatureSetDialog.html',
                    controller: 'EditFeatureSetDialogController',
                    className: 'ngdialog-theme-default override-background',
                    scope: $scope,
                    closeByEscape: true,
                    closeByDocument: true,
                    data: {
                        featureCollection: $scope.featureCollection,
                        featureIndex: index
                    }
                }).then(function (value) {
                    tiberias_tour_pause();
                }, function (reason) {
                    tiberias_tour_pause();
                });
            };
        }]
    };
});

jTextMinerApp.directive('featureTable', function (ClassService) {
    return {
        restrict: 'AE',
        scope: {
            isSelectDisabled: '=isSelectDisabled',
            features: '=',
            isMorphology: '='
        },
        templateUrl: 'partials/templates/FeatureTableTemplate.html',
        controller: ['$scope', function ($scope) {
            $scope.predicate = '-maxTTest';

            $scope.maxTTestFilter = function (item) {
                return (item.maxTTest >= 2.0);
            };

            $scope.sortKey = '-maxTTest';
            $scope.sortReverse = false;
            $scope.sortClick = function (field){
                if ($scope.sortKey==field) {
                    $scope.sortReverse = !$scope.sortReverse;
                }
                else {
                    $scope.sortKey = field;
                    $scope.sortReverse = false;
                }
            }
            $scope.arrowClass = function (field) {
                if ($scope.sortKey == field) {
                    if ($scope.sortReverse)
                        return "fa fa-caret-up";
                    else
                        return "fa fa-caret-down";
                }
                return "";
            }

            $scope.classNameToBgStyle = function (name) {
                return { "background-color": ClassService.classNameToColor(name) };
            };

            $scope.convertFeatureName = function (featureName) {
                var converted = featureName;
                if ($scope.isMorphology) {
                    converted = prettyPrintMorphology(converted);
                }
                return converted;
            }


            /* currently unused
            $scope.isMoreDetails = false;
            $scope.moreDetails = function () {
                $scope.isMoreDetails = true;
            }
            $scope.fewerDetails = function () {
                $scope.isMoreDetails = false;
            }

            $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
            $scope.updateTotalNumberOfFeatures = function(item)
            {
                FeatureService.updateTotalNumberOfFeatures(item);
            }

            $scope.$on('totalNumberOfFeaturesUpdated', function () {
                $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
            });
            */
        }]
    };
});

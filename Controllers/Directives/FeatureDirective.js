var morphologyIdDict = {
    "PREFIX_FUNCTION_CONJUNCTION": "conj",
    "PREFIX_FUNCTION_DEFINITEARTICLE": "def",
    "PREFIX_FUNCTION_INTERROGATIVE": "interrogative",
    "PREFIX_FUNCTION_PREPOSITION": "prep",
    "PREFIX_FUNCTION_RELATIVIZER_SUBORDINATINGCONJUNCTION": "subconj",
    "PREFIX_FUNCTION_TEMPORALSUBCONJ": "temp",
    "PREFIX_FUNCTION_ADVERB": "adverb",
    "BASEFORM_POS_ADJECTIVE": "adj",
    "BASEFORM_POS_ADVERB": "adv",
    "BASEFORM_POS_CONJUNCTION": "conj",
    "BASEFORM_POS_AT_PREP": "prep",
    "BASEFORM_POS_NEGATION": "neg",
    "BASEFORM_POS_NOUN": "noun",
    "BASEFORM_POS_NUMERAL": "num",
    "BASEFORM_POS_PREPOSITION": "prep",
    "BASEFORM_POS_PRONOUN": "pro",
    "BASEFORM_POS_PROPERNAME": "name",
    "BASEFORM_POS_VERB": "verb",
    "BASEFORM_POS_PUNCUATION": "punc",
    "BASEFORM_POS_PARTICLE": "part",
    "BASEFORM_POS_INTERROGATIVE": "interrogative",
    "BASEFORM_POS_INTERJECTION": "interjection",
    "BASEFORM_POS_UNKNOWN": "unknown",
    "BASEFORM_POS_QUANTIFIER": "quantifier",
    "BASEFORM_POS_EXISTENTIAL": "exist",
    "BASEFORM_POS_MODAL": "modal",
    "BASEFORM_POS_PREFIX": "prefix",
    "BASEFORM_POS_URL": "url",
    "BASEFORM_POS_JUNK": "junk",
    "BASEFORM_POS_PARTICIPLE": "participle",
    "BASEFORM_POS_COPULA": "copula",
    "BASEFORM_POS_NUMEXP": "num-exp",
    "BASEFORM_POS_TITULAR": "titular",
    "BASEFORM_POS_SHEL_PREP": "prep",
    "BASEFORM_GENDER_MASCULINE": "mas",
    "BASEFORM_GENDER_FEMININE": "fem",
    "BASEFORM_GENDER_MASCULINEFEMININE": "masc/fem",
    "BASEFORM_NUMBER_SINGULAR": "sing",
    "BASEFORM_NUMBER_PLURAL": "plural",
    "BASEFORM_NUMBER_DUAL": "dual",
    "BASEFORM_NUMBER_DUALPLURAL": "dual/plural",
    "BASEFORM_NUMBER_SINGULARPLURAL": "sing/plural",
    "BASEFORM_PERSON_1": "per1",
    "BASEFORM_PERSON_2": "per2",
    "BASEFORM_PERSON_3": "per3",
    "BASEFORM_PERSON_ANY": "per-any",
    "BASEFORM_STATUS_ABSOLUTE": "abs",
    "BASEFORM_STATUS_CONSTRUCT": "const",
    "BASEFORM_STATUS_ABSOLUTECONSTRUCT": "abs-const",
    "BASEFORM_TENSE_PAST": "past",
    "BASEFORM_TENSE_ALLTIME": "all",
    "BASEFORM_TENSE_PRESENT": "pres",
    "BASEFORM_TENSE_FUTURE": "fut",
    "BASEFORM_TENSE_IMPERATIVE": "impr",
    "BASEFORM_TENSE_TOINFINITIVE": "inf",
    "BASEFORM_TENSE_BAREINFINITIVE": "orig",
    "BASEFORM_POLARITY_POSITIVE": "pos",
    "BASEFORM_POLARITY_NEGATIVE": "neg",
    "BASEFORM_BINYAN_PAAL": "paal",
    "BASEFORM_BINYAN_NIFAL": "nifal",
    "BASEFORM_BINYAN_HIFIL": "hifil",
    "BASEFORM_BINYAN_HUFAL": "hufal",
    "BASEFORM_BINYAN_PIEL": "piel",
    "BASEFORM_BINYAN_PUAL": "pual",
    "BASEFORM_BINYAN_HITPAEL": "hitpael",
    "SUFFIX_FUNCTION_POSSESIVEPRONOUN": "poss",
    "SUFFIX_FUNCTION_ACCUSATIVENOMINATIVE": "acc/nom",
    "SUFFIX_FUNCTION_PRONOMIAL": "pro",
    "SUFFIX_GENDER_MASCULINE": "mas",
    "SUFFIX_GENDER_FEMININE": "fem",
    "SUFFIX_GENDER_MASCULINEFEMININE": "masc/fem",
    "SUFFIX_NUMBER_SINGULAR": "sing",
    "SUFFIX_NUMBER_PLURAL": "plural",
    "SUFFIX_NUMBER_DUAL": "dual",
    "SUFFIX_NUMBER_DUALPLURAL": "dual/plural",
    "SUFFIX_NUMBER_SINGULARPLURAL": "sing/plural",
    "SUFFIX_PERSON_1": "per1",
    "SUFFIX_PERSON_2": "per2",
    "SUFFIX_PERSON_3": "per3",
    "SUFFIX_PERSON_ANY": "per-any",
    "BASEFORM_CONJUNCTIONTYPE_COORDINATING": "coord",
    "BASEFORM_CONJUNCTIONTYPE_SUBORDINATING": "subord",
    "BASEFORM_CONJUNCTIONTYPE_RELATIVIZING": "rel",
    "BASEFORM_PRONOUNTYPE_PERSONAL": "per",
    "BASEFORM_PRONOUNTYPE_DEMONSTRATIVE": "dem",
    "BASEFORM_PRONOUNTYPE_IMPERSONAL": "imper",
    "BASEFORM_PRONOUNTYPE_REFLEXIVE": "ref",
    "BASEFORM_NUMBERTYPE_ORDINAL": "ord",
    "BASEFORM_NUMBERTYPE_CARDINAL": "card",
    "BASEFORM_NUMBERTYPE_FRACTIONAL": "frac",
    "BASEFORM_NUMBERTYPE_LITERAL": "lit",
    "BASEFORM_NUMBERTYPE_GEMATRIA": "gem",
    "BASEFORM_NERTYPE_PERSON": "per",
    "BASEFORM_NERTYPE_LOCATION": "loc",
    "BASEFORM_NERTYPE_ORGANIZATION": "org",
    "BASEFORM_NERTYPE_PRODUCT": "prod",
    "BASEFORM_NERTYPE_DATETIME": "time",
    "BASEFORM_NERTYPE_COUNTRY": "country",
    "BASEFORM_NERTYPE_LANGUAGE": "lang",
    "BASEFORM_NERTYPE_COIN": "coin",
    "BASEFORM_NERTYPE_SYMBOL": "sym",
    "BASEFORM_NERTYPE_OTHER": "other",
    "BASEFORM_NERTYPE_TOWN": "town",
    "BASEFORM_PUNCTUATIONTYPE_BRACKETSTART": "brac-start",
    "BASEFORM_PUNCTUATIONTYPE_BRACKETEND": "brac-end",
    "BASEFORM_PUNCTUATIONTYPE_COMMA": "com",
    "BASEFORM_PUNCTUATIONTYPE_DOT": "dot",
    "BASEFORM_PUNCTUATIONTYPE_ARITHMETICOPERATION": "opr",
    "BASEFORM_PUNCTUATIONTYPE_QUOTE": "quote",
    "BASEFORM_PUNCTUATIONTYPE_QUESTION": "que",
    "BASEFORM_PUNCTUATIONTYPE_EXCLAMQATION": "exclamqation",
    "BASEFORM_PUNCTUATIONTYPE_COLON": "col",
    "BASEFORM_PUNCTUATIONTYPE_SEMICOLON": "sem-col",
    "BASEFORM_PUNCTUATIONTYPE_HYPHEN": "hyph",
    "BASEFORM_PUNCTUATIONTYPE_SLASH": "slash",
    "BASEFORM_PUNCTUATIONTYPE_AND": "and",
    "BASEFORM_PUNCTUATIONTYPE_OR": "or",
    "BASEFORM_PUNCTUATIONTYPE_OTHER": "other",
    "BASEFORM_INTERROGATIVETYPE_PRONOUN": "pronoun",
    "BASEFORM_INTERROGATIVETYPE_PROADVERB ": "proadverb",
    "BASEFORM_INTERROGATIVETYPE_PRODET": "prodet",
    "BASEFORM_INTERROGATIVETYPE_YESNO": "yesno",
    "BASEFORM_QUANTIFIERTYPE_AMOUNT": "amount",
    "BASEFORM_QUANTIFIERTYPE_PARTITIVE": "part",
    "BASEFORM_QUANTIFIERTYPE_DETERMINER": "det",
    "BASEFORM_PARTICIPLE_VERB": "verb",
    "BASEFORM_PARTICIPLE_NOUN_ADJ": "noun/adj",
    "BASEFORM_POS_INITIALISM": "init.",
    "BASEFORM_POS_FOREIGN": "foreign"
}

function prettyPrintMorphology(converted) {
    function dictLookup(term) {
        // get rid of leading @
        var morphArray = term.substring(1).split('#');
        // first element might be the lemma if present
        var lemma = morphArray.shift();

        var lemmaPrint = lemma ? lemma + ' - ' : '';
        return lemmaPrint + morphArray.map(
                function(item) { return morphologyIdDict.hasOwnProperty(item) ? morphologyIdDict[item] : item}
            ).join(', ');
    }

    converted = converted.replace(/^@([^ #]*)(#[A-Z0-9_]+)+/g, dictLookup).replace(/_$/, '');
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

jTextMinerApp.factory('ClassService', function ($rootScope) {
    var service = {
        // TODO: remove this, since these colors aren't really used
        colors: ["Red", "Green", "Blue", "FFFF00", "FF00FF", "00FFFF", "Gray"],

        classIndexToColor (index) {
            var realColors = ['#FF931E','#7AC943','#3FA9F5','#FF3833','#FF7BAC'];
            // if we overshoot the array, just return something blueish
            return index >= realColors.length ? "#1111" + (index << 4).toString(16) : realColors[index];
        },

        // accepts either a ClassService object or an array of strings for "classes"
        classNameToColor(name, classes) {
            var index = -1;
            for (var i = 0; i < classes.length; i++) {
                if (classes[i] == name || (typeof(classes[i])!="String" && classes[i].title == name))     {
                    index = i;
                    break;
                }
            }
            return index == -1 ? "#777777" : service.classIndexToColor(index);
        },

        newInstance() {
            return {
                TestSet_unknown_class: [],

                //Corpus
                Corpus_classes: [],
                Corpus_maxId: 0,

                isAllBible: true,
                get newClassName() { return 'Class ' + this.Corpus_maxId; }
            }
        }
    };

    return service;
});
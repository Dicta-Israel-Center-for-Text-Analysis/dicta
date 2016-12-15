var AfterLoginTour = {
    id: "afterLogin-tour",
    steps: [
        {
            title: "Welcome to Dicta!",
            content: "<p>It looks like this is your first time here.</p><p>Dicta gives you different tools for analyzing texts. To use any of the tools, you first need to choose which text you want to analyze. Choose this button to select texts from Dicta's online corpus of text.</p>",
            target: "libraryBtn",
            placement: "top",
            // this zindex puts the tour under ngDialog dialog boxes
            zindex: 9999
        },
        {
            title: "Or, you can upload your own.",
            content: "If you want to analyze your own texts, choose this button, and then you can upload a zip file with your own texts.",
            target: "uploadBtn",
            placement: "top",
            zindex: 9999
        }
    ],
    tourVersion: 1,
    onClose: function(){tiberias_tour_over(AfterLoginTour)},
    onEnd: function(){tiberias_tour_over(AfterLoginTour)}
};
var TabTour = {
    id: "tab-tour",
    tourVersion: 1,
    steps: [{
        title: "Introduction to Dicta Tools",
        content: "<p>This tab shows the texts you just selected.</p>",
        target: "selectedTextTab",
        placement: "bottom",
        zindex: 9999
    },
        {
            title: "Parallels Tab",
            content: "<p>Select this tab to find passages in our current corpus that are similar to passages in the text that you selected.</p>",
            target: "parallelsTab",
            placement: "bottom",
            zindex: 9999
        },
        {
            title: "Classification Tab",
            content: "<p>Select this tab to automatically classify your text according to classes you choose.</p>" +
            "<p>For instance, you can see if your text is more similar to Tosefta or to Mishnah, and see which features of the text make it similar to each.</p>",
            target: "classificationTab",
            placement: "bottom",
            zindex: 9999
        },
        {
            title: "Segmentation Tab",
            content: "<p> If you suspect that your selected text was composed by multiple authors or in multiple styles, select this tab to automatically decompose it into stylistic threads. </p>",
            target: "segmentationTab",
            placement: "bottom",
            zindex: 9999
        }
    ],
    onClose: function(){tiberias_tour_over(TabTour)},
    onEnd: function(){tiberias_tour_over(TabTour)}
};
var ParallelsTour = {
    id: "parallels-tour",
    tourVersion: 1,
    steps: [{
        title: "Finding Parallels",
        content: "<p>Choose which type of parallels you're looking for. \"Longer matches only\" is more likely to show texts with parallel contents, while \"Include shorter matches\" will also include short phrases, which can be useful for identifying borrowed phrases.</p>",
        target: "parallelsControls",
        placement: "right",
        zindex: 9999
    },
        {
            title: "Advanced Controls",
            content: "<p>The advanced controls let you set a minimum number of matching words and a maximum number of unmatched words.</p>",
            target: "parallelsAdvancedControls",
            placement: "right",
            zindex: 9999
        }

    ],
    onClose: function(){tiberias_tour_over(ParallelsTour)},
    onEnd: function(){tiberias_tour_over(ParallelsTour)}
};
var ClassificationTour = {
    id: "Classification-tour",
    tourVersion: 1,
    steps: [{
        title: "Classifying Texts",
        content: "<p>To classify a text, you need to define which classes the algorithm should choose between. Each class is defined by a set of example texts belonging to the class that you choose from our corpus. Use this button to add at least two classes.</p>",
        target: "classificationChooseClass",
        placement: "right",
        zindex: 9999,
        showNextButton: false,
        nextOnTargetClick: true
    },
        {
            title: "Classifying Texts",
            content: "<p>Please choose a second class.</p>",
            target: "classificationChooseClass",
            placement: "right",
            zindex: 9999,
            showNextButton: false,
            nextOnTargetClick: true
        },
        {
            title: "Classifying Texts",
            content: "<p>You can choose additional classes if you like, or you can continue.</p>",
            target: "classificationChooseClass",
            placement: "right",
            zindex: 9999,
            nextOnTargetClick: true
        },
        {
            title: "Algorithm Settings",
            content: "<p>If you are familiar with classification algorithms, you can choose which algorithm to use and modify the settings. If not, you can leave the default settings as is.</p>",
            target: "classificationChooseAlgo",
            placement: "right",
            zindex: 9999
        },
        {
            title: "Feature Set Settings",
            content: "<p>You can choose which features to use to classify the text.</p><p>You can select \"Feature Sets\", which tells the system what type of features to use for classification, such as words or morphology (for those texts that support it).</p><p>You can edit a feature set, choosing to eliminate individual features.</p>",
            target: "classificationChooseFeatureSet",
            placement: "right",
            zindex: 9999
        }

    ],
    onClose: function(){tiberias_tour_over(ClassificationTour)},
    onEnd: function(){tiberias_tour_over(ClassificationTour)}
};
var FeatureSetSelectionTour = {

    id: "featureSetSelection-tour",
    tourVersion: 1,
    steps: [{
        title: "Feature Set Settings",
        content: "<p>Dicta can use several different types of features for classifying texts.</p><br>" +
        "<p>You can choose between using words or letters as features; for some texts, Dicta also supports using morphological and syntactic features. (New types of features are under development.)</p><br>" +
        "<p>Feature types that aren't available can't be selected.</p>",
        target: "featureSetChooseFeatureType",
        placement: "right",
        zindex: 10001
    },
        {
            title: "Feature Set Settings",
            content: "<p>You can define the number of features that will be considered for constructing a classifier. The default is the 250 most common features of the type you selected.</p>",
            target: "featureSetChooseNumber",
            placement: "right",
            zindex: 10001
        },
        {
            title: "Feature Set Settings",
            content: "<p>The model can use each feature in isolation (\"Unigrams\") or use features in sequences of two (\"Bigrams\") or three (\"Trigrams\").</p><br>" +
            "<p>For instance, if the feature type is \"Words\", then Trigrams will use sequences of three words to build the model.</p>",
            target: "featureSetUniBiTrigram",
            placement: "right",
            zindex: 10001
        },
        {
            title: "Feature Set Settings",
            content: "<p>You can choose how a feature is weighted in formally representing a document:</p>" +
            "<ul><li>Binary - is the feature present (1) or not (0).</li></ul>" +
            "<ul><li>Frequency - how frequently does the feature appear in the document.</li></ul>" +
            "<ul><li>Tf-Idf - how frequently does the feature appear in the document and how infrequently in the corpus generally.</li></ul>",
            target: "featureSetFeatureWeight",
            placement: "left",
            zindex: 10001
        },
        {
            title: "Feature Set Settings",
            content: "<p>Click here to see which features are currently selected.</p>",
            target: "featureSetExtractFeatures",
            placement: "top",
            zindex: 10001,
            showNextButton: false,
            nextOnTargetClick: true
        },
        {
            title: "Feature Set Settings",
            content: "<p>This table shows the features found in the texts.</p><br>" +
            "<p>Use the checkboxes to unselect individual features.</p>",
            target: "featureSetFeatureTable",
            placement: "left",
            zindex: 10001,
            delay: 5000
        }
    ],
    onClose: function(){tiberias_tour_over(FeatureSetSelectionTour)},
    onEnd: function(){tiberias_tour_over(FeatureSetSelectionTour)}
};

var SegmentationTour = {
    id: "segmentation-tour",
    tourVersion: 1,
    steps: [{
        title: "Source Criticism",
        content: "<p>Choose the number of stylistic threads into which to decompose your text.</p>",
        target: "segmentationControls",
        placement: "right",
        zindex: 9999
    }

    ],
    onClose: function(){tiberias_tour_over(SegmentationTour)},
    onEnd: function(){tiberias_tour_over(SegmentationTour)}
};

function tiberias_tour_over(tour){
    var tourHash = tiberias_tour_state_object();
    tourHash[tour.id] = tour.tourVersion;
    var cookieString = "";
    for (var tourState in tourHash)
    {
        cookieString += " " + tourState + ":" + tourHash[tourState];
    }
    $.cookie('seenTour', cookieString, { expires: 1825, path: '/' });
}

function tiberias_tour_state_object() {
    var tourHash = {};
    if ($.cookie('seenTour') !== undefined) {
        var tours = $.cookie('seenTour').split(' ');
        for (var i = 0; i < tours.length; i++) {
            var tourPair = tours[i].split(':');
            if (tourPair.length > 1)
                tourHash[tourPair[0]] = +tourPair[1];
        }
    }
    return tourHash;
}

function tiberias_tour(tour) {
    setTimeout(function () {
        var tourHash = tiberias_tour_state_object();
        if (tourHash[tour.id] !== undefined && tourHash[tour.id] == tour.tourVersion) {
            return;
        }
        if (!tour.debounce || Date.now() - tour.debounce > 1000) {
            tour.debounce = Date.now();
            hopscotch.startTour(tour);
        }
    }, 500);
}

function tiberias_tour_pause() {
    if (hopscotch.getState())
        hopscotch.endTour(false, false);
}

jTextMinerApp.run(function($rootScope){
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            if (hopscotch.getState())
                hopscotch.endTour(true, false);
        });
});

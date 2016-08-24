var AfterLoginTour = {
    id: "afterLogin-tour",
    steps: [
        {
            title: "Welcome to Tiberias!",
            content: "<p>It looks like this is your first time here.</p><p>Tiberias gives you different tools for analyzing texts. To use any of the tools, you first need to choose what you want to analyze. Choose this button to select texts from Dicta's online corpus of text.</p>",
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
            title: "Introduction to Tiberias Tools",
            content: "<p>This tab shows the texts you just selected.</p>",
            target: "selectedTextTab",
            placement: "bottom",
            zindex: 9999
        },
        {
            title: "Parallels Tab",
            content: "<p>Select this tab to find texts in our online corpus that are similar to the text that you selected.</p>",
            target: "parallelsTab",
            placement: "bottom",
            zindex: 9999
        },
        {
            title: "Classification Tab",
            content: "<p>Select this tab to automatically classify your text according to classes you choose.</p>" +
            "<p>For instance, you can see if your text is more similar to Talmud Bavli or to Mishnah, and see which features of the text make it similar to each.</p>",
            target: "classificationTab",
            placement: "bottom",
            zindex: 9999
        },
        {
            title: "Segmentation Tab",
            content: "<p>Select this tab to automatically split the text you selected into two or more groups of text. The tool automatically finds features that are only present in parts of the text, and uses those features to classify all the text into the number of groups you choose.</p>" +
            "<p>This is useful if you have a text that you think was composed by multiple authors or in multiple styles, and you want to identify which parts go together with each other.</p>",
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
        content: "<p>Choose which type of parallels you're looking for. \"Longer matches only\" is more likely to show texts with parallel contents, while \"Include shorter matches\" will also include short phrases, which can be useful to identify borrowed phrases.</p>",
        target: "parallelsControls",
        placement: "right",
        zindex: 9999
    },
        {
            title: "Advanced Controls",
            content: "<p>The advanced controls let you set a minimum length for a match and maximum number of words to ignore that don't match within the parallel.</p>",
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
        content: "<p>In order to classify a text, you first need to define which classes the algorithm should choose between. Use this button to add at least two classes.</p>",
        target: "classificationChooseClass",
        placement: "right",
        zindex: 9999
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
            content: "<p>You can choose which features to use to classify the text.</p><p>You can select \"Feature Sets\", which tells the system what type of features to use for classification, such as actual words or morphology (for those texts that support it).</p><p>You can also edit a feature set and tell the system to ignore certain features - for a feature set of words, for instance, you can tell it to ignore specific words.</p>",
            target: "classificationChooseFeatureSet",
            placement: "right",
            zindex: 9999
        }

    ],
    onClose: function(){tiberias_tour_over(ClassificationTour)},
    onEnd: function(){tiberias_tour_over(ClassificationTour)}
};
var SegmentationTour = {
    id: "segmentation-tour",
    tourVersion: 1,
    steps: [{
        title: "Source Criticism",
        content: "<p>This tool allows you to take a text that you suspect has multiple authors or sources and automatically divide it into sections that have features in common with each other. Choose how many different sections to split it into.</p>",
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
    $.cookie('seenTour', cookieString);
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
            // the if is temporary for repeated testing
            if ($.cookie('userLogin').indexOf('o') == -1) return;
        }
        if (!tour.debounce || Date.now() - tour.debounce > 1000) {
            tour.debounce = Date.now();
            hopscotch.startTour(tour);
        }
    }, 500);
}

jTextMinerApp.run(function($rootScope){
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            if (hopscotch.getState())
                hopscotch.endTour(true, false);
        });
});

var AfterLoginTour = {
    id: "afterLogin-tour",
    steps: [
        {
            title: "Welcome to Tiberias!",
            content: "It looks like this is your first time here. Tiberias gives you different tools for analyzing texts. To use any of the tools, you first need to choose what you want to analyze. Choose this button to select texts from Dicta's online corpus of text.",
            target: "libraryBtn",
            placement: "top",
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
    onClose: function(){$.cookie('seenAfterLoginTour', 1)},
    onEnd: function(){$.cookie('seenAfterLoginTour', 1)}
};
jTextMinerApp.component('bibleMainPage',
{
    templateUrl: 'Components/PageStructure/bibleMainPage.component.html',
    controller: ['UserService', '$location', 'SelectClassService', 'search', '$state',
        function(UserService, $location, SelectClassService, search, $state) {
            if (!UserService.isLoggedIn()) {
                // $location.path('Login');
            }
            if (!SelectClassService.testText)
                $state.go('bibleFrontpage');
            const ctrl = this;
            ctrl.$state = $state;
            ctrl.tab = 'search';
            ctrl.textChosen = false;
            ctrl.showChooseText = true;

            ctrl.saveText = function (selectionData) {
                SelectClassService.setTestText(selectionData);
                ctrl.textChosen = true;
                ctrl.selectedText = SelectClassService.testText;
                ctrl.showChooseText = false;
            };
            ctrl.runSearch = function (query) {
                ctrl.tab = 'search';
                search.query = query;
                search.search();
            }
            ctrl.classify = function () {
                ctrl.tab = 'classify';
            }
            ctrl.segment = function () {
                ctrl.tab = 'segment';
            }
            ctrl.getSelection = function () {
                return SelectClassService.summarizeText(SelectClassService.testText);
            }
        }]
}); 
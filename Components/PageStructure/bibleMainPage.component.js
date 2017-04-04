jTextMinerApp.component('bibleMainPage',
{
    templateUrl: 'Components/PageStructure/bibleMainPage.component.html',
    controller: ['UserService', '$location', 'SelectClassService',
        function(UserService, $location, SelectClassService) {
            if (!UserService.isLoggedIn()) {
                $location.path('Login');
            }
            const ctrl = this;
            ctrl.tab = 'search';
            ctrl.textChosen = false;
            ctrl.showChooseText = true;

            ctrl.active = function (tab) {
                return ctrl.tab == tab ? 'active' : '';
            };
            ctrl.saveText = function (selectionData) {
                SelectClassService.setTestText(selectionData);
                ctrl.textChosen = true;
                ctrl.selectedText = SelectClassService.testText;
                ctrl.showChooseText = false;
            };
        }]
}); 
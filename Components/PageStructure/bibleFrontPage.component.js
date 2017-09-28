jTextMinerApp.component('bibleFrontPage',
{
    templateUrl: 'Components/PageStructure/bibleFrontPage.component.html',
    controller: function($state, search, DialogService, SelectClassService, UserService) {
            const ctrl = this;

            ctrl.runSearch = function () {
                search.query = ctrl.searchQuery;
                $state.go('search');
            };

            ctrl.showLibrary = function () {
                DialogService.openDialog('chooseTextDialog',
                    { saveMessage: 'Select as test text' })
                    .then(ctrl.saveClass);
            };

            ctrl.saveClass = function (selectClass) {
                SelectClassService.setTestText(selectClass);
                $state.go('bibleInterface.view');
            };

            ctrl.signOut = function () {
                UserService.logout();
            };

            ctrl.UserService = UserService;

            ctrl.savedSelections = UserService.savedSelections;
            ctrl.recentSelections = UserService.recentSelections;
        }
}); 
jTextMinerApp.component('bibleFrontPage',
{
    templateUrl: 'Components/PageStructure/bibleFrontPage.component.html',
    controller: function($state, DialogService, SelectClassService, UserService, StateService) {
            const ctrl = this;

            StateService.frontPageState = 'bibleFrontpage';

            ctrl.runSearch = function () {
                $state.go('search.terms', {terms: ctrl.searchQuery, page: '1'});
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
jTextMinerApp.component('bibleFrontPage',
{
    templateUrl: 'Components/PageStructure/bibleFrontPage.component.html',
    controller: [ '$state', 'search', 'ngDialog', '$scope', 'SelectClassService', 'UserService',
        function($state, search, ngDialog, $scope, SelectClassService, UserService) {
            const ctrl = this;

            ctrl.runSearch = function () {
                search.query = ctrl.searchQuery;
                $state.go('search');
            };

            ctrl.showLibrary = function () {
                ngDialog.openConfirm({
                    plain: true,
                    scope: $scope,
                    template: '<choose-text-dialog ' +
                    'on-confirm="$ctrl.saveClass(selectionData);confirm()" ' +
                    'on-cancel="cancelClass();confirm()" ' +
                    'save-message="\'Select as test text\'"' + '>' +
                    '</choose-text-dialog>'
                });
            };

            ctrl.saveClass = function (selectClass) {
                SelectClassService.testText = selectClass;
                $state.go('bibleInterface');
            };

            ctrl.savedSelections = UserService.savedSelections;
            ctrl.recentSelections = UserService.recentSelections;
        }]
}); 
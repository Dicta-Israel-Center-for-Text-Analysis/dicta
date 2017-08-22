jTextMinerApp.component('bibleFrontPage',
{
    templateUrl: 'Components/PageStructure/bibleFrontPage.component.html',
    controller: [ '$state', 'search', 'ngDialog', '$scope', 'SelectClassService',
        function($state, search, ngDialog, $scope, SelectClassService) {
            const ctrl = this;
            //$state.go('bible-main');
            ctrl.runSearch = function () {
                search.query = ctrl.searchQuery;
                $state.go('search');
            }

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
            }

            ctrl.saveClass = function (stuff) {
                SelectClassService.testText = stuff;
                $state.go('bibleInterface');
            }
        }]
}); 
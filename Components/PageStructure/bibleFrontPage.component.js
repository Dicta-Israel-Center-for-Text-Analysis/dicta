jTextMinerApp.component('bibleFrontPage',
{
    templateUrl: 'Components/PageStructure/bibleFrontPage.component.html',
    controller: [ '$state', 'search', 'ngDialog',
        function($state, search, ngDialog) {
            const ctrl = this;
            //$state.go('bible-main');
            ctrl.runSearch = function () {
                search.query = ctrl.searchQuery;
                $state.go('search');
            }

            ctrl.showLibrary = function () {
                ngDialog.openConfirm({
                    plain: true,
                    template: '<choose-text-dialog ' +
                    'on-confirm="saveClass(selectionData);confirm()" ' +
                    'on-cancel="cancelClass();confirm()" ' +
                    'save-message="\'Select as test text\'"' + '>' +
                    '</choose-text-dialog>'
                });
            }
        }]
}); 
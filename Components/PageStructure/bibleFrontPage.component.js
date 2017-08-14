jTextMinerApp.component('bibleFrontPage',
{
    templateUrl: 'Components/PageStructure/bibleFrontPage.component.html',
    controller: [ '$state', 'search',
        function($state, search) {
            const ctrl = this;
            //$state.go('bible-main');
            ctrl.runSearch = function () {
                search.query = ctrl.searchQuery;
                $state.go('search');
            }
        }]
}); 
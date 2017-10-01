jTextMinerApp.component('searchFrontPage',
{
    templateUrl: 'Components/Search/searchFrontPage.component.html',
    controller: function($state, search) {
        const ctrl = this;

        ctrl.runSearch = function () {
            search.query = ctrl.searchQuery;
            $state.go('search');
        };
    }
}); 
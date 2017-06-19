jTextMinerApp.component('chunkBar',
{
    bindings: {
        chunks: '<'
    },
    templateUrl: 'Components/Shared/chunkBar.component.html',
    controller: [
        function() {
            const ctrl = this;

            ctrl.calculateChunkHeight = function (chunk) {
                const total = _.sumBy(ctrl.chunks, chunk => chunk.text.length);
                // doesn't recalculate on resize
                const viewHeight = document.documentElement.clientHeight;
                const extraHeight = viewHeight - 1 - ctrl.chunks.length*9;
                return (extraHeight * (chunk.text.length / total) + 9)*100/viewHeight;
            };

            ctrl.createThumbnail = function (chunk) {
               return _.repeat('\u3030\u200b', chunk.text.length / 200);
            };

            ctrl.scrollTo = function (index) {
                window.scrollTo(0, $("#section" + index)[0].offsetTop - 100);
            };

        }]
}); 
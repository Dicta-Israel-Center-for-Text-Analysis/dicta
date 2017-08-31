jTextMinerApp.component('parallels',
{
    templateUrl: 'Components/Parallels/parallels.component.html',
    controller: function (ParallelsService) {
            var ctrl = this;
            ctrl.experiment = ParallelsService.newInstance();
        }
});
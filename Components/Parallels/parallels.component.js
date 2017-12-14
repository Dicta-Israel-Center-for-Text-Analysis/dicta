jTextMinerApp.component('parallels',
{
    templateUrl: 'Components/Parallels/parallels.component.html',
    controller: function (ParallelsService, DialogService, SelectClassService) {
        var ctrl = this;
        ctrl.experiment = ParallelsService.newInstance();

        // this section should probably be unified with bibleMainPage
        ctrl.editSelectedText = function () {
            DialogService.openDialog('chooseTextDialog',
                {
                    saveMessage: 'Select as test text'
                })
                .then(ctrl.saveClass);
        };
        ctrl.saveClass = function (selectClass) {
            SelectClassService.setTestText(selectClass);
        };
        ctrl.getSelection = function () {
            return SelectClassService.testText? SelectClassService.testText.title : null;
        };
        ctrl.getSubtitle = function () {
            return SelectClassService.testText ? SelectClassService.testText.subtitle : null;
        }
    }
});
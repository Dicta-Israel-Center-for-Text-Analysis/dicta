jTextMinerApp.component('segmentationControls',
{
    templateUrl: 'Components/Segmentation/segmentationControls.component.html',
    controller:
        function(StateService, SegmentationService) {
            const ctrl = this;
            ctrl.experiment = StateService.getOrCreate('segmentation', SegmentationService.newExperiment);
        }
}); 
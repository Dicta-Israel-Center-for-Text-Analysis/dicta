jTextMinerApp.component('classificationWizard',
{
    bindings: {
        onCancel: '&',
        onConfirm: '&',
        $transition$: '<'
    },
    templateUrl: 'Components/Classification/classificationWizard.component.html',
    controller: function(StateService, ClassificationService, $state, SelectClassService, $transitions) {
        const ctrl = this;
        ctrl.experiment = StateService.getOrCreate('classificationExperiment', () => ClassificationService.newExperiment());

        ctrl.step = 0;
        ctrl.stepHeadings = ['Select the text you\'d like to classify']
            .concat(['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']
                .map(word => 'Select the ' + word + ' text class'))
            .concat(['Unsupported']);
        function setHeading() {
            ctrl.stepHeading = ctrl.stepHeadings[ctrl.step];
            ctrl.explanation = {
                component: 'wizardHelpText',
                parameters: {
                    step: ctrl.step
                }
            };
        }
        setHeading();

        // callback from ui-router when the params change but the state is otherwise the same
        // apparently, it just needs to be set; there's no need to register the callback anywhere
        ctrl.uiOnParamsChanged = function(newParams) {
            ctrl.step = +newParams.step;
            if (ctrl.step > ctrl.experiment.classes.Corpus_classes.length + 1)
                $state.go('.',{ step: ctrl.experiment.classes.Corpus_classes.length + 1 });
            setHeading();
        };

        ctrl.cancelOnRetain = $transitions.onRetain({retained: 'classificationStart.wizard'}, function(transition) {
            ctrl.uiOnParamsChanged(transition.params());
        })

        ctrl.cancelOnExit = $transitions.onExit({}, function() {
            ctrl.cancelOnRetain();
            ctrl.cancelOnExit();
        })

        ctrl.uiOnParamsChanged(ctrl.$transition$.params());

        ctrl.back = function () {
            ctrl.step--;
            setHeading();
            $state.go('.',{ step: ctrl.step });
        };

        ctrl.nextStep = function () {
            ctrl.step++;
            setHeading();
            $state.go('.',{ step: ctrl.step });
        };

        ctrl.runExperiment = function () {
            ctrl.onConfirm();
            $state.go('bibleInterface.classify');
            ctrl.experiment.runClassification();
        };

        ctrl.saveText = function (text) {
            SelectClassService.setTestText(text);
        };

        ctrl.saveClass = function (classNum, classData) {
            if (classNum + 1 > ctrl.experiment.classes.Corpus_classes.length)
                ctrl.experiment.addClass(classData);
            else
                ctrl.experiment.updateClass(classNum, classData);
        };

        ctrl.getText = function () {
            return SelectClassService.testText;
        };

        ctrl.getClass = function (index) {
            if (index < ctrl.experiment.classes.Corpus_classes.length)
                return ctrl.experiment.classes.Corpus_classes[index].text;
        }
    }
}); 
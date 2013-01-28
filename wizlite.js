/**
 * Created with JetBrains WebStorm.
 * User: mikhail.shevchuk
 * Date: 22.01.13
 * Time: 17:03
 * To change this template use File | Settings | File Templates.
 */

function Wiz(config)
{
    this.config = config || {};

    this.configSteps = this.config.steps;
    this.steps = [];
    this.stepHistory = [];

    this.currentStep;
    this.storage = new WizStorage();
}

Wiz.prototype = {
    toString: function () {
        return 'UnnamedWizard';
    },
    start: function() {
        var self = this;

        buildSteps();

        function buildSteps() {
            var steps = Object.keys(self.configSteps);

            for (var key in steps) {
                self.steps.push(steps[key]);
            }

            function findFirstStep(steps) {
                for (var stepName in steps) {
                    if (steps[stepName].first) {
                        return steps[stepName].step;
                    }
                }
            }

            // stores current step reference
            self.currentStep = findFirstStep(self.configSteps);
        }
    },
    next: function() {
        var self = this;

        var prevStep = this.getCurrentStep();
        var stepResult = {};

        if (prevStep.getResult) {
            stepResult = prevStep.getResult();
        }

        this.storage.updateStorage(stepResult);

        this.currentStep = getNextStep();

        this.currentStep.onStart && this.currentStep.onStart(this.getStorage());

        this.addStepToHistory(prevStep);

        this.onStepChange(this.currentStep);

        function getNextStep() {
            if (!self.configSteps[self.getNextStepName()])
            {
                return false;
            } else
            {
                return self.configSteps[self.getNextStepName()].step;
            }
        }
    },
    getNextStepName : function() {
        for (var stepName in this.configSteps) {
            if (this.getCurrentStep().name == this.configSteps[stepName].step.name) {
                if (this.configSteps[stepName].onNext)
                    return this.configSteps[stepName].onNext();
            }
        }
    },
    back: function() {
        this.currentStep = this.getPreviousStep();
        this.onStepChange(this.currentStep);
    },
    getAvailableMoves: function() {
        var next = !!this.getNextStepName();
        var back = !!this.stepHistory.length;
        return {
            next: next,
            back: back
        };
    },
    onStepChange: function() {

    },
    getStorage: function() {
        return this.storage.getStorage();
    },
    updateStorage: function(data) {
        this.storage.updateStorage(data);
    },
    addStepToHistory: function(step) {
        this.stepHistory.push(step);
    },
    getCurrentStep : function() {
        return this.currentStep;
    },
    getPreviousStep: function() {
        return this.stepHistory.pop();
    }
}

function WizStorage() {
    this.storage = {}
}

WizStorage.prototype = {
    updateStorage: function(data) {
        this.storage = extend(data, this.storage);

        function extend(src, dst) {
            for (var k in src) {
                if (src.hasOwnProperty(k)) {
                    dst[k] = src[k];
                }
            }
            return dst;
        };
    },
    getStorage: function() {
        return this.storage;
    }

};


function WizStep(config)
{
    this.config = config || {};

    this.name = this.config.name || 'Unnamed';
    this.getResult = this.config.onDone;
    this.onStart = this.config.onStart;
}

WizStep.prototype = {
    toString:function() {
        return 'UnnamedWizardStep';
    }
}

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
        var stepResult = prevStep.getResult();

        this.storage.updateStorage(stepResult);

        this.currentStep = getNextStep();

        function getNextStep() {
            for (var stepName in self.configSteps) {
                if (self.getCurrentStep().name == self.configSteps[stepName].step.name) {
                    return self.configSteps[stepName].onNext();
                }
            }
        }

    },
    getStorage: function() {
        return this.storage.getStorage();
    },
    getCurrentStep : function() {
        return this.currentStep;
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
}

WizStep.prototype = {
    toString:function() {
        return 'UnnamedWizardStep';
    }
}

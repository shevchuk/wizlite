/**
 * Created with JetBrains WebStorm.
 * User: mikhail.shevchuk
 * Date: 22.01.13
 * Time: 17:03
 * To change this template use File | Settings | File Templates.
 */

function Wiz(config)
{
    var self = this;
    this.config = config || {};

    this.steps = this.config.steps;

    buildSteps();

    function buildSteps() {
        var steps = Object.keys(self.steps);
        for (var i = 0; i < steps.length; i++) {
        }
    }
}

Wiz.prototype = {
    toString: function () {
        return 'UnnamedWizard';
    },
    start: function() {

    },
    next: function() {

    },
    getCurrentStep : function() {
        return 'step1';
    }
}


function WizStep(config)
{
    this.config = config || {};

    this.name = this.config.name || 'Unnamed';

}

WizStep.prototype = {
    toString:function() {
        return 'UnnamedWizardStep';
    }
}

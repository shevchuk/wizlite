window.addEvent('domready', function(){
    buildForm();
});

function buildForm() {
    var wizard = makeWizard();
    wizard.start();

    updateStepForm(wizard);    // first step

    wizard.onStepChange = function (newStep) {
        updateStepForm(wizard);
    };

    var toolbar = makeToolbar(wizard.next.bind(wizard), wizard.back.bind(wizard));
    $('toolbar').adopt(toolbar);
}

function makeWizard() {
    var selectDeviceStep    = makeSelectDeviceStep();
    var polycomPlanStep     = makePolycomPlanStep();
    var linksysPlanStep     = makeLinkSysStep();
    var e911FormStep        = makeE911FormStep();
    var e911oocStep         = makeE911OOCStep();
    var summaryStep         = makeSummaryStep();

    var w = new Wiz({
        name: 'dl',
        steps: {
            selectDevice: {
                first: true,
                step: selectDeviceStep,
                onNext: function() {
                    if (isPolycomSelected()) {return 'polycomPlan';}
                    if (isLinkSysSelected()) {return 'linksysPlan';}
                    if (isCiscoSelected()) {
                        chooseFreePlan();
                        return 'e911Form';
                    }
                }
            },
            polycomPlan: {
                step: polycomPlanStep,
                onNext: function() {return 'e911Form';}
            },
            linksysPlan: {
                step: linksysPlanStep,
                onNext: function() {return 'e911Form';}
            },
            e911Form: {
                step: e911FormStep,
                onNext: function() {return 'e911ooc';}
            },
            e911ooc: {
                step: e911oocStep,
                onNext: function() {return 'summary';}
            },
            summary: {
                step: summaryStep,
                final: true
            }

        }
    });

    return w;

    function chooseFreePlan() {
        w.updateStorage({plan: 'free'});
    }

    function isPolycomSelected() {
        return (w.getStorage().device == 0)?true:false;
    }

    function isLinkSysSelected() {
        return (w.getStorage().device == 1)?true:false;
    }

    function isCiscoSelected() {
        return (w.getStorage().device == 2)?true:false;
    }
}

function updateStepForm(wizard) {
    $('form').empty().adopt(wizard.getCurrentStep());
}


function makeSummaryStep() {
    var ws = new WizStep({
        name: 'summaryStep'
    });

    var div = new Element('div', {
        'html' : '<h4>Summary</h4>'
    });

    extend(ws, div);

    return div;
}

function makeE911OOCStep() {
    return createE911Step('OOC');
}

function makeE911FormStep() {
    return createE911Step('Form');
}

function makeSelectDeviceStep() {
    var combo = createDeviceCombo();

    var ws = new WizStep({
        name: 'selectDeviceStep',
        onDone: function() {
            return {device: combo.getSelected().get('value')[0]};
        }
    });

    var div = new Element('div', {
        'id' : 'selectDeviceStepDiv'
    });

    combo.inject(div);

    extend(ws, div);

    return div;
}

function makeLinkSysStep() {
    return createPlanDisplay('LinkSys');
}

function makePolycomPlanStep() {
    return createPlanDisplay('Polycom');
}


// helpers
function createPlanDisplay(text) {
    var ws = new WizStep({
        name: text+'step'
    });

    var div = new Element('div', {
        'html' : '<h5>' + text + ' plan display<h5/>'
    });

    extend(ws, div);

    return div;
}

function createE911Step(stepName) {
    var ws = new WizStep({
        name: stepName+'E911step'
    });


    var div = new Element('div', {
        'html' : '<h5>E911: ' + stepName + '<h5/>'
    });

    extend(ws, div);
    return div;
}
function createDeviceCombo() {
    var combo = new Element('select');

    var createComboItem = createOption();

    combo.adopt(createComboItem('Polycom'),
                createComboItem('LinkSys'),
                createComboItem('Cisco'));

    function createOption() {
        var optionIdx = 0;

        var createOptionElement = function (name) {
            var item = new Option(name, optionIdx);
            optionIdx ++ ;
            return item;
        };

        return createOptionElement;
    }

    return combo;
}

function makeToolbar(onNext, onBack) {
    var div = new Element('div');
    var back = new Element('button', {
        id: 'backButton',
        text: 'Back',
        events: {
            'click' : function() {
                onBack();
            }
        }
    });

    var next = new Element('button', {
        id: 'nextButton',
        text: 'Next',
        events: {
            'click' : function() {
                onNext();
            }
        }
    });


    div.adopt(back);
    div.adopt(next);
    return div;
}

function extend(src, dst) {
    for (var k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
};


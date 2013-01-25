window.addEvent('domready', function(){
    makeWizard();
});

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

    w.start();
    w.next();

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



function makeSummaryStep() {
    var div = new Element('div', {
        'html' : '<h4>Summary</h4>'
    });

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
    var div = new Element('div', {
        'html' : '<h5>' + text + ' plan display<h5/>'
    });

    return div;
}

function createE911Step(stepName) {
    var div = new Element('div', {
        'html' : '<h5>E911: ' + stepName + '<h5/>'
    });

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

function makeToolbar() {
    var back = new Element('button', {
        text: 'Back',
        events: {

        }
    });
}

function extend(src, dst) {
    for (var k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
};


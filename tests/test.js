/**
 * Created with JetBrains WebStorm.
 * User: mikhail.shevchuk
 * Date: 22.01.13
 * Time: 17:04
 * To change this template use File | Settings | File Templates.
 */
module("wizlite");


function createJohnWizard() {
    function createAddUserStep() {
        return new WizStep({
            name: 'addUserStep',
            onStart: function(data) {
            },
            onDone: function() {
                return {firstName: 'John'};
            }
        });
    }

    function createJohnStep() {
        return new WizStep({
            name: 'johnStep',
            onStart: function(data) {
                deepEqual({firstName: 'John'}, data);
            }
        });
    }

    // helpers
    function isJohnEntered() {
        return w.getStorage().firstName == 'John';

    };

    var w = new Wiz({
        name: 'wiz',
        steps: {
            addUser: {
                first: true,
                step: createAddUserStep(),
                onNext: function() {
                    if (isJohnEntered()) {return 'johnWelcome'};
                }
            },
            johnWelcome: {
                step: createJohnStep(),
                onNext: function() {

                }
            }
        }
    });

    return w;
}

test("Simple add user wiz test", function () {
    var w = createJohnWizard();

    w.start();

    equal(w.getCurrentStep().name, 'addUserStep', 'Check that first step is the first');
    w.next();

    equal(w.getStorage().firstName, 'John', 'Check that storage is correctly populated');
    equal(w.getCurrentStep().name, 'johnStep', 'Check that wizard goes to john step');
    w.back();

    equal(w.getCurrentStep().name, 'addUserStep', 'Check that back function works')
});

test('getAvailableMoves test', function() {
    var selectDeviceStep = new WizStep({
        name: 'selectDeviceStep',
        onDone: function() {
            return {device: 'Polycom'};
        }
    });

    var w = new Wiz({
        name: 'dl',
        steps: {
            selectDevice: {
                first: true,
                step: selectDeviceStep,
                onNext: function() {
                    return 'selectDevice'; // loop the cycle
                }
            }
        }
    });

    w.start();

    deepEqual(w.getAvailableMoves(), {back: false, next: true}, 'Check available moves test');
    equal(w.getCurrentStep().name, 'selectDeviceStep', 'Check that first step is the first');

    w.next();
    deepEqual(w.getAvailableMoves(), {back: true, next: true}, 'Check available moves test after next');
    w.back();
    deepEqual(w.getAvailableMoves(), {back: false, next: true}, 'Check available moves test after back');
});

test('onStepChange test', function() {
    var w = createJohnWizard();

    w.start();
    equal(w.getCurrentStep().name, 'addUserStep', 'Check that first step is the first');
    w.onStepChange = function(newStep) {
        equal(newStep.name, 'johnStep', 'onStepChanged correct arg');
    }
    w.next();
    w.onStepChange = function(newStep) {
        equal(newStep.name, 'addUserStep', 'onStepChanged correct arg');
    }
    w.back();
    w.onStepChange = function(newStep) {}
    w.next();
    w.next();
    w.next();
});
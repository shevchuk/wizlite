/**
 * Created with JetBrains WebStorm.
 * User: mikhail.shevchuk
 * Date: 22.01.13
 * Time: 17:04
 * To change this template use File | Settings | File Templates.
 */
module("wizlite");

test("Simple add user wiz test", function () {
    var addUserStep = new WizStep({
        name: 'addUserStep',
        onStart: function(data) {
        },
        onDone: function() {
            return {firstName: 'John'};
        }
    });

    equal(addUserStep.name, 'addUserStep', 'Check that name for add user step was correctly assigned');

    var johnStep = new WizStep({
        name: 'johnStep',
        onStart: function(data) {
            deepEqual({firstName: 'John'}, data);
        }
    });

    // helpers
    function isJohnEntered() {
        return w.getStorage().firstName == 'John';

    };

    var w = new Wiz({
        name: 'wiz',
        steps: {
            addUser: {
                first: true,
                step: addUserStep,
                onNext: function() {
                    if (isJohnEntered()) {return 'johnWelcome'};
                }
            },
            johnWelcome: {
                step: johnStep,
                onNext: function() {

                }
            }
        }
    });

    w.start();

    equal(w.getCurrentStep().name, 'addUserStep', 'Check that first step is the first');
    w.next();

    equal(w.getStorage().firstName, 'John', 'Check that storage is correctly populated');
    equal(w.getCurrentStep().name, 'johnStep', 'Check that wizard goes to john step');
    w.back();

    equal(w.getCurrentStep().name, 'addUserStep', 'Check that back function works')
});

test('DL wiz test', function() {
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
                step: selectDeviceStep
            }
        }
    });

    w.start();
    equal(w.getCurrentStep().name, 'selectDeviceStep', 'Check that first step is the first');
});
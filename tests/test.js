/**
 * Created with JetBrains WebStorm.
 * User: mikhail.shevchuk
 * Date: 22.01.13
 * Time: 17:04
 * To change this template use File | Settings | File Templates.
 */
module("wizlite");

test("Simple add user wiz test (2 sequential steps)", function () {
    var addUserStep = new WizStep({
        name: 'addUserStep',
        onEnter: function(data) {

        },
        onDone: function() {
            return {firstName: 'John'};
        },
        onBack: function() {

        },
        onCancel: function() {

        }
    });

    equal(addUserStep.name, 'addUserStep', 'Check that name for add user step was correctly assigned')

    var johnStep = new WizStep({
        onEnter: function(data) {

        }
    });

    // helpers
    function isJohnEntered() {
        return w.storage.firstName == 'John';

    };


    var w = new Wiz({
        name: 'wiz',
        steps: {
            addUser: {
                step: addUserStep,
                onNext: function() {
                    if (isJohnEntered()) {w.goTo('johnWelcome')};
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


});
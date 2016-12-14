jTextMinerApp.component('loginDialog',
{
    templateUrl: 'Components/AppDialogs/loginDialog.component.html',
    bindings: {
        onConfirm: '&',
        onCancel: '&'
    },
    controller: function (UserService) {
        var ctrl = this;
        ctrl.userLogin = '';
        ctrl.onError = false;
        ctrl.Login = function () {

            if (ctrl.userLogin.length == 0) {
                ctrl.onError = true;
                ctrl.errorMsg = 'Please type your user name.';
            }
            else {
                ctrl.onError = false;
                UserService.tryLogin(ctrl.userLogin)
                    .then(function () {
                        ctrl.onConfirm();
                    })
                    .catch(function() {
                        ctrl.onError = true;
                        ctrl.errorMsg = 'Login error. Please try again.';
                    });
            }
        };
    }
});
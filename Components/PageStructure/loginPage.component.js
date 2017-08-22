jTextMinerApp.component('loginPage',
{
    templateUrl:'Components/PageStructure/loginPage.component.html',
    controller: function (ngDialog, UserService, $state) {
        this.showSignUp = false;

        this.LoginDlg = function () {
            ngDialog.openConfirm({
                template: '<login-dialog on-confirm="confirm()" on-cancel="closeThisDialog()"></login-dialog>',
                plain: true,
                className: 'ngdialog-theme-default',
                closeByEscape: true,
                closeByDocument: true
            }).then(function (value) {
                // successful login
                $state.go('AfterLogin');
            });
        };

        this.guestLogin = function () {
            UserService.tryLogin("testuser")
                .then(function () {
                    $state.go('AfterLogin');
                })
        }

        this.guestBibleLogin = function () {
            UserService.tryLogin("testuser", true)
                .then(function () {
                    $state.go('bibleFrontpage');
                })
        }

        var cookieUsername = $.cookie('userLogin');
        if (cookieUsername != null) {
            UserService.tryLogin(cookieUsername)
                .then(function () {
                    $state.go('AfterLogin');
                });
        }
    }
});
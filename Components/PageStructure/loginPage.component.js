jTextMinerApp.component('loginPage',
{
    templateUrl:'Components/PageStructure/loginPage.component.html',
    controller: function (ngDialog, UserService, $location) {
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
                $location.path('AfterLogin');
            });
        };

        this.guestLogin = function () {
            UserService.tryLogin("testuser")
                .then(function () {
                    $location.path('AfterLogin');
                })
        }

        var cookieUsername = $.cookie('userLogin');
        if (cookieUsername != null) {
            UserService.tryLogin(cookieUsername)
                .then(function () {
                    $location.path('AfterLogin');
                });
        }
    }
});
angular.module('mainController', ['authServices', 'userServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $interval, $window, $route, User, AuthToken) {
        var app = this;

        app.loadme = false;

        app.checkSession = function () {
            if (Auth.isLoggedIn()) {
                app.checkingSession = true;
                var interval = $interval(function () {
                    var token = $window.localStorage.getItem('token');
                    if (token == null) {
                        $interval.cancel(interval);
                    } else {
                        self.parseJWT = function (token) {  //function parseJWT web
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('.', '+').replace('_', '/');
                            return JSON.parse($window.atob(base64));
                        }
                        var expireTime = self.parseJWT(token);
                        var timeStamp = Math.floor(Date.now() / 1000);
                        var timeCheck = expireTime.exp - timeStamp;
                        if (timeCheck <= 25) {
                            console.log('token has expired');
                            showModal(1);
                            $interval.cancel(interval);
                        }
                    }
                }, 2000);
            }
        };

        app.checkSession();

        var showModal = function (option) {
            app.choiceMade = false;
            app.modalHeader = undefined;
            app.modalBody = undefined;
            app.hideButton = false;


            if (option === 1) {
                app.modalHeader = 'Timeout Warning';
                app.modalBody = 'Your session will expire in 5 minutes. Would you like to renew your session?';
                $("#myModal").modal({ backdrop: "static" });
            } else if (option === 2) {
                app.hideButton = true;
                app.modalHeader = 'Logging Out';
                $("#myModal").modal({ backdrop: "static" });
                $timeout(function () {
                    Auth.logout();
                    $location.path('/login');
                    hideModal();
                    $route.reload();
                }, 2000);
            }
            $timeout(function () {
                if (!app.choiceMade) {
                    hideModal();
                }
            }, 4000);
        };

        app.renewSession = function () {
            app.choiceMade = true;
            User.renewSession(app.username).then(function (data) {
                if (data.data.success) {
                    AuthToken.setToken(data.data.token);
                    app.checkSession();
                } else {
                    app.modalBody = data.data.message;
                }
            });
            hideModal();
        };

        app.endSession = function () {
            app.choiceMade = true;
            hideModal();
            $timeout(function () {
                showModal(2);
            }, 1000);
        };

        var hideModal = function () {
            $("#myModal").modal('hide');
        }

        $rootScope.$on('$routeChangeStart', function () {

            if (!app.checkSession) app.checkSession();

            // Check if user is logged in
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    app.useremail = data.data.email;

                    User.getPermission().then(function (data) {
                        if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                            app.authorized = true;
                            app.loadme = true;
                        } else {
                            app.loadme = true;
                        }
                    });
                });
            } else {
                app.isLoggedIn = false;
                app.username = '';
                app.loadme = true;
            }
            if ($location.hash() == '_=_') $location.hash(null);

        });

        this.doLogin = function (loginData) {
            app.loading = true;
            app.errorMsg = false;

            Auth.login(app.loginData).then(function (data) {
                if (data.data.success) {
                    app.loading = false;
                    // Create Success Message
                    app.successMsg = data.data.message + '...Redirecting';
                    // Redirect to Home Page
                    $timeout(function () {
                        $location.path('/registru');
                        app.loginData = '';
                        app.successMsg = '';
                        app.checkSession();
                    }, 2000);
                } else {
                    // Create Error Message
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };

        app.logout = function () {
            showModal(2);
        };

    });




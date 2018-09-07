angular.module('mainController', ['authServices', 'userServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $interval, $window, $route, User, AuthToken, $scope) {
        var app = this;

        app.loadme = false;

        // app.checkSession = function () {
        //     if (Auth.isLoggedIn()) {
        //         app.checkingSession = true;
        //         var interval = $interval(function () {
        //             var token = $window.localStorage.getItem('token');
        //             if (token == null) {
        //                 $interval.cancel(interval);
        //             } else {
        //                 self.parseJWT = function (token) {
        //                     var base64Url = token.split('.')[1];
        //                     var base64 = base64Url.replace('.', '+').replace('_', '/');
        //                     return JSON.parse($window.atob(base64));
        //                 }
        //                 var expireTime = self.parseJWT(token);
        //                 var timeStamp = Math.floor(Date.now() / 1000);
        //                 var timeCheck = expireTime.exp - timeStamp;
        //                 if (timeCheck <= 25) {
        //                     console.log('token-ul a expirat');
        //                     $interval.cancel(interval);
        //                 }
        //             }
        //         }, 86400);
        //     }
        // };

        // app.checkSession();

        var exit = function (option) {
            app.choiceMade = false;
            app.hideButton = false;


            ($timeout(function () {
                Auth.logout();
                $location.path('/login');
                $route.reload();
            }, 1000)
            )
        };


        app.renewSession = function () {
            app.choiceMade = true;
            User.renewSession(app.username).then(function (data) {
                if (data.data.success) {
                    AuthToken.setToken(data.data.token);
                    // app.checkSession();
                } else {
                    app.modalBody = data.data.message;
                }
            });
        };

        // app.endSession = function () {
        //     app.choiceMade = true;
        //     hideModal();
        //     $timeout(function () {
        //         showModal(2);
        //     }, 1000);
        // };

        // var hideModal = function () {
        //     $("#myModal").modal('hide');
        // }

        $rootScope.$on('$routeChangeStart', function () {

            // if (!app.checkSession) app.checkSession();


            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    app.useremail = data.data.email;

                    User.getPermission().then(function (data) {
                        if (data.data.permission === 'admin') {
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

                    app.successMsg = data.data.message + '...Se incarca';

                    $timeout(function () {
                        $location.path('/registru');
                        app.loginData = '';
                        app.successMsg = '';
                        // app.checkSession();
                    }, 2000);
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };

        app.logout = function () {
            exit();
        };


    });




var app = angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {

        $routeProvider

            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })

            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: true,
                permission: ['admin']

            })

            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })

            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authenticated: true
            })

            .when('/profil', {
                templateUrl: 'app/views/pages/management/profil.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,
                permission: ['admin', 'moderator', 'user', 'service']
            })

            .when('/profil_service', {
                templateUrl: 'app/views/pages/management/profil_service.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,
                permission: ['admin', 'moderator', 'service']
            })

            .when('/management', {
                templateUrl: 'app/views/pages/management/management.html',
                controller: 'managementCtrl',
                controllerAs: 'management',
                authenticated: true,
                permission: ['admin']

            })
            .when('/edit/:id', {
                templateUrl: 'app/views/pages/management/edit.html',
                controller: 'editCtrl',
                controllerAs: 'edit',
                authenticated: true,
                permission: ['admin', 'moderator', 'service', 'logistic']

            })

            .when('/registru', {
                templateUrl: 'app/views/pages/management/registru.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,
                permission: ['admin', 'moderator', 'service']
            })

            .when('/registruLogistic', {
                templateUrl: 'app/views/pages/management/registruLogistic.html',
                controller: 'registruLogisticCtrl',
                controllerAs: 'registruLog',
                authenticated: true,
                permission: ['admin', 'moderator', 'logistic']
            })

            .when('/piese', {
                templateUrl: 'app/views/pages/management/piese.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,
                permission: ['admin', 'moderator', 'service']
            })

            .when('/editPacient/:id', {
                templateUrl: 'app/views/pages/management/editPacient.html',
                controller: 'editPacientCtrl',
                controllerAs: 'editPacient',
                authenticated: true,

            })
            .when('/registerPac', {
                templateUrl: 'app/views/pages/users/registerPacient.html',
                controller: 'regPacientCtrl',
                controllerAs: 'registerPac',
                authenticated: true
            })

            .when('/search', {
                templateUrl: 'app/views/pages/management/search.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,
                permission: ['admin', 'moderator']
            })

            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });



app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if (next.$$route !== undefined) {
            if (next.$$route.authenticated === true) {
                if (!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                } else if (next.$$route.permission) {

                    User.getPermission().then(function (data) {
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                                if (next.$$route.permission[2] !== data.data.permission) {
                                    if (next.$$route.permission[3] !== data.data.permission) {
                                        event.preventDefault();
                                        $location.path('/');
                                    }
                                }
                            }
                        }
                    });
                }
            } else if (next.$$route.authenticated === false) {
                if (Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profil');
                }
            }
        }
    });
}]);



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

            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true
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
                permission: ['admin', 'moderator']

            })

            //Pacient Ctrl
            .when('/registru', {
                templateUrl: 'app/views/pages/management/registru.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,


            })
            //Pacient Registru
            .when('/editPacient/:id', {
                templateUrl: 'app/views/pages/management/editPacient.html',
                controller: 'editPacientCtrl',
                controllerAs: 'editPacient',
                authenticated: true,

            })
            //Pacient Add
            .when('/registerPac', {
                templateUrl: 'app/views/pages/users/registerPacient.html',
                controller: 'regPacientCtrl',
                controllerAs: 'registerPac',
                authenticated: true
            })

            //Pacient Cautare
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
                                event.preventDefault();
                                $location.path('/');
                            }
                        }
                    });
                }
            } else if (next.$$route.authenticated === false) {
                if (Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profile');
                }
            }
        }
    });
}]);



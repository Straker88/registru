angular.module('userApp', ['appRoutes', 'userControllers', 'pacientControllers', 'userServices', 'mainController', 'authServices', 'managementController'])

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    });



angular.module('userServices', [])

    .factory('User', function ($http) {
        userFactory = {};

        //User.create(regData)
        userFactory.create = function (regData) {
            return $http.post('/api/users/', regData);
        };
        userFactory.renewSession = function (username) {
            return $http.get('/api/renewToken/' + username);
        };

        userFactory.getPermission = function () {
            return $http.get('/api/permission/');
        };

        userFactory.getUsers = function () {
            return $http.get('/api/manangement/');
        };

        userFactory.getUser = function (id) {
            return $http.get('/api/edit/' + id);
        };

        userFactory.deleteUser = function (username) {
            return $http.delete('/api/management/' + username);
        };

        userFactory.editUser = function (id) {
            return $http.put('/api/edit', id);
        };

        return userFactory;
    })

    // Pacient Factory
    .factory('Pacient', function ($http) {
        pacientFactory = {};

        pacientFactory.create = function (regData) {
            return $http.post('/api/pacienti/', regData);
        };

        pacientFactory.getPacienti = function () {
            return $http.get('/api/registru/');
        };

        pacientFactory.getPacient = function (id) {
            return $http.get('/api/editPacient/' + id);
        };

        // pacientFactory.getPostedPacient = function (postedBy) {
        //     return $http.get('/api/editPacient/' + postedBy);
        // };

        pacientFactory.deletePacient = function (id) {
            return $http.delete('/api/registru/' + id);
        };

        pacientFactory.editPacient = function (id) {
            return $http.put('/api/editPacient', id);
        };

        return pacientFactory;
    });

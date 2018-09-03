angular.module('pacientControllers', ['userServices'])

    .controller('regPacientCtrl', function ($http, $location, $timeout, Pacient) {

        var app = this;

        this.regPacient = function (regData, valid) {
            app.loading = true;
            app.errorMsg = false;

            if (valid) {
                Pacient.create(app.regData).then(function (data) {
                    if (data.data.success) {
                        app.loading = false;
                        app.successMsg = data.data.message + '... Aplicatia se intoarce automat la Registru Inregistrari in 5 secunde';
                        $timeout(function () {
                            $location.path('/registru');
                        }, 5000);
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;

                    }

                });
            } else {
                app.loading = false;
                app.errorMsg = 'Completeaza corect Formularul';

            }

        };
    });



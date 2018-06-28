angular.module('pacientControllers', ['userServices'])

.controller('regPacientCtrl', function($http, $location, $timeout, Pacient){

    var app= this;

  this.regPacient = function (regData, valid) {
        app.loading = true;
        app.errorMsg = false;

        if(valid){
            Pacient.create(app.regData).then(function(data){
                if (data.data.success) {
                    app.loading = false;
                    // Create Success Message
                    app.successMsg = data.data.message + '...Redirecting';
                    // Redirect to Home Page
                    $timeout(function(){
                        $location.path('/registru');
                    }, 500);
                } else {
                    // Create Error Message
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
    
            });
        } else {
            // Create Error Message
            app.loading = false;
            app.errorMsg = 'Please ensure form  is filled out properly';

        }

  };
});



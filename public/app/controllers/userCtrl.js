angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){

    var app= this;

  this.regUser = function (regData, valid) {
        app.loading = true;
        app.errorMsg = false;

        if(valid){
            User.create(app.regData).then(function(data){
                if (data.data.success) {
                    app.loading = false;
                    // Create Success Message
                    app.successMsg = data.data.message + '...Redirecting';
                    // Redirect to Home Page
                    $timeout(function(){
                        $location.path('/login');
                    }, 2000);
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



angular.module('managementController', [])

    .controller('managementCtrl', function (User, $scope) {
        var app = this;

        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;
        app.limit = 5;
        app.searchLimit = 0;


        function getUsers() {
            User.getUsers().then(function (data) {
                if (data.data.success) {
                    if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                        app.users = data.data.users;
                        app.loading = false,
                            app.accessDenied = false;
                        if (data.data.permission === 'admin') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                        } else if (data.data.permission === 'moderator') {
                            app.editAccess = true;
                        }

                    } else {
                        app.errorMsg = 'Insufficient Permissions';
                        app.loading = false;

                    }
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
                }
            });
        }
        getUsers();

        app.showMore = function (number) {
            app.showMoreError = false;

            if (number > 0) {
                app.limit = number;
            } else {
                app.showMoreError = 'Please enter a valid number';
            }

        };

        app.showAll = function () {
            app.limit = undefined;
            app.showMoreError = false;
        };

        app.deleteUser = function (username) {
            User.deleteUser(username).then(function (data) {
                if (data.data.success) {
                    getUsers();
                } else {
                    app.showMoreError = data.data.message;
                }
            });
        };

    })

    .controller('editCtrl', function ($scope, $routeParams, User, $timeout) {
        var app = this;
        $scope.nameTab = 'active';
        app.phase1 = true;

        User.getUser($routeParams.id).then(function (data) {
            if (data.data.success) {
                $scope.newName = data.data.user.name;
                $scope.newEmail = data.data.user.email;
                $scope.newUsername = data.data.user.username;
                $scope.newPermission = data.data.user.permission;
                app.currentUser = data.data.user._id;
                var universalUser = app.currentUser;
                return universalUser;
            } else {
                app.errorMsg = data.data.message;
            }
        });

        app.namePhase = function () {
            $scope.nameTab = 'active';
            $scope.usernameTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
            app.phase1 = true;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.errorMsg = false;


        };

        app.emailPhase = function () {

            $scope.nameTab = 'default';
            $scope.usernameTab = 'default';
            $scope.emailTab = 'active';
            $scope.permissionsTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = true;
            app.phase4 = false;
            app.errorMsg = false;
        };


        app.usernamePhase = function () {

            $scope.nameTab = 'default';
            $scope.usernameTab = 'active';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
            app.phase1 = false;
            app.phase2 = true;
            app.phase3 = false;
            app.phase4 = false;
            app.errorMsg = false;
        };


        app.permissionsPhase = function () {

            $scope.nameTab = 'default';
            $scope.usernameTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'active';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = true;
            app.disableUser = false;
            app.disableModerator = false;
            app.disableAdmin = false;
            app.errorMsg = false;

            if ($scope.newPermission === 'user') {
                app.disableUser = true;
            } else if ($scope.newPermission === 'moderator') {
                app.disableModerator = true;
            } else if ($scope.newPermission === 'admin') {
                app.disableAdmin = true;
            }

        };

        app.updateName = function (newName, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var userObject = {};
                userObject._id = app.currentUser;
                userObject.name = $scope.newName;
                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.nameForm.name.$setPristine();
                            app.nameForm.name.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly';
                app.disabled = false;
            }
        };


        app.updateEmail = function (newEmail, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var userObject = {};
                userObject._id = app.currentUser;
                userObject.email = $scope.newEmail;
                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.emailForm.email.$setPristine();
                            app.emailForm.email.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly';
                app.disabled = false;
            }
        };

        app.updateUsername = function (newUsername, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var userObject = {};
                userObject._id = app.currentUser;
                userObject.username = $scope.newUsername;
                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.usernameForm.username.$setPristine();
                            app.usernameForm.username.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly';
                app.disabled = false;
            }
        };

        app.updatePermissions = function (newPermission) {
            app.errorMsg = false;
            app.disableUser = true;
            app.disableModerator = true;
            app.disableAdmin = true;
            var userObject = {};
            userObject._id = app.currentUser;
            userObject.permission = newPermission;

            User.editUser(userObject).then(function (data) {

                if (data.data.success) {
                    app.successMsg = data.data.message;

                    $timeout(function () {
                        app.successMsg = false;
                        $scope.newPermission = newPermission;

                        if (newPermission === 'user') {
                            app.disableUser = true;
                            app.disableModerator = false;
                            app.disableAdmin = false;
                        } else if (newPermission === 'moderator') {
                            app.disableUser = false;
                            app.disableModerator = true;
                            app.disableAdmin = false;

                        } else if (newPermission === 'admin') {
                            app.disableUser = false;
                            app.disableModerator = false;
                            app.disableAdmin = true;
                        }
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        };
    })

    .controller('registruCtrl', function (User, Pacient, $scope, $routeParams) {
        var app = this;

        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        app.limit = 20;
        app.searchLimit = 0;

        (() => {
            User.getUsers().then(function (data) {
                app.loading = false;
                currentUser = data.data.currentUser.username;
                currentUserPermission = data.data.permission;
                return currentUser, currentUserPermission;
            });
        })();

        function getPacienti() {
            Pacient.getPacienti().then(function (data) {
                if (data.data.success) {
                    if (currentUserPermission === 'admin' || currentUserPermission === 'moderator' || currentUserPermission === 'user') {
                        app.pacienti = data.data.pacienti;
                        app.editPacientAccess = true;
                        if (currentUserPermission === 'admin') {
                            app.deletePacientAccess = true;
                        } else if (currentUserPermission === 'moderator' || currentUserPermission === 'user') {
                            app.deletePacientAccess = false;
                        }
                    }
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
                }
            });

        }

        getPacienti();

        app.showMore = function (number) {
            app.showMoreError = false;

            if (number > 0) {
                app.limit = number;
            } else {
                app.showMoreError = 'Introdu o cifra valida';
            }
        };

        app.showAll = function () {
            app.limit = undefined;
            $scope.searchKeyword = undefined;
            $scope.searchFilter = undefined;
            $scope.number = undefined;
            app.showMoreError = false;
        };

        app.deletePacient = function (id) {
            Pacient.deletePacient(id).then(function (data) {
                if (data.data.success) {
                    getPacienti();
                } else {
                    app.showMoreError = data.data.message;
                }
            });
        };

        app.search = function (searchKeyword, number) {
            app.showMoreError = false;

            if (searchKeyword) {
                if (searchKeyword.length > 0) {
                    app.limit = 0;
                    $scope.searchFilter = searchKeyword;
                    app.limit = number;
                } else {
                    $scope.searchFilter = undefined;
                }
            } else {
                $scope.searchFilter = undefined;
                app.showMoreError = 'Nimic de cautat';
            }
        };

        app.sortOrder = function (order) {
            app.sort = order;
        };

        app.clear = function () {
            app.limit = undefined;
            $scope.searchKeyword = undefined;
            $scope.searchFilter = undefined;
            app.showMoreError = false;
        };

        app.advancedSearch = function (searchByUsername, searchByEmail, searchByName) {

            if (searchByUsername || searchByEmail || searchByName) {
                $scope.advancedSearchFilter = {};
                if (searchByUsername) {
                    $scope.advancedSearchFilter.username = searchByUsername;
                }
                if (searchByEmail) {
                    $scope.advancedSearchFilter.email = searchByEmail;
                }
                if (searchByName) {
                    $scope.advancedSearchFilter.name = searchByName;
                }
                app.searchLimit = undefined;
            }
        };

        // function MyController($scope) {
        //     $scope.created = new Date();
        // };
        // console.log(MyController());
    })

    .controller('editPacientCtrl', function ($scope, $routeParams, Pacient, User, $timeout) {
        var app = this;


        function getUsers() {
            User.getUsers().then(function (data) {
                app.loading = false;
                currentUser = data.data.currentUser.username;
                return currentUser;
            });
        }

        getUsers();

        Pacient.getPacient($routeParams.id).then(function (data) {
            if (data.data.success) {
                $scope.newCabinet = data.data.pacient.cabinet;
                $scope.newName = data.data.pacient.name;
                $scope.newEmail = data.data.pacient.email;
                currentPostedBy = data.data.pacient.postedBy;
                app.currentPacient = data.data.pacient._id;
            } else {
                app.errorMsg = data.data.message;
            }
        });

        app.updateName = function (newName, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.name = $scope.newName;

                if (currentPostedBy === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsg = data.data.message;
                            $timeout(function () {
                                app.nameForm.name.$setPristine();
                                app.nameForm.name.$setUntouched();
                                app.successMsg = false;
                                app.disabled = false;
                            }, 1000);

                        } else {
                            app.errorMsg = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsg = 'Nu esti utilizatorul care a inregistrat acest service, nu poti face modificari';
                    app.disabled = false;
                }
            } else {
                app.errorMsg = 'Please ensure form is filled out properly';
                app.disabled = false;
            }
        };

        app.updateCabinet = function (newCabinet, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.cabinet = $scope.newCabinet;
                Pacient.editPacient(pacientObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.cabinetForm.cabinet.$setPristine();
                            app.cabinetForm.cabinet.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 1000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly';
                app.disabled = false;
            }
        };


        app.updateEmail = function (newEmail, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.email = $scope.newEmail;
                Pacient.editPacient(pacientObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.emailForm.email.$setPristine();
                            app.emailForm.email.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 1000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Please ensure form is filled out properly';
                app.disabled = false;
            }
        };

    });


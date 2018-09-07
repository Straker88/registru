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
        $scope.data_estimativa = new moment().businessAdd(13).format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');

        (() => {
            User.getUsers().then(function (data) {
                app.loading = false;
                currentUser = data.data.currentUser.username;
                return currentUser;
            });
        })();



        function getPacienti() {
            Pacient.getPacienti().then(function (data) {
                app.pacienti = data.data.pacienti;
                app.editPacientAccess = true;

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

    })

    .controller('editPacientCtrl', function ($scope, $routeParams, Pacient, User, $timeout) {
        var app = this;
        var eroare = 'Nu esti utilizatorul care a inregistrat acest service, modificarile nu sunt salvate';

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
                $scope.newData_Inregistrare = data.data.pacient.data_inregistrare;
                $scope.newNume = data.data.pacient.nume;
                $scope.newDenumire_Aparat = data.data.pacient.denumire_aparat;
                $scope.newSerie_Aparat = data.data.pacient.serie_aparat;
                $scope.newDefectiune_Reclamata = data.data.pacient.defectiune_reclamata;
                $scope.newConstatare_Cabinet = data.data.pacient.constatare_cabinet;
                $scope.newGarantie = data.data.pacient.garantie;
                $scope.newCutie = data.data.pacient.cutie;
                $scope.newBaterie = data.data.pacient.baterie;
                $scope.newMulaj = data.data.pacient.mulaj;
                $scope.newOliva = data.data.pacient.oliva;
                $scope.newObservatii_Cabinet = data.data.pacient.observatii_cabinet;
                $scope.newObservatii_Pacient = data.data.pacient.observatii_pacient;
                $scope.newPredat_Pacient = data.data.pacient.predat_pacient;
                $scope.newIesit_Cabinet = data.data.pacient.iesit_cabinet;


                $scope.newCabinet = data.data.pacient.cabinet;
                $scope.newEmail = data.data.pacient.email;
                $scope.newPostedBy = data.data.pacient.postedBy;
                currentCabinet = data.data.pacient.cabinet;
                app.currentPacient = data.data.pacient._id;
            } else {
                app.errorMsg = data.data.message;
            }
        });


        app.updateNume = function (newNume, valid) {
            app.errorMsgNume = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.name = $scope.newNume;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgNume = data.data.message;
                            $timeout(function () {
                                app.numeForm.nume.$setPristine();
                                app.numeForm.nume.$setUntouched();
                                app.successMsgNume = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgNume = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgNume = eroare;
                    app.disabled = true;
                    $timeout(function () {
                        app.errorMsgNume = false;
                        app.disabled = false;
                    }, 3000);
                }
            } else {
                app.errorMsgNume = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updateDenumire_Aparat = function (newDenumire_Aparat, valid) {
            app.errorMsgDenumire_Aparat = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.denumire_aparat = $scope.newDenumire_Aparat;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgDenumire_Aparat = data.data.message;
                            $timeout(function () {
                                app.denumire_aparatForm.denumire_aparat.$setPristine();
                                app.denumire_aparatForm.denumire_aparat.$setUntouched();
                                app.successMsgDenumire_Aparat = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgDenumire_Aparat = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgDenumire_Aparat = eroare;
                    app.disabled = true;
                    $timeout(function () {
                        app.errorMsgDenumire_Aparat = false;
                        app.disabled = false;
                    }, 3000);
                }
            } else {
                app.errorMsgDenumire_Aparat = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateSerie_Aparat = function (newSerie_Aparat, valid) {
            app.errorMsgSerie_Aparat = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.serie_aparat = $scope.newSerie_Aparat;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgSerie_Aparat = data.data.message;
                            $timeout(function () {
                                app.serie_aparatForm.serie_aparat.$setPristine();
                                app.serie_aparatForm.serie_aparat.$setUntouched();
                                app.successMsgSerie_Aparat = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgSerie_Aparat = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgSerie_Aparat = eroare;
                    app.disabled = true;
                    $timeout(function () {
                        app.errorMsgSerie_Aparat = false;
                        app.disabled = false;
                    }, 3000);
                }
            } else {
                app.errorMsgSerie_Aparat = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateDefectiune_Reclamata = function (newDefectiune_Reclamata, valid) {
            app.errorMsgDefectiune_Reclamata = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.defectiune_reclamata = $scope.newDefectiune_Reclamata;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgDefectiune_Reclamata = data.data.message;
                            $timeout(function () {
                                app.defectiune_reclamataForm.defectiune_reclamata.$setPristine();
                                app.defectiune_reclamataForm.defectiune_reclamata.$setUntouched();
                                app.successMsgDefectiune_Reclamata = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgDefectiune_Reclamata = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgDefectiune_Reclamata = eroare;
                    app.disabled = true;
                    $timeout(function () {
                        app.errorMsgDefectiune_Reclamata = false;
                        app.disabled = false;
                    }, 3000);
                }
            } else {
                app.errorMsgDefectiune_Reclamata = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateObservatii_Cabinet = function (newObservatii_Cabinet, valid) {
            app.errorMsgObservatii_Cabinet = false;
            app.disabled = false;


            var pacientObject = {};
            pacientObject._id = app.currentPacient;
            pacientObject.observatii_cabinet = $scope.newObservatii_Cabinet;

            if (currentCabinet === currentUser) {
                Pacient.editPacient(pacientObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgObservatii_Cabinet = data.data.message;
                        $timeout(function () {
                            app.observatii_cabinetForm.observatii_cabinet.$setPristine();
                            app.observatii_cabinetForm.observatii_cabinet.$setUntouched();
                            app.successMsgObservatii_Cabinet = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_Cabinet = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_Cabinet = eroare;
                app.disabled = true;
                $timeout(function () {
                    app.errorMsgObservatii_Cabinet = false;
                    app.disabled = false;
                }, 3000);
            }

        };

        app.updateObservatii_Pacient = function (newObservatii_Pacient, valid) {
            app.errorMsgObservatii_Pacient = false;
            app.disabled = false;


            var pacientObject = {};
            pacientObject._id = app.currentPacient;
            pacientObject.observatii_pacient = $scope.newObservatii_Pacient;

            if (currentCabinet === currentUser) {
                Pacient.editPacient(pacientObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgObservatii_Pacient = data.data.message;
                        $timeout(function () {
                            app.observatii_pacientForm.observatii_pacient.$setPristine();
                            app.observatii_pacientForm.observatii_pacient.$setUntouched();
                            app.successMsgObservatii_Pacient = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_Pacient = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_Pacient = eroare;
                app.disabled = true;
                $timeout(function () {
                    app.errorMsgObservatii_Pacient = false;
                    app.disabled = false;
                }, 3000);

            }
        };



        app.updateIesit_Cabinet = function (newIesit_Cabinet, valid) {
            app.errorMsgIesit_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.iesit_cabinet = $scope.newIesit_Cabinet;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgIesit_Cabinet = data.data.message;
                            $timeout(function () {
                                app.iesit_cabinetForm.iesit_cabinet.$setPristine();
                                app.iesit_cabinetForm.iesit_cabinet.$setUntouched();
                                app.successMsgIesit_Cabinet = false;
                                app.disabled = false;
                            }, 2000);

                        } else {
                            app.errorMsgIesit_Cabinet = data.data.message;
                            app.disabled = true;
                            $timeout(function () {
                                app.errorMsgIesit_Cabinet = false;
                                app.disabled = false;
                            }, 3000);

                        }
                    });
                } else {
                    app.errorMsgIesit_Cabinet = eroare;
                    app.disabled = true;
                    $timeout(function () {
                        app.errorMsgIesit_Cabinet = false;
                        app.disabled = false;
                    }, 3000);
                }
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updatePredat_Pacient = function (newPredat_Pacient, valid) {
            app.errorMsgPredat_Pacient = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.predat_pacient = $scope.newPredat_Pacient;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgPredat_Pacient = data.data.message;
                            $timeout(function () {
                                app.predat_pacientForm.predat_pacient.$setPristine();
                                app.predat_pacientForm.predat_pacient.$setUntouched();
                                app.successMsgPredat_Pacient = false;
                                app.disabled = false;
                            }, 2000);

                        } else {
                            app.errorMsgPredat_Pacient = data.data.message;
                            app.disabled = true;
                            $timeout(function () {
                                app.errorMsgPredat_Pacient = false;
                                app.disabled = false;
                            }, 3000);

                        }
                    });
                } else {
                    app.errorMsgPredat_Pacient = eroare;
                    app.disabled = true;
                    $timeout(function () {
                        app.errorMsgPredat_Pacient = false;
                        app.disabled = false;
                    }, 3000);
                }
            } else {
                app.errorMsgPredat_Pacient = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };



        app.updateCabinet = function (newCabinet, valid) {
            app.errorMsg = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.cabinet = $scope.newCabinet;
                Pacient.editPacient(pacientObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg2 = data.data.message;
                        $timeout(function () {
                            app.cabinetForm.cabinet.$setPristine();
                            app.cabinetForm.cabinet.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 700);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updateEmail = function (newEmail, valid) {
            app.errorMsg = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.email = $scope.newEmail;
                Pacient.editPacient(pacientObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg3 = data.data.message;
                        $timeout(function () {
                            app.emailForm.email.$setPristine();
                            app.emailForm.email.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 700);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

    });


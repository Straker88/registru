angular.module('managementController', [])

    .controller('managementCtrl', function (User, $scope) {
        var app = this;

        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;
        app.limit = 20;
        app.searchLimit = 0;


        //              User Controller ----------------------------------------------
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


    //              User Edit Controller ----------------------------------------------
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

    //              Registru Pacienti Controller ----------------------------------------------
    .controller('registruCtrl', function (User, Pacient, $scope) {
        var app = this;
        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');
        $scope.finalizat_service = new moment().format('DD/MM/YYYY');


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


    .controller('registruLogisticCtrl', function (User, Pacient, $scope) {
        var app = this;
        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');
        $scope.finalizat_service = new moment().format('DD/MM/YYYY');


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

    })

    //              Pacient Edit Controller ----------------------------------------------

    .controller('editPacientCtrl', function ($scope, $routeParams, Pacient, User, $timeout) {
        var app = this;
        var eroare = 'Nu esti utilizatorul care a inregistrat acest service, modificarile nu sunt salvate';
        var eroare_log = 'Se completeaza de catre Dep. Logistic, modificarile nu sunt salvate';
        var eroare_serv = 'Se completeaza de catre Dep. Service, modificarile nu sunt salvate';

        function getUsers() {
            User.getUsers().then(function (data) {
                app.loading = false;
                currentUser = data.data.currentUser.username;
            });
        }
        getUsers();

        Pacient.getPacient($routeParams.id).then(function (data) {
            if (data.data.success) {

                //              1.Cabinet ----------------------------------------------
                $scope.newData_Inregistrare = data.data.pacient.data_inregistrare;
                $scope.newData_Estimativa = data.data.pacient.data_estimativa;
                $scope.newNume = data.data.pacient.nume;
                $scope.newTelefon = data.data.pacient.telefon;
                $scope.newDenumire_Aparat = data.data.pacient.denumire_aparat;
                $scope.newSerie_Aparat = data.data.pacient.serie_aparat;
                $scope.newDefectiune_Reclamata = data.data.pacient.defectiune_reclamata;
                $scope.newConstatare_Cabinet = data.data.pacient.constatare_cabinet;
                $scope.newCompletare_Cabinet = data.data.pacient.completare_cabinet;
                $scope.newU_Stanga = data.data.pacient.u_stanga;
                $scope.newU_Dreapta = data.data.pacient.u_dreapta;
                $scope.newGarantie = data.data.pacient.garantie;
                $scope.newCutie = data.data.pacient.cutie;
                $scope.newBaterie = data.data.pacient.baterie;
                $scope.newMulaj = data.data.pacient.mulaj;
                $scope.newOliva = data.data.pacient.oliva;
                $scope.newObservatii_Cabinet = data.data.pacient.observatii_cabinet;
                $scope.newObservatii_Pacient = data.data.pacient.observatii_pacient;
                $scope.newPredat_Pacient = data.data.pacient.predat_pacient;
                $scope.newIesit_Cabinet = data.data.pacient.iesit_cabinet;
                $scope.newIntrat_Cabinet = data.data.pacient.intrat_cabinet;
                $scope.newCabinet = data.data.pacient.cabinet;
                $scope.newTaxa_Urgenta_Cabinet = data.data.pacient.taxa_urgenta_cabinet;
                currentCabinet = data.data.pacient.cabinet;
                app.currentPacient = data.data.pacient._id;



                //              2.Logistic ----------------------------------------------
                $scope.newLog_Sosit = data.data.pacient.log_sosit;
                $scope.newLog_Plecat = data.data.pacient.log_plecat;
                $scope.newLog_Preluat = data.data.pacient.log_preluat;
                $scope.newLog_Trimis = data.data.pacient.log_trimis;



                //              3.Service ----------------------------------------------
                $scope.newObservatii_Service = data.data.pacient.observatii_service;
                $scope.newServ_Sosit = data.data.pacient.serv_sosit;
                $scope.newServ_Plecat = data.data.pacient.serv_plecat;
                $scope.newFinalizat_Service = data.data.pacient.finalizat_service;
                $scope.newFinalizat_Reparatie = data.data.pacient.finalizat_reparatie;
                $scope.newConstatare_Service = data.data.pacient.constatare_service;
                $scope.newOperatiuni_Efectuate = data.data.pacient.operatiuni_efectuate;
                $scope.newPiese_Inlocuite = data.data.pacient.piese_inlocuite;
                $scope.newCod_Componente = data.data.pacient.cod_componente;
                $scope.newCost_Reparatie = data.data.pacient.cost_reparatie;
                $scope.newExecutant_Reparatie = data.data.pacient.executant_reparatie;
                $scope.newTaxa_Constatare = data.data.pacient.taxa_constatare;
                $scope.newTaxa_Urgenta = data.data.pacient.taxa_urgenta;
                $scope.newGarantie_Serv = data.data.pacient.garantie_serv;

            } else {
                app.errorMsg = data.data.message;
            }
        });

        //              1.Cabinet ----------------------------------------------


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

            }
        };

        app.updateCompletare_Cabinet = function (newCompletare_Cabinet, valid) {
            app.errorMsgCompletare_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.completare_cabinet = $scope.newCompletare_Cabinet;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgCompletare_Cabinet = data.data.message;

                            $timeout(function () {
                                app.completare_cabinetForm.completare_cabinet.$setPristine();
                                app.completare_cabinetForm.completare_cabinet.$setUntouched();
                                app.successMsgCompletare_Cabinet = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgCompletare_Cabinet = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgCompletare_Cabinet = eroare;
                    app.disabled = true;
                }
            } else {
                app.errorMsgCompletare_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateTaxa_Urgenta_Cabinet = function (newTaxa_Urgenta_Cabinet, valid) {
            app.errorMsgTaxa_Urgenta_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.taxa_urgenta_cabinet = $scope.newTaxa_Urgenta_Cabinet;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgTaxa_Urgenta_Cabinet = data.data.message;
                            $timeout(function () {
                                app.taxa_urgenta_cabinetForm.taxa_urgenta_cabinet.$setPristine();
                                app.taxa_urgenta_cabinetForm.taxa_urgenta_cabinet.$setUntouched();
                                app.successMsgTaxa_Urgenta_Cabinet = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgTaxa_Urgenta_Cabinet = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgTaxa_Urgenta_Cabinet = eroare;
                    app.disabled = true;
                }
            } else {
                app.errorMsgTaxa_Urgenta_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;
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
                            }, 1500);

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
                }
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateIntrat_Cabinet = function (newIntrat_Cabinet, valid) {
            app.errorMsgIntrat_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.intrat_cabinet = $scope.newIntrat_Cabinet;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgIntrat_Cabinet = data.data.message;
                            $timeout(function () {
                                app.intrat_cabinetForm.intrat_cabinet.$setPristine();
                                app.intrat_cabinetForm.intrat_cabinet.$setUntouched();
                                app.successMsgIntrat_Cabinet = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgIntrat_Cabinet = data.data.message;
                            app.disabled = true;
                            $timeout(function () {
                                app.errorMsgIntrat_Cabinet = false;
                                app.disabled = false;
                            }, 3000);

                        }
                    });
                } else {
                    app.errorMsgIntrat_Cabinet = eroare;
                    app.disabled = true;
                }
            } else {
                app.errorMsgIntrat_Cabinet = 'Acest camp trebuie completat';
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
                            }, 1500);

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

        //              2.Logistic ----------------------------------------------

        app.updateLog_Trimis = function (newLog_Trimis, valid) {
            app.errorMsgLog_Trimis = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.log_trimis = $scope.newLog_Trimis;

                if (currentUser === 'LogisticRoxana' || currentUser === 'LogisticClaudita') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgLog_Trimis = data.data.message;
                            $timeout(function () {
                                app.log_trimisForm.log_trimis.$setPristine();
                                app.log_trimisForm.log_trimis.$setUntouched();
                                app.successMsgLog_Trimis = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgLog_Trimis = data.data.message;
                            app.disabled = true;
                            $timeout(function () {
                                app.errorMsgLog_Trimis = false;
                                app.disabled = false;
                            }, 3000);

                        }
                    });
                } else {
                    app.errorMsgLog_Trimis = eroare_log;
                    app.disabled = true;
                }
            } else {
                app.errorMsgLog_Trimis = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateLog_Preluat = function (newLog_Preluat, valid) {
            app.errorMsgLog_Preluat = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.log_preluat = $scope.newLog_Preluat;

                if (currentUser === 'LogisticRoxana' || currentUser === 'LogisticClaudita') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgLog_Preluat = data.data.message;
                            $timeout(function () {
                                app.log_preluatForm.log_preluat.$setPristine();
                                app.log_preluatForm.log_preluat.$setUntouched();
                                app.successMsgLog_Preluat = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgLog_Preluat = data.data.message;
                            app.disabled = true;
                            $timeout(function () {
                                app.errorMsgLog_Preluat = false;
                                app.disabled = false;
                            }, 3000);

                        }
                    });
                } else {
                    app.errorMsgLog_Preluat = eroare_log;
                    app.disabled = true;
                }
            } else {
                app.errorMsgLog_Preluat = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updateLog_Plecat = function (newLog_Plecat, valid) {
            app.errorMsgLog_Plecat = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.log_plecat = $scope.newLog_Plecat;

                if (currentUser === 'LogisticRoxana' || currentUser === 'LogisticClaudita') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgLog_Plecat = data.data.message;
                            $timeout(function () {
                                app.log_plecatForm.log_plecat.$setPristine();
                                app.log_plecatForm.log_plecat.$setUntouched();
                                app.successMsgLog_Plecat = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgLog_Plecat = data.data.message;
                            app.disabled = true;
                            $timeout(function () {
                                app.errorMsgLog_Plecat = false;
                                app.disabled = false;
                            }, 3000);

                        }
                    });
                } else {
                    app.errorMsgLog_Plecat = eroare_log;
                    app.disabled = true;
                }
            } else {
                app.errorMsgLog_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updateLog_Sosit = function (newLog_Sosit, valid) {
            app.errorMsgLog_Sosit = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.log_sosit = $scope.newLog_Sosit;

                if (currentUser === 'LogisticRoxana' || currentUser === 'LogisticClaudita') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgLog_Sosit = data.data.message;
                            $timeout(function () {
                                app.log_sositForm.log_sosit.$setPristine();
                                app.log_sositForm.log_sosit.$setUntouched();
                                app.successMsgLog_Sosit = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgLog_Sosit = data.data.message;
                            app.disabled = true;
                            $timeout(function () {
                                app.errorMsgLog_Sosit = false;
                                app.disabled = false;
                            }, 3000);

                        }
                    });
                } else {
                    app.errorMsgLog_Sosit = eroare_log;
                    app.disabled = true;
                }
            } else {
                app.errorMsgLog_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        //              3.Service ----------------------------------------------
        app.updateFinalizat_Service = function (newFinalizat_Service, valid) {
            app.errorMsgFinalizat_Service = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.finalizat_service = $scope.newFinalizat_Service;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgFinalizat_Service = data.data.message;
                            $timeout(function () {
                                app.finalizat_serviceForm.finalizat_service.$setPristine();
                                app.finalizat_serviceForm.finalizat_service.$setUntouched();
                                app.successMsgFinalizat_Service = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgFinalizat_Service = data.data.message;
                            app.disabled = true;
                        }
                    });
                } else {
                    app.errorMsgFinalizat_Service = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgFinalizat_Service = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updateObservatii_Service = function (newObservatii_Service, valid) {
            app.errorMsgObservatii_Service = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.observatii_service = $scope.newObservatii_Service;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgTaxa_Urgenta = data.data.message;
                            $timeout(function () {
                                app.observatii_serviceForm.observatii_service.$setPristine();
                                app.observatii_serviceForm.observatii_service.$setUntouched();
                                app.successMsgObservatii_Service = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgObservatii_Service = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgObservatii_Service = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgObservatii_Service = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updateGarantie_Serv = function (newGarantie_Serv, valid) {
            app.errorMsgGarantie_Serv = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.garantie_serv = $scope.newGarantie_Serv;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgTaxa_Urgenta = data.data.message;
                            $timeout(function () {
                                app.garantie_servForm.garantie_serv.$setPristine();
                                app.garantie_servForm.garantie_serv.$setUntouched();
                                app.successMsgGarantie_Serv = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgGarantie_Serv = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgGarantie_Serv = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgGarantie_Serv = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateTaxa_Urgenta = function (newTaxa_Urgenta, valid) {
            app.errorMsgTaxa_Urgenta = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.taxa_urgenta = $scope.newTaxa_Urgenta;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgTaxa_Urgenta = data.data.message;
                            $timeout(function () {
                                app.taxa_urgentaForm.taxa_urgenta.$setPristine();
                                app.taxa_urgentaForm.taxa_urgenta.$setUntouched();
                                app.successMsgTaxa_Urgenta = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgTaxa_Urgenta = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgTaxa_Urgenta = eroare_serv;
                    app.disabled = true;
                }
            }
        };

        app.updateTaxa_Constatare = function (newTaxa_Constatare, valid) {
            app.errorMsgTaxa_Constatare = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.taxa_constatare = $scope.newTaxa_Constatare;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgTaxa_Constatare = data.data.message;
                            $timeout(function () {
                                app.taxa_constatareForm.taxa_constatare.$setPristine();
                                app.taxa_constatareForm.taxa_constatare.$setUntouched();
                                app.successMsgTaxa_Constatare = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgTaxa_Constatare = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgTaxa_Constatare = eroare_serv;
                    app.disabled = true;
                }
            }
        };

        app.updateExecutant_Reparatie = function (newExecutant_Reparatie, valid) {
            app.errorMsgExecutant_Reparatie = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.executant_reparatie = $scope.newExecutant_Reparatie;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgExecutant_Reparatie = data.data.message;
                            $timeout(function () {
                                app.executant_reparatieForm.executant_reparatie.$setPristine();
                                app.executant_reparatieForm.executant_reparatie.$setUntouched();
                                app.successMsgExecutant_Reparatie = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgExecutant_Reparatie = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgExecutant_Reparatie = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgExecutant_Reparatie = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateCost_Reparatie = function (newCost_Reparatie, valid) {
            app.errorMsgCost_Reparatie = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.cost_reparatie = $scope.newCost_Reparatie;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgCost_Reparatie = data.data.message;
                            $timeout(function () {
                                app.cost_reparatieForm.cost_reparatie.$setPristine();
                                app.cost_reparatieForm.cost_reparatie.$setUntouched();
                                app.successMsgCost_Reparatie = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgCost_Reparatie = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgCost_Reparatie = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgCost_Reparatie = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updateCod_Componente = function (newCod_Componente, valid) {
            app.errorMsgCod_Componente = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.cod_componente = $scope.newCod_Componente;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgCod_Componente = data.data.message;
                            $timeout(function () {
                                app.cod_componenteForm.cod_componente.$setPristine();
                                app.cod_componenteForm.cod_componente.$setUntouched();
                                app.successMsgCod_Componente = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgCod_Componente = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgCod_Componente = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgCod_Componente = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


        app.updatePiese_Inlocuite = function (newPiese_Inlocuite, valid) {
            app.errorMsgPiese_Inlocuite = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.piese_inlocuite = $scope.newPiese_Inlocuite;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgPiese_Inlocuite = data.data.message;
                            $timeout(function () {
                                app.piese_inlocuiteForm.piese_inlocuite.$setPristine();
                                app.piese_inlocuiteForm.piese_inlocuite.$setUntouched();
                                app.successMsgPiese_Inlocuite = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgPiese_Inlocuite = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgPiese_Inlocuite = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgPiese_Inlocuite = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateOperatiuni_Efectuate = function (newOperatiuni_Efectuate, valid) {
            app.errorMsgOperatiuni_Efectuate = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.operatiuni_efectuate = $scope.newOperatiuni_Efectuate;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgOperatiuni_Efectuate = data.data.message;
                            $timeout(function () {
                                app.operatiuni_efectuateForm.operatiuni_efectuate.$setPristine();
                                app.operatiuni_efectuateForm.operatiuni_efectuate.$setUntouched();
                                app.successMsgOperatiuni_Efectuate = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgOperatiuni_Efectuate = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgOperatiuni_Efectuate = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgOperatiuni_Efectuate = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateConstatare_Service = function (newConstatare_Service, valid) {
            app.errorMsgConstatare_Service = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.constatare_service = $scope.newConstatare_Service;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgConstatare_Service = data.data.message;
                            $timeout(function () {
                                app.constatare_serviceForm.constatare_service.$setPristine();
                                app.constatare_serviceForm.constatare_service.$setUntouched();
                                app.successMsgConstatare_Service = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgConstatare_Service = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgConstatare_Service = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgConstatare_Service = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateFinalizat_Reparatie = function (newFinalizat_Reparatie, valid) {
            app.errorMsgFinalizat_Reparatie = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.finalizat_reparatie = $scope.newFinalizat_Reparatie;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgFinalizat_Reparatie = data.data.message;
                            $timeout(function () {
                                app.finalizat_reparatieForm.finalizat_reparatie.$setPristine();
                                app.finalizat_reparatieForm.finalizat_reparatie.$setUntouched();
                                app.successMsgFinalizat_Reparatie = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgFinalizat_Reparatie = data.data.message;
                            app.disabled = true;

                        }
                    });
                } else {
                    app.errorMsgFinalizat_Reparatie = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgFinalizat_Reparatie = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };



        app.updateServ_Plecat = function (newServ_Plecat, valid) {
            app.errorMsgServ_Plecat = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.serv_plecat = $scope.newServ_Plecat;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgServ_Plecat = data.data.message;
                            $timeout(function () {
                                app.serv_plecatForm.serv_plecat.$setPristine();
                                app.serv_plecatForm.serv_plecat.$setUntouched();
                                app.successMsgServ_Plecat = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgServ_Plecat = data.data.message;
                            app.disabled = true;

                        }
                    });
                } else {
                    app.errorMsgServ_Plecat = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgServ_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };



        app.updateServ_Sosit = function (newServ_Sosit, valid) {
            app.errorMsgServ_Sosit = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.serv_sosit = $scope.newServ_Sosit;

                if (currentUser == 'LaboratorService' || currentUser == 'LaboratorAsamblare') {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgServ_Sosit = data.data.message;
                            $timeout(function () {
                                app.serv_sositForm.serv_sosit.$setPristine();
                                app.serv_sositForm.serv_sosit.$setUntouched();
                                app.successMsgServ_Sosit = false;
                                app.disabled = false;
                            }, 1500);

                        } else {
                            app.errorMsgServ_Sosit = data.data.message;
                            app.disabled = true;

                        }
                    });
                } else {
                    app.errorMsgServ_Sosit = eroare_serv;
                    app.disabled = true;
                }
            } else {
                app.errorMsgServ_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };



    });


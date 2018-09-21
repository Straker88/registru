var User = require('../models/user');
var Pacient = require('../models/pacient');
var jwt = require('jsonwebtoken');
var secret = 'meanstack';
var moment = require('moment-business-days');

module.exports = function (router) {

    // Pacient Registration Route


    router.post('/pacienti', function (req, res) {
        var pacient = new Pacient();

        pacient.cabinet = req.body.cabinet;
        pacient.nume = req.body.nume;
        pacient.telefon = req.body.telefon;
        pacient.denumire_aparat = req.body.denumire_aparat;
        pacient.serie_aparat = req.body.serie_aparat;
        pacient.defectiune_reclamata = req.body.defectiune_reclamata;
        pacient.constatare_cabinet = req.body.constatare_cabinet;
        pacient.completare_cabinet = '';
        pacient.u_stanga = req.body.u_stanga;
        pacient.u_dreapta = req.body.u_dreapta;
        pacient.garantie = req.body.garantie;
        pacient.cutie = req.body.cutie;
        pacient.baterie = req.body.baterie;
        pacient.mulaj = req.body.mulaj;
        pacient.oliva = req.body.oliva;
        pacient.observatii_cabinet = req.body.observatii_cabinet;
        pacient.observatii_pacient = req.body.observatii_pacient;
        pacient.iesit_cabinet = 'nespecificat';
        pacient.intrat_cabinet = 'nespecificat';
        pacient.predat_pacient = 'nespecificat';
        pacient.log_sosit = 'nespecificat';
        pacient.log_plecat = 'nespecificat';
        pacient.log_preluat = 'nespecificat';
        pacient.log_trimis = 'nespecificat';

        pacient.data_inregistrare = new moment().format('DD/MM/YYYY');
        pacient.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');

        pacient.postedBy = req.body.postedBy;
        pacient.email = req.body.email;

        if (req.body.nume == null || req.body.nume == '') {
            return res.json({ success: false, message: 'Completeaza Numele' });
        }

        else if (req.body.denumire_aparat == null || req.body.denumire_aparat == '') {
            res.json({ success: false, message: 'Completeaza Denumire Aparat' });
        }


        else if (req.body.serie_aparat == null || req.body.serie_aparat == '') {
            res.json({ success: false, message: 'Completeaza Serie Aparat' });
        }

        else if (req.body.defectiune_reclamata == null || req.body.defectiune_reclamata == '') {
            res.json({ success: false, message: 'Completeaza Defectiune Reclamata' });
        }

        else if (req.body.constatare_cabinet == null || req.body.constatare_cabinet == '') {
            res.json({ success: false, message: 'Completeaza Constatare Cabinet' });
        }

        else if (req.body.garantie == null || req.body.garantie == '') {
            res.json({ success: false, message: 'Alege optiune Garantie' });
        }

        else if (req.body.cutie == null || req.body.cutie == '') {
            res.json({ success: false, message: 'Alege optiune Cutie' });
        }

        else if (req.body.baterie == null || req.body.baterie == '') {
            res.json({ success: false, message: 'Alege optiune Baterie' });
        }

        else if (req.body.mulaj == null || req.body.mulaj == '') {
            res.json({ success: false, message: 'Alege optiune Mulaj' });
        }

        else if (req.body.oliva == null || req.body.oliva == '') {
            res.json({ success: false, message: 'Alege optiune Oliva' });
        }

        else if (req.body.u_stanga == null || req.body.u_stanga == '') {
            res.json({ success: false, message: 'Alege optiune Urechea Stanga' });
        }

        else if (req.body.u_dreapta == null || req.body.u_dreapta == '') {
            res.json({ success: false, message: 'Alege optiune Urechea Dreapta' });
        }


        else {
            pacient.save(function (err) {
                if (err) {

                    if (err.errors != null) {
                        if (err.errors.nume) {
                            res.json({ success: false, message: err.errors.nume.message });
                        } else if (err.errors.denumire_aparat) {
                            res.json({ success: false, message: err.errors.denumire_aparat.message });
                        } else if (err.errors.serie_aparat) {
                            res.json({ success: false, message: err.errors.serie_aparat.message });
                        } if (err.errors.defectiune_reclamata) {
                            res.json({ success: false, message: err.errors.defectiune_reclamata.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                    res.json({ succes: false, message: err });
                } else {

                    res.json({ success: true, message: 'Service adaugat cu succes.' });
                }

            });
        }
    });


    // User Registration Route
    router.post('/users', function (req, res) {
        var user = new User();

        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret);

        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == '') {
            res.json({ success: false, message: 'Campurile username, email si parola sunt obligatorii' });

        } else {
            user.save(function (err) {
                if (err) {

                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'Username deja exista' });
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'Adresa email deja exista' });
                            }
                        } else {
                            res.json({ succes: false, message: err });
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Utilizator Adaugat!' });
                }
            });
        }
    });

    // User Login Route
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function (err, user) {
            if (err) {
                throw err;
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Nu s-a putut autentifica utilizatorul' });
                } else if (user) {
                    if (!req.body.password) {
                        res.json({ success: false, message: 'Parola trebuie introdusa' });
                    } else {
                        var validPassword = user.comparePassword(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: 'Parola introdusa nu este corecta' });
                        } else {
                            var token = jwt.sign({ username: user.username, email: user.email }, secret);
                            res.json({ success: true, message: 'Utilizator autentificat', token: token });
                        }
                    }
                }
            }
        });

    });
    router.use(function (req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }

    });


    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    router.put('/api/management/:user', function (req, res, next) {
        var token = req.headers['x-access-token'] || req.session.token;

        User.findById(req.params._id, function (err, user) {
            if (err) {
                res.send(err);
            } else if (user.token != token) {
                res.json({ sucess: false, message: 'User not same as authenticated user.' });
            } else {

                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;

                user.save(function (err) {
                    if (err) res.send(err);

                    res.json({ message: 'User updated.' });
                });
            }
        });
    });

    router.get('/renewToken/:username', function (req, res) {
        User.findOne({ username: req.params.username }).select().exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24H' });
                res.json({ success: true, token: newToken });
            }
        });
    });

    router.get('/permission', function (req, res) {
        User.findOne({ username: req.decoded.username }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                res.json({ success: true, permission: user.permission });
            }

        });
    });
    //Users
    router.get('/manangement', function (req, res) {
        User.find({}, function (err, users) {
            if (err) throw err;
            User.findOne({ username: req.decoded.username }, function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' });
                } else {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator' || mainUser.permission === 'user') {
                        if (!users) {
                            res.json({ success: false, message: 'Users not found' });
                        } else {
                            res.json({ success: true, users: users, permission: mainUser.permission, currentUser: mainUser });
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }
            });
        });
    });
    //End Get Users



    //Pacienti
    router.get('/registru', function (req, res) {
        Pacient.find({}, function (err, pacienti) {
            if (err) throw err;
            else {
                res.json({ success: true, pacienti: pacienti });
            }
        }
        )
    });

    //End Get Pacienti



    //Delete Pacienti
    router.delete('/registru/:id', function (req, res) {
        var deletedPacient = req.params.id;
        Pacient.findOne({ username: req.body._id }, function (err, mainUser) {
            if (err) {
                res.json({ success: false, message: 'Nu s-a putut salva' });
            }
            else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Nu ai permisiune' });
                } else {
                    Pacient.findOneAndRemove({ name: deletedPacient }, function (err, pacient) {
                        if (err) throw err;
                        res.json({ success: true });
                    });
                }
            }
        });
    });


    //Begin Get Edit Pacient    
    router.get('/editPacient/:id', function (req, res) {
        var editPacient = req.params.id;

        Pacient.findOne({ username: req.body._id }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' });
            } else {
                Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                    if (err) throw err;
                    if (!pacient) {
                        res.json({ success: false, message: 'No user found' });
                    } else {
                        res.json({ success: true, pacient: pacient });

                    }
                });
            }
        });
    });
    //End Get Edit Pacient

    //Begin Update Pacient

    router.put('/editPacient', function (req, res) {
        var editPacient = req.body._id;

        if (req.body.nume) var newNume = req.body.nume;
        if (req.body.denumire_aparat) var newDenumire_Aparat = req.body.denumire_aparat;
        if (req.body.cabinet) var newCabinet = req.body.cabinet;
        if (req.body.serie_aparat) var newSerie_Aparat = req.body.serie_aparat;
        if (req.body.defectiune_reclamata) var newDefectiune_Reclamata = req.body.defectiune_reclamata;
        if (req.body.constatare_cabinet) var newConstatare_Cabinet = req.body.constatare_cabinet;
        if (req.body.completare_cabinet) var newCompletare_Cabinet = req.body.completare_cabinet;
        if (req.body.observatii_cabinet) var newObservatii_Cabinet = req.body.observatii_cabinet;
        if (req.body.observatii_pacient) var newObservatii_Pacient = req.body.observatii_pacient;
        if (req.body.iesit_cabinet) var newIesit_Cabinet = new moment().format('DD/MM/YYYY HH:mm');
        if (req.body.intrat_cabinet) var newIntrat_Cabinet = new moment().format('DD/MM/YYYY HH:mm');
        if (req.body.predat_pacient) var newPredat_Pacient = new moment().format('DD/MM/YYYY HH:mm');

        if (req.body.log_sosit) var newLog_Sosit = new moment().format('DD/MM/YYYY HH:mm');
        if (req.body.log_plecat) var newLog_Plecat = new moment().format('DD/MM/YYYY HH:mm');
        if (req.body.log_preluat) var newLog_Preluat = new moment().format('DD/MM/YYYY HH:mm');
        if (req.body.log_trimis) var newLog_Trimis = new moment().format('DD/MM/YYYY HH:mm');


        if (req.body.email) var newEmail = req.body.email;

        Pacient.findOne({ username: req.body.username }, function (err, mainUser) {
            if (err) throw err;
            else {



                if (newLog_Trimis) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient || pacient.log_trimis !== 'nespecificat') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        } else {
                            pacient.log_trimis = newLog_Trimis;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    });
                }

                if (newLog_Preluat) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient || pacient.log_preluat !== 'nespecificat') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        } else {
                            pacient.log_preluat = newLog_Preluat;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    });
                }


                if (newLog_Plecat) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient || pacient.log_plecat !== 'nespecificat') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        } else {
                            pacient.log_plecat = newLog_Plecat;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    });
                }


                if (newLog_Sosit) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient || pacient.log_sosit !== 'nespecificat') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        } else {
                            pacient.log_sosit = newLog_Sosit;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    });
                }


                if (newIesit_Cabinet) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient || pacient.iesit_cabinet !== 'nespecificat') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        } else {
                            pacient.iesit_cabinet = newIesit_Cabinet;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    });
                }


                if (newIntrat_Cabinet) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient || pacient.intrat_cabinet !== 'nespecificat') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        } else {
                            pacient.intrat_cabinet = newIntrat_Cabinet;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    });
                }

                if (newPredat_Pacient) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient || pacient.predat_pacient !== 'nespecificat') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        } else {
                            pacient.predat_pacient = newPredat_Pacient;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    });
                }

                if (newCompletare_Cabinet) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        else {
                            pacient.completare_cabinet = newCompletare_Cabinet;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Completare adaugata cu succes' });
                                }
                            });
                        }
                    });
                }



                if (newEmail) {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient) {
                            res.json({ success: false, message: 'No user found' });
                        } else {
                            pacient.email = newEmail;
                            pacient.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Email  a fost modificat' });
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    //End Update Pacient

    router.delete('/management/:username', function (req, res) {
        var deletedUser = req.params.username;
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficient Permissions' });
                } else {
                    User.findOneAndRemove({ username: deletedUser }, function (err, user) {
                        if (err) throw err;
                        res.json({ success: true });
                    });
                }
            }
        });
    });


    //Begin Get Edit User    
    router.get('/edit/:id', function (req, res) {
        var editUser = req.params.id;
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' });
            } else {
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    User.findOne({ _id: editUser }, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message: 'No user found' });
                        } else {
                            res.json({ success: true, user: user });
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permissions' });
                }
            }
        });
    });
    //End Get Edit User

    //Begin Put Edit User
    router.put('/edit', function (req, res) {
        var editUser = req.body._id;
        if (req.body.name) var newName = req.body.name;
        if (req.body.username) var newUsername = req.body.username;
        if (req.body.email) var newEmail = req.body.email;
        if (req.body.permission) var newPermission = req.body.permission;
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' });
            } else {
                if (newName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found' });
                            } else {
                                user.name = newName;
                                user.save(function (err) {
                                    if (err) {
                                        res.json({ success: false, message: 'Nu s-a putut salva' });
                                    } else {
                                        res.json({ success: true, message: 'Name has been updated!' });
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }

                if (newUsername) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found' });
                            } else {
                                user.username = newUsername;
                                user.save(function (err) {
                                    if (err) {
                                        res.json({ success: false, message: 'Nu s-a putut salva' });
                                    } else {
                                        res.json({ success: true, message: 'Username has been updated!' });
                                    }
                                });
                            }
                        });

                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }

                if (newEmail) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found' });
                            } else {
                                user.email = newEmail;
                                user.save(function (err) {
                                    if (err) {
                                        res.json({ success: false, message: 'Nu s-a putut salva' });
                                    } else {
                                        res.json({ success: true, message: 'Email has been updated!' });
                                    }
                                });
                            }
                        });

                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }
                if (newPermission) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found' });
                            } else {
                                if (newPermission === 'user') {
                                    if (user.permission === 'admin') {
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' });
                                        } else {
                                            user.permission = newPermission;
                                            user.save(function (err) {
                                                if (err) {
                                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                                } else {
                                                    res.json({ success: true, message: 'Permissions updated!' });
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                res.json({ success: false, message: 'Nu s-a putut salva' });
                                            } else {
                                                res.json({ success: true, message: 'Permissions updated!' });
                                            }
                                        });
                                    }
                                }
                                if (newPermission === 'moderator') {
                                    if (user.permission === 'admin') {
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' });
                                        } else {
                                            user.permission = newPermission;
                                            user.save(function (err) {
                                                if (err) {
                                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                                } else {
                                                    res.json({ success: true, message: 'Permissions updated!' });
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                res.json({ success: false, message: 'Nu s-a putut salva' });
                                            } else {
                                                res.json({ success: true, message: 'Permissions updated!' });
                                            }
                                        });
                                    }
                                }
                                if (newPermission === 'admin') {
                                    if (mainUser.permission === 'admin') {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                res.json({ success: false, message: 'Nu s-a putut salva' });
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' });
                                            }
                                        });
                                    } else {
                                        res.json({ success: false, message: 'Insufficient permissions. You must be an admin to upgrade someone to admin level' });
                                    }
                                }
                            }
                        });

                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }
            }
        });
    });
    //End Put User Edit
    return router;
};

var User = require('../models/user');
var Pacient = require('../models/pacient');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';



module.exports = function (router) {

    // Pacient Registration Route

    var pacientiRoute = router.route('/pacienti');

    pacientiRoute.post(function (req, res) {
        var pacient = new Pacient();

        pacient.postedBy = req.body.postedBy;
        pacient.name = req.body.name;
        pacient.cabinet = req.body.cabinet;
        pacient.email = req.body.email;

        if (req.body.name == null || req.body.name == '') {
            res.json({ success: false, message: 'Completeaza Numele' });
        } else {
            pacient.save(function (err) {
                if (err) {
                    res.send('Eroare.');
                } else {

                    res.status(200);
                    res.redirect('/registru');
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
            res.json({ success: false, message: 'Ensure username, email and password were provided' });

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
                                res.json({ success: false, message: 'That Username is already taken' });
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That Email is already taken' });
                            }
                        } else {
                            res.json({ succes: false, message: err });
                        }
                    }
                } else {
                    res.json({ success: true, message: 'user created!' });
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
                    res.json({ success: false, message: 'Could not authenticate user' });
                } else if (user) {
                    if (!req.body.password) {
                        res.json({ success: false, message: 'No password Provided' });
                    } else {
                        var validPassword = user.comparePassword(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: 'Could not authenticate passwordsd' });
                        } else {
                            var token = jwt.sign({ username: user.username, email: user.email }, secret);
                            res.json({ success: true, message: 'User authenticated!', token: token });
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
            Pacient.findOne({ username: req.body._id }, function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: 'No pacient found' });
                } else {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        if (!pacienti) {
                            res.json({ success: false, message: 'Pacienti not found' });
                        } else {
                            res.json({ success: true, pacienti: pacienti, permission: mainUser.permission });
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }
            });
        });
    });
    //End Get Pacienti

    //Delete Pacienti
    router.delete('/registru/:id', function (req, res) {
        var deletedPacient = req.params.id;
        Pacient.findOne({ username: req.body._id }, function (err, mainUser) {
            if (err) {
                console.log(err);
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
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                        if (err) throw err;
                        if (!pacient) {
                            res.json({ success: false, message: 'No user found' });
                        } else {
                            res.json({ success: true, pacient: pacient });

                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permissions' });
                }
            }
        });
    });
    //End Get Edit Pacient

    //Begin Update Pacient

    router.put('/editPacient', function (req, res) {
        var editPacient = req.body._id;
        if (req.body.cabinet) var newCabinet = req.body.cabinet;
        if (req.body.name) var newName = req.body.name;
        if (req.body.email) var newEmail = req.body.email;

        Pacient.findOne({ username: req.body.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' });
            } else {
                if (newName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                            if (err) throw err;
                            if (!pacient) {
                                res.json({ success: false, message: 'No user found' });
                            } else {
                                pacient.name = newName;
                                pacient.save(function (err) {
                                    if (err) {
                                        console.log(err);
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

                if (newCabinet) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                            if (err) throw err;
                            if (!pacient) {
                                res.json({ success: false, message: 'No user found' });
                            } else {
                                pacient.cabinet = newCabinet;
                                pacient.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: 'Cabinet has been updated!' });
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
                        Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                            if (err) throw err;
                            if (!pacient) {
                                res.json({ success: false, message: 'No user found' });
                            } else {
                                pacient.email = newEmail;
                                pacient.save(function (err) {
                                    if (err) {
                                        console.log(err);
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
                                        console.log(err);
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
                                        console.log(err);
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
                                        console.log(err);
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
                                                    console.log(err);
                                                } else {
                                                    res.json({ success: true, message: 'Permissions updated!' });
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err);
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
                                                    console.log(err);
                                                } else {
                                                    res.json({ success: true, message: 'Permissions updated!' });
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err);
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
                                                console.log(err);
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

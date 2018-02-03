var User = require('../models/user');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer'); 
var secret = 'kapil';

module.exports = function (router) {


  var client = nodemailer.createTransport({
    host: '127.0.0.1',
    port: '1025',
    ignoreTLS: true,
    secure: false
  });


// user reegistration
  router.post('/users', function (req,res) {
      var user = new User();
        console.log(req.body);
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });

    if (req.body.firstname == '' || req.body.firstname == null || req.body.lastname == '' || req.body.lastname == null || req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == '' || req.body.email == null){
          res.json({success: false, message: 'Ensure username email and password'});
      }
      else {
        user.save(function(err) {
          if (err) {
            if (err.errors !== null) {
              console.log(err)
              if (err.errors.firstname) {
                res.json({ success: false, message: err.errors.firstname.message }); 
              }
              else if (err.errors.lastname) {
                res.json({ success: false, message: err.errors.lastname.message }); 
              } else if (err.errors.email) {
                res.json({ success: false, message: err.errors.email.message }); 
              } else if (err.errors.username) {
                res.json({ success: false, message: err.errors.username.message });
              } else if (err.errors.password) {
                res.json({ success: false, message: err.errors.password.message }); 
              } else {
                res.json({ success: false, message: err });
              }
            } else if (err) {
              if (err.code == 11000) {
                if (err.errmsg[61] == "u") {
                  res.json({ success: false, message: 'That username is already taken' }); 
                } else if (err.errmsg[61] == "e") {
                  res.json({ success: false, message: 'That e-mail is already taken' });
                }
              } else {
                res.json({ success: false, message: err })
              }
            }
          }
          else {
            var email = {
              from: 'kapil@gmail.com',
              to: [user.email, 'kapil@gmail.com'],
              subject: 'Your Activation Link',
              text: 'Hello ' + user.firstname + ' '+ user.lastname + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8000/activate/' + user.temporarytoken,
              html: 'Hello<strong> ' + user.firstname + ' ' + user.lastname + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8000/activate/' + user.temporarytoken + '">http://localhost:8000/activate/</a>'
            };
          client.sendMail(email, function (err, info) {
              if (err) {
                console.log(err); 
              } else {
                console.log(info); 
                console.log(user.email); 
              }
            });
            res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link'});
          }
        });
      }
  });
 
  router.post('/checkusername', function (req, res) {
    User.findOne({ username: req.body.username }).select('username').exec(function (err, user) {
      if (err) {
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        if (user) {
          res.json({ success: false, message: 'That username is already taken' }); 
                } else {
          res.json({ success: true, message: 'Valid username' }); 
        }
      }
    });
  });

  router.post('/checkemail', function (req, res) {
    User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
      if (err) {
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        if (user) {
          res.json({ success: false, message: 'That e-mail is already taken' });
        } else {
          res.json({ success: true, message: 'Valid e-mail' }); 
        }
      }
    });
  });

  router.post('/authenticate', function(req, res){
      User.findOne({ username: req.body.username },'email username password active').exec(function(err,user){
        if(!user)
        {
          res.json ({success: false, message: 'Could not authenticate user'});
        }
        else 
        {
          if (req.body.password)
           {
            var validPassword = user.comparePassword(req.body.password);
                if(!validPassword)
                {
                  res.json({success: false, message: 'Could not authenticate user'});
                } else if (!user.active) {
                  res.json({ success: false, message: 'Account is not yet activated. Please check your e-mail for activation link.', expired: true }); // Account is not activated 
                } else {
                  var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Logged in: Give user token
                  res.json({ success: true, message: 'User authenticated!', token: token }); // Return token in JSON object to controller
                  console.log(token);
                }
                 
          }
          else 
          {
              res.json({success: false, message: 'No password provided'});
          }
        }
      });
  });

  router.put('/activate/:token', function (req, res) {
    User.findOne({ temporarytoken: req.params.token }, function (err, user) {
      if (err) {
        var email = {
          from: 'demo mean, kapil@zoho.com',
          to: 'kapil@gmail.com',
          subject: 'Error Logged',
          text: 'The following error has been reported in the MEAN Stack Application: ' + err,
          html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
        };
        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(err); 
          } else {
            console.log(info); 
            console.log(user.email); 
          }
        });
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        var token = req.params.token; 
        jwt.verify(token, secret, function (err, decoded) {
          if (err) {
            res.json({ success: false, message: 'Activation link has expired.' });
          } else if (!user) {
            res.json({ success: false, message: 'Activation link has expired.' });
          } else {
            user.temporarytoken = false; 
            user.active = true; 
            user.save(function (err) {
              if (err) {
                console.log(err); 
              } else {
                var email = {
                  from: 'demo, kapil@gmail.com',
                  to: user.email,
                  subject: 'Account Activated',
                  text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                  html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                };
                client.sendMail(email, function (err, info) {
                  if (err) console.log(err);                 });
                res.json({ success: true, message: 'Account activated!' }); 
              }
            });
          }
        });
      }
    });
  });

  router.post('/resend', function (req, res) {
    User.findOne({ username: req.body.username }).select('username password active').exec(function (err, user) {
      if (err) {
        var email = {
          from: 'demo mean, kapil@zoho.com',
          to: 'kapil@gmail.com',
          subject: 'Error Logged',
          text: 'The following error has been reported in the MEAN Stack Application: ' + err,
          html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
        };
        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
            console.log(user.email);
          }
        });
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        if (!user) {
          res.json({ success: false, message: 'Could not authenticate user' });
        } else if (user) {
          
          if (req.body.password) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
              res.json({ success: false, message: 'Could not authenticate password' }); 
            } else if (user.active) {
              res.json({ success: false, message: 'Account is already activated.' }); 
            } else {
              res.json({ success: true, user: user });
            }
          } else {
            res.json({ success: false, message: 'No password provided' });
          }
        }
      }
    });
  });

  router.put('/resend', function (req, res) {
    User.findOne({ username: req.body.username }).select('username name email temporarytoken').exec(function (err, user) {
      if (err) {
        var email = {
          from: 'kapil@gmail.com',
          to: [user.email, 'kapil@gmail.com'],
          subject: 'Your Activation Link',
          text: 'Hello ' + user.firstname + ' ' + user.lastname + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8000/activate/' + user.temporarytoken,
          html: 'Hello<strong> ' + user.firstname + ' ' + user.lastname + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8000/activate/' + user.temporarytoken + '"> http://localhost:8000/activate/</a>'
        };
        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
            console.log(user.email);
          }
        });
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Give the user a new token to reset password
        user.save(function (err) {
          if (err) {
            console.log(err);
          } else {
         var email = {
              from: 'MEAN Stack Staff, cruiserweights@zoho.com',
              to: user.email,
              subject: 'Activation Link Request',
           text: 'Hello ' + user.name + ', You recently requested a new account activation link. Please click on the following link to complete your activation:  http://localhost:8000/activate/' + user.temporarytoken,
           html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8000/activate/' + user.temporarytoken + '"> http://localhost:8000/activate/</a>'
            };
            client.sendMail(email, function (err, info) {
              if (err) console.log(err); 
           });
            res.json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' }); 
          }
        });
      }
    });
  });

  router.get('/resetusername/:email', function (req, res) {
    User.findOne({ email: req.params.email }).select('email name username').exec(function (err, user) {
      if (err) {
        res.json({ success: false, message: err }); 
      } else {
        if (!user) {
          res.json({ success: false, message: 'E-mail was not found' }); 
        } else {

          var email = {
            from: 'kapil, kail@kapil.com',
            to: user.email,
            subject: 'Localhost Username Request',
            text: 'Hello ' + user.name + ', You recently requested your username. Please save it in your files: ' + user.username,
            html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested your username. Please save it in your files: ' + user.username
          };

          
          client.sendMail(email, function (err, info) {
            if (err) {
              console.log(err); 
            } else {
              console.log(info); 
            }
          });
          res.json({ success: true, message: 'Username has been sent to e-mail! ' }); 
        }
      }
    });
  });

  router.put('/resetpassword', function (req, res) {
    User.findOne({ username: req.body.username }).select('username active email resettoken name').exec(function (err, user) {
      if (err) {
      
        var email = {
          from: 'angular one demo, kapil@hapil.com',
          to: 'kapil@gmail.com',
          subject: 'Error Logged',
          text: 'The following error has been reported in the MEAN Stack Application: ' + err,
          html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
        };
     
        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(err); 
          } else {
            console.log(info);
            console.log(user.email); 
          }
        });
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        if (!user) {
          res.json({ success: false, message: 'Username was not found' }); 
        } else if (!user.active) {
          res.json({ success: false, message: 'Account has not yet been activated' }); 
        } else {
          user.resettoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
          user.save(function (err) {
            if (err) {
              res.json({ success: false, message: err });
            } else {
              var email = {
                from: 'angulrone demo, kapil@lkapil.com',
                to: user.email,
                subject: 'Reset Password Request',
                text: 'Hello ' + user.name + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:8000/reset/' + user.resettoken,
                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:8000/reset/' + user.resettoken + '">http://localhost:8000/reset/</a>'
              };
              
              client.sendMail(email, function (err, info) {
                if (err) {
                  console.log(err); 
                } else {
                  console.log(info); 
                  console.log('sent to: ' + user.email);
                }
              });
              res.json({ success: true, message: 'Please check your e-mail for password reset link' }); 
            }
          });
        }
      }
    });
  });

  router.get('/resetpassword/:token', function (req, res) {
    User.findOne({ resettoken: req.params.token }).select().exec(function (err, user) {
      if (err) {

        var email = {
          from: 'angular one demo app, kapil@gapil.com',
          to: 'kapil@gmail.com',
          subject: 'Error Logged',
          text: 'The following error has been reported in the MEAN Stack Application: ' + err,
          html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
        };
     
        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(err); 
          } else {
            console.log(info); 
            console.log(user.email); 
          }
        });
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        var token = req.params.token; 
        jwt.verify(token, secret, function (err, decoded) {
          if (err) {
            res.json({ success: false, message: 'Password link has expired' });
          } else {
            if (!user) {
              res.json({ success: false, message: 'Password link has expired' }); 
            } else {
              res.json({ success: true, user: user }); 
            }
          }
        });
      }
    });
  });

  router.put('/savepassword', function (req, res) {
    User.findOne({ username: req.body.username }).select('username email name password resettoken').exec(function (err, user) {
      if (err) {
        
        var email = {
          from: 'kapil, kapil@kapil.com',
          to: 'kapil@gmail.com',
          subject: 'Error Logged',
          text: 'The following error has been reported in the MEAN Stack Application: ' + err,
          html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
        };
        
        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(err); 
          } else {
            console.log(info); 
            console.log(user.email); 
          }
        });
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        if (req.body.password === null || req.body.password === '') {
          res.json({ success: false, message: 'Password not provided' });
        } else {
          user.password = req.body.password; 
          user.resettoken = false;  
          user.save(function (err) {
            if (err) {
              res.json({ success: false, message: err });
            } else {
              
              var email = {
                from: 'angular one, kapil@kapil.com',
                to: user.email,
                subject: 'Password Recently Reset',
                text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at localhost.com',
                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
              };
              
              client.sendMail(email, function (err, info) {
                if (err) console.log(err); 
              });
              res.json({ success: true, message: 'Password has been reset!' }); 
            }
          });
        }
      }
    });
  });   
  
  router.use(function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    console.log(token);
    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          console.log(err);
          res.json({ success: false, message: 'Token invalid' });
        }
        else {
          req.decoded = decoded;
          next();
        }
      });
    }
    else {
      res.send({ success: false, message: 'No token provided' });
    }
  });

  router.get('/renewToken/:username', function (req, res) {
    User.findOne({ username: req.params.username }).select('username email').exec(function (err, user) {
      if (err) {
        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
        var email = {
          from: 'MEAN Stack Staff, cruiserweights@zoho.com',
          to: 'gugui3z24@gmail.com',
          subject: 'Error Logged',
          text: 'The following error has been reported in the MEAN Stack Application: ' + err,
          html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
        };
        // Function to send e-mail to myself
        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(err); // If error with sending e-mail, log to console/terminal
          } else {
            console.log(info); // Log success message to console if sent
            console.log(user.email); // Display e-mail that it was sent to
          }
        });
        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
      } else {
        // Check if username was found in database
        if (!user) {
          res.json({ success: false, message: 'No user was found' }); // Return error
        } else {
          var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Give user a new token
          res.json({ success: true, token: newToken }); // Return newToken in JSON object to controller
        }
      }
    });
  });



  router.post('/me', function(req,res){
          res.send(req.decoded);
  });

  
  return router;
}
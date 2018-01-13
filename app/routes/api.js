var User = require('../models/user');
var jwt = require('jsonwebtoken');

module.exports = function (router) {

// user reegistration
  router.post('/users', function (req,res) {
      var user = new User();
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      if(req.body.username == null || req.body.password == null || req.body.email == '' || req.body.email == null){
          res.json({success: false, message: 'Ensure username email and password'});
      }
      else {
        user.save(function(err) {
          if (err){
            res.json({success: false, message: 'User name or email is already exists'});
          }
          else {
            res.json({success: true, message: 'user created'});
          }
        });
      }
  });
  // user login route
  router.post('/authenticate', function(req, res){
      User.findOne({ username: req.body.username },'email username password').exec(function(err,user){
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
                }
                else
                {
                  var token = jwt.sign({username: user.username, email: user.email},'secret',{expiresIn: '24h'});
                  res.json({success: true, message: 'user authenticated',token: token });
                }
          }
          else 
          {
              res.json({success: false, message: 'No password provided'});
          }
        }
      });
  });



  router.use(function(req,res,next){
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if(token){
      jwt.verify(token,'secret', function(err, decoded){
        if (err) 
        {
          res.join({success: false, message: 'Token invalid'});
        }
        else
        {
          req.decoded = decoded;
          next();
        }
      });
    }
    else{
      res.send({success:false, message: 'No token provided'});
    }
  });

  router.post('/me', function(req,res){
          res.send(req.decoded);
  });

  

  return router;
}

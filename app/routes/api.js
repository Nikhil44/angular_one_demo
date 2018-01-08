var User = require('../models/user');
module.exports = function (router) {
  router.post('/users', function (req,res) {
      var user = new User();
      console.log(req.body);
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
  return router;
}

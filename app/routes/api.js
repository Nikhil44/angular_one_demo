var User = require('../models/user');
module.exports = function (router) {
  router.post('/users', function (req,res) {
      var user = new User();
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      if(req.body.username == null || req.body.password == null || req.body.email == '' || req.body.email == null){
          res.send('Ensure username email and password');
      }
      else {
        user.save(function(err) {
          if (err){
            res.send('User name or email is already exists');
          }
          else {
            res.send('user created');
          }
        });
      }
  });
  return router;
}

module.exports = function(User) {
  User.beforeRemote('create', function (ctx, unused, next) {
    var credentials = ctx.req.body
    User.findOne({where:{realm:credentials.realm, username:credentials.username}}, function (err, user) {
      if(user) {
        console.log(user, credentials)
        err = new Error('username already exist')
        err.status = 400
        next(err)
      } else {
        next()
      }
    })
  })
};

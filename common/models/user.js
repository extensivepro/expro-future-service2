module.exports = function(User) {
  
  User.beforeCreate = function (next, user) {
    
    User.findOne({where:{and:[{realm:user.realm}, {username:user.username}]}}, function (err, theUser) {
      if(theUser && theUser.realm === user.realm) {
        err = new Error('username already exist')
        err.status = 400
        next(err)
      } else {
        var now = Date.now()
        user.created = user.created||now
        user.lastUpdated = user.lastUpdated||now
        user.status = 'active'
        next()
      }
    })
  }
};

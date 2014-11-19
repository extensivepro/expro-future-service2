module.exports = function(Member) {
  
  Member.beforeRemote('create', function (ctx, unused, next) {
    if (ctx.req.accessToken) {
      Member.app.models.User.findOne({where:{id:ctx.req.accessToken.userId}, include:{employe:'merchant'}}, function (err, user) {
        var employe = user.employe()
        if (employe.merchantID != ctx.req.body.merchantID) {
          var error = new Error('forbidden, should not add member of other merchant')
          error.status = 403
          next(error)
        } else {
          ctx.req.body.merchant = {
            merchantID: employe.merchantID,
            "name": employe.merchant().name,
            fullName: employe.merchant().fullName
          }
          next()
        }
      })
    } else {
      var error = new Error('unauthorized, must be logged in to create merchant')
      error.status = 401
      next(error)
    }
  })
  
  Member.beforeCreate = function (next, member) {
    var now = Math.floor(Date.now()/1000)
    member.createdAt = now
    member.sinceAt = now
    member.dueAt = member.dueAt || now + 31536000
    member.level = member.level || 'VIP'
    member.postPoint = 0
    member.postTotalPoint = 0
    member.status = 'active'
    member.updateAt = now
    next()
  }
  
  Member.afterCreate = function (next) {
    var member = this
    Member.app.models.Account.create({ownerID:member.id}, function (error, account) {
      member.account = account
      member.save()
      next()
    })
  }
  
}

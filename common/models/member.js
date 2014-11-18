module.exports = function(Member) {
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

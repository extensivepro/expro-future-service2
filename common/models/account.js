module.exports = function(Account) {
  Account.beforeCreate = function (next, account) {
    var now = Math.floor(Date.now()/1000)
    account.createdAt = now*1000
    account.updateAt = now
    account.type = account.type || 'member'
    account.balance = account.balance || 0
    next()
  }
};

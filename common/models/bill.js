module.exports = function(Bill) {
	
  Bill.beforeCreate = function (next, bill) {
    var now = Math.floor(Date.now()/1000)
    bill.createdAt = bill.createdAt || now
    if(!bill.discountAmount) bill.discountAmount = 0
    next()
  }
  
  var settle = function (account, amount, next) {
    Bill.app.models.Account.findById(account.id, function (err, account) {
      if(err) return next(err)
      account.balance += amount;
      account.save()
      Bill.app.models.Member.update({"account.id": account.id}, {account: account}, next)
    })
    
  }
  
  Bill.afterCreate = function (next) {
    
    if(this.memberSettlement) {
      if(this.memberSettlement.payeeAccount) {
        settle(this.memberSettlement.payeeAccount, this.memberSettlement.amount, next)
      } else if(this.memberSettlement.payerAccount) {
        settle(this.memberSettlement.payerAccount, 0-this.memberSettlement.amount, next)
      } else {
        next()
      }
    } else {
      next()
    }
  }
};

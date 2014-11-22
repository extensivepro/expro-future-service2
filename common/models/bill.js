module.exports = function(Bill) {

  Bill.beforeCreate = function (next, bill) {
    var now = Math.floor(Date.now()/1000)
    bill.createdAt = now
    next()
  }
  
  Bill.afterCreate = function (next) {
    
    if(this.memberSettlement) {
      var Account = Bill.app.models.Account
      if(this.memberSettlement.payeeAccount) {
        Account.findById({id:this.memberSettlement.payeeAccount.id}, function (err, account) {
          if(err) return next(err)
          account.balance += this.memberSettlement.amount;
          account.save()
          next()
        })
      } else if(this.memberSettlement.payerAccount) {
        Account.findById({id:this.memberSettlement.payerAccount.id}, function (err, account) {
          if(err) return next(err)
          account.balance -= this.memberSettlement.amount;
          account.save()
          next()
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
};

module.exports = function(Bill) {
	
  Bill.beforeCreate = function (next, bill) {
    if(bill.amount <= 0) {
      var error = new Error('Bad bill, bill amount can not be 0')
      error.status = 400
      return next(error)
    }
    var now = Math.floor(Date.now()/1000)
    bill.createdAt = bill.createdAt || now
    if(!bill.discountAmount) bill.discountAmount = 0

    checkBalance(bill.memberSettlement, next)
  }
  
  var checkBalance = function (settlement, next) {
    
    if(!(settlement && settlement.payerAccount)) return next()
    
    var account = settlement.payerAccount
    
    Bill.app.models.Account.findById(account.id, function (err, account) {
      if(err) return next(err)
      
      if(account.balance < settlement.amount) {
        err = new Error('Bad bill, not sufficient funds of member balance')
        err.status = 400
        return next(err)
      }
      
      next()
    })
  }
  
  var settleWithMember = function (settlement, next) {
    
    if(!settlement) return next()
      
    var amount = settlement.amount    
    var account = settlement.payerAccount
    
    if(account) {
      amount = 0-amount
    } else {
      account = settlement.payeeAccount
    }

    Bill.app.models.Account.findById(account.id, function (err, account) {
      if(err) return next(err)
      account.balance += amount
      account.save()
      Bill.app.models.Member.update({"account.id": account.id}, {account: account}, function (err, count) {
        next(err)
      })
    })

  }
  
  Bill.afterCreate = function (next) {
    settleWithMember(this.memberSettlement, next)
  }

};

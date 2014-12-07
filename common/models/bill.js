module.exports = function(Bill) {

	Bill.beforeRemote('**', function (ctx, bill, next) {
		console.log(ctx.methodString, 'was invoked remotely')
		console.log(ctx.args,'=====')
		if(ctx.req.accessToken) {
      Bill.app.models.User.findOne({where:{id:ctx.req.accessToken.userId}, include:{employe:'merchant'}}, function (err, user) {
        var employe = user.employe();
				ctx.args.filter = ctx.args.filter || '{}'
				var filter = JSON.parse(ctx.args.filter)
				console.log(ctx.args)
				filter.where = {merchantID: employe.merchantID}
				ctx.args.filter = JSON.stringify(filter)
				console.log(ctx.args)
				next()
			})
		} else {
      var error = new Error('unauthorized, unkonwn employe.')
      error.status = 401
			next(error)
		}
	})
	
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

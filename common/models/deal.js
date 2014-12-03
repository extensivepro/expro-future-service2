module.exports = function(Deal) {

  Deal.beforeRemote('create', function (ctx, unused, next) {
    var bill = ctx.req.body.bill
    if(!bill) {
      var error = new Error('Bad parameter, deal should have bill')
      error.status = 400
      return next(error)
    }
    Deal.app.models.Bill.create(bill, function (error, bill) {
      if(error) return next(error)
      ctx.req.body.billID = bill.id.toString()
      next()
    })
  })

  Deal.beforeCreate = function (next, deal) {
    var now = Math.floor(Date.now()/1000)
    deal.createdAt = deal.createdAt || now
    deal.serialNumber = deal.serialNumber || Date.now()
    next()
  }
  
  Deal.afterCreate = function (next) {
    Deal.app.models.Bill.update({id: this.billID}, {dealID: this.id.toString()}, function (error, count) {
      next(error)
    })
  }
};

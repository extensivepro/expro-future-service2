module.exports = function(Deal) {

  Deal.beforeRemote('create', function (ctx, unused, next) {
    if(!ctx.req.body.bill) {
      var error = new Error('Bad parameter, deal should have bill')
      error.status = 400
      return next(error)
    }
    next()
  })

  Deal.beforeCreate = function (next, deal) {
    var now = Math.floor(Date.now()/1000)
    deal.createdAt = deal.createdAt || now
    deal.serialNumber = deal.serialNumber || Date.now()
    next()
  }
};

module.exports = function(Merchant) {
  
  Merchant.beforeCreate = function (next, merchant) {
    Merchant.findOne({
      where: {
        or:[
          {masterPhone: merchant.masterPhone},
          {"name": merchant.name},
          {fullName:merchant.fullName}
        ]
      }
    }, function (err, theMerchant) {
      if(theMerchant) {
        err = new Error('merchant masterPhone, name or fullName already exist')
        err.status = 400
        next(err)
      } else {
        var now = Math.floor(Date.now()/1000)
        merchant.createdAt = now
        merchant.updateAt = now
        merchant.status = 'open'
        next()
      }
    })
  }

  Merchant.afterCreate = function (next) {
    var merchant = this
    Merchant.app.models.Shop.create({
      merchantID: merchant.id, 
      "name": "总店", 
      code: "10001", 
      telephone:merchant.telephone
    }, function (error, shop) {
      if(error) return next(error)
      
      merchant.shopIDs = [shop.id]
      merchant.save()
      
      Merchant.app.models.Employe.create({
        merchantID: merchant.id,
        shopID: shop.id,
        "name": "店长", 
        jobNumber: 1, 
        role: "shopManager",
        phone: merchant.telephone
      }, function (error, employe) {
        if (error) return next(error)
        
        Merchant.app.models.user.create({
          realm: 'employe.'+merchant.masterPhone,
          username: employe.phone,
          password: "123456",
          email: employe.phone+'@example.com'
        }, function (error, user) {
          next(error)
        })
        
      })
    })
  }
};

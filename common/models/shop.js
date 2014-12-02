module.exports = function(Shop) {
  
  Shop.beforeCreate = function (next, shop) {
    var now = Math.floor(Date.now()/1000)
    shop.createdAt = shop.createdAt||now
    shop.updateAt = shop.createdAt||now
    shop.status = 'open'
    next()
  }

};

module.exports = function(Shop) {
  
  Shop.beforeCreate = function (next, shop) {
    var now = Math.floor(Date.now()/1000)
    shop.createdAt = now
    shop.updateAt = now
    shop.status = 'open'
    next()
  }

};

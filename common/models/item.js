module.exports = function(Item) {
  
  Item.beforeCreate = function (next, item) {
    var now = Math.floor(Date.now()/1000)
    item.createdAt = item.createdAt||now
    item.status = 'sale'
    item.lastStatusModifiedAt = item.lastStatusModifiedAt||now
    next()
  }
  
};

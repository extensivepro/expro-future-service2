module.exports = function(Item) {
  
  Item.beforeCreate = function (next, member) {
    var now = Math.floor(Date.now()/1000)
    member.createdAt = now
    member.status = 'sale'
    member.lastStatusModifiedAt = now
    next()
  }
  
};

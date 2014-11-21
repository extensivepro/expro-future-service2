module.exports = function(Bill) {

  Bill.afterCreate = function (next) {
    
    if(this.memberSettlement) {
      // if(this.memberSettlement.payeeAccount)
      // Bill.app.models.Account.update({id:this.memberSettlement.payeeAccount.id}, {balance:this.memberSettlement.amount})
    }
    next()
  }
};

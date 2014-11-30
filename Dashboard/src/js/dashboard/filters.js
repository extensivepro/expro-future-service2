app
.filter("dateFormat", function () {
  return function (date, format) {
    format = format || 'YYYY-MM-DD HH:mm:ss'
    return moment.unix(date).format(format)
  }
})

.filter("billOwner", function () {
  return function (settlement) {
    var owner = '走入客户'
    if(settlement && settlement.payeeAccount) {
      owner = settlement.payeeAccount.name
    } else if(settlement && settlement.payerAccount) {
      owner = settlement.payerAccount.name
    }
    return owner
  }
})

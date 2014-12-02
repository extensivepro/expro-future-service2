module.exports = function(Employe) {
  
  Employe.beforeCreate = function (next, employe) {
    Employe.findOne({
      where: {
        or:{
          and:[
            {phone: employe.phone},
            {merchantID: employe.merchantID}
          ],
          jobNumber: employe.jobNumber
        }
      }
    }, function (err, theEmploye) {
      if(theEmploye) {
        err = new Error('Duplicated, employe jobNumber or phone already exist in merchant')
        err.status = 400
        next(err)
      } else {
        var now = Math.floor(Date.now()/1000)
        employe.createdAt = employe.createdAt||now
        employe.updateAt = employe.updateAt||now
        employe.status = 'active'
        next()
      }
    })
  }
};

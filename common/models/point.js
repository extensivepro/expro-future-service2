module.exports = function(Point) {

  Point.beforeCreate = function (next, point) {
    Point.app.models.member.findById( point.memberID, function (err, member) {
      if(err) {
        next(err)
      } else {
        var now = Math.floor(Date.now()/1000)
        point.createdAt = point.createdAt||now
        point.merchantID = member.merchant.merchantID.toString()
        
        member.postPoint += point.point
        point.postPoint = member.postPoint 
        if(point.point > 0) {
          member.postTotalPoint += point.point
        }
        point.postTotalPoint = member.postTotalPoint
        
        member.save()
        point.member = member
        next()
      }
    })
  }
  
};

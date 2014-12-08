module.exports = function(app) {
  app.use('/api',function(req, res, next) {
		if(req.accessToken) {
      app.models.User.findOne({where:{id:req.accessToken.userId}, include:{employe:'merchant'}}, function (err, user) {
        req.employe = user.employe()
				next()
			})
		} else {
			next()
		}
  })
}
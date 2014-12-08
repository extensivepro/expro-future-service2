var authorized_paths = ['/members', '/bills', '/deals', '/employes']
module.exports = function(app) {
  app.use('/api',function(req, res, next) {
		if(req.accessToken) {
      app.models.User.findOne({where:{id:req.accessToken.userId}, include:{employe:'merchant'}}, function (err, user) {
        req.employe = user.employe()
				if(authorized_paths.indexOf(req.path) !== -1) {
					if(req.employe) {
						if(req.method === 'GET') {
							req.query.filter = req.query.filter || '{}'
							var filter = JSON.parse(req.query.filter)
							filter.where = {merchantID: req.employe.merchantID}
							req.query.filter = JSON.stringify(filter)
						}
						next()
					} else {
			      var error = new Error('unauthorized, unkonwn employe.')
			      error.status = 401
						next(error)
					}
				} else {
					next()
				}
			})
		} else {
			next()
		}
  })
}
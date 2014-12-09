var authorized_paths = ['/members', '/bills', '/deals', '/employes', '/points']

module.exports = function(app) {
	
  var restApiRoot = app.get('restApiRoot')

	app.use(restApiRoot, function (req, res, next) {

		if (req.method === 'OPTIONS') return next()

		if(req.accessToken) {
      app.models.User.findOne({
				where:{id:req.accessToken.userId},
				include:{employe:'merchant'}
			}, function (err, user) {
        req.employe = user.employe()
				next(err)
			})
		} else {
			next()
		}
		
	})
	
	app.use(restApiRoot, function (req, res, next) {
		
		if(authorized_paths.indexOf(req.path) !== -1 && req.method === 'GET') {
			if(req.employe) {
				req.query.filter = req.query.filter || '{}'
				var filter = JSON.parse(req.query.filter)
				filter.where = {merchantID: req.employe.merchantID}
				req.query.filter = JSON.stringify(filter)
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
	
}
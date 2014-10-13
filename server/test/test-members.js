var qs = require('qs');
var query = {
 filter: {where: {
   updateAt: {lt: Date.now()}
 },
 limit: 3}
};
console.log(qs.stringify(query))
require('superagent')
 .get('http://localhost:3000/api/members?' + qs.stringify(query))
 .set('Content-Type', 'application/json')
 .end(function(err, res) {
   console.log(res.body);
 });
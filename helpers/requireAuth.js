// restrict routes for unauthenticated users
module.exports = function requireAuth(req, res, next) {
	  if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error_msg', 'You have to log in to visit this page!');
	    res.redirect('/');
		}
}

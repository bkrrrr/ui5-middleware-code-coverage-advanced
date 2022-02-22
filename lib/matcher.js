

module.exports = function(pathname, exclude) {
	if (pathname !== "/" && "/favicon.ico"){
		if (pathname.match(/\.js$/) && !pathname.match(/jquery/) && !pathname.match(/resources/)) {
			return true;
		}
	}
	return false;
};
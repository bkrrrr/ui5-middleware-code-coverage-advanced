const log = require("@ui5/logger").getLogger("server:custom-middleware:code-coverage-advanced");


const matcher = require("./lib/matcher");
const Instrumenter = require("./lib/instrumenter");

module.exports = async function ({ options, middlewareUtil, resources }) {

	if (options.configuration.enabled !== true) {
		return function (req, res, next) { next(); };
	}

	const watchPath = options.configuration.path || "webapp";
	const jsResources = await resources.rootProject.byGlob("**/*.js");
	const instrumenter = new Instrumenter({watchPath: watchPath, resources: jsResources });

	instrumenter.cleanNycOutput();
	await instrumenter.createBaseline();

	// eslint-disable-next-line func-names
	return function (req, res, next) {

		const virtualPathname = middlewareUtil.getPathname(req);

		if (matcher(virtualPathname, options.configuration.exclude)) {
			resources.rootProject.byPath(virtualPathname)
				.then(async (resource)=>{
					if (resource){
						const instrumentedCode = await instrumenter.instrumentSync(resource);
						res.send(instrumentedCode);
					} else {
						next();
					}
				}).catch(e=>log.verbose(`${req.url} instrument code failed.`, e));
		} else {
			next();
			log.verbose(`${req.url} is part of a library exclusion in the ui5.yaml file.`);
		}
	};
};
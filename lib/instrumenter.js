const path = require("path");
const fs = require("fs");

const im = require("istanbul-lib-instrument");
const convertSourceMap = require("convert-source-map");

const nycOutputDir = ".nyc_output";

module.exports = class nycOutputUtil{

	constructor({watchPath, resources}){
		this._watchPath = watchPath;
		this._instrumenter = im.createInstrumenter({
			preserveComments: false,
			produceSourceMap: true,
			embedSource: true}
		);
		this._resources = resources;
		this._nycOutputDir = path.join(process.cwd(), nycOutputDir);
	}

	async instrumentSync(resource){
		const code = await resource.getString();
		const fileSystemPathname = path.join(process.cwd(), this._watchPath, resource.getPath());

		const instrumented = this._instrumenter.instrumentSync(code, fileSystemPathname);
		return instrumented + "\n" + convertSourceMap.fromObject(this._instrumenter.lastSourceMap()).toComment();
	}

	cleanNycOutput(){
		fs.rmSync(this._nycOutputDir, { maxRetries: 5, retryDelay: 1000, recursive: true, force: true });
	}

	async createBaseline(){
		const baselines = await Promise.all(this._resources.map(async (resource)=>{
			//const fileSystemPathname = path.join(process.cwd(), "webapp", resource.getPath());
			//const code = await resource.getString();
			//this._instrumenter.instrumentSync(code, fileSystemPathname);
			await this.instrumentSync(resource);
			return this._instrumenter.lastFileCoverage();
		}));

		const baselinesObject = baselines.reduce((previousValue, currentValue) => {
			previousValue[currentValue.path] = currentValue;
			return previousValue;
		},
		{}
		);
		await fs.promises.mkdir(this._nycOutputDir, {recursive: true});
		await fs.promises.writeFile(path.join(this._nycOutputDir, "baseline.json"), JSON.stringify(baselinesObject));
	}


};
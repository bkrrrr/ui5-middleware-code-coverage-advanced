/* eslint-disable no-unused-expressions */
const fs = require("fs");
const path = require("path");

const axios = require("axios").default;
const expect = require("chai").expect;

const normalizer = require("@ui5/project").normalizer;
const ui5Server = require("@ui5/server").server;


const STATUS_OK = 200;
const JS_FILES_IN_FIXTURES = 3;
const FIXTURE = "./test/fixtures/application.a";

describe("Middleware", function () {
	let connection = null;

	before(function() {
		return normalizer.generateProjectTree({
			cwd: FIXTURE
		}).then(async (tree) => {
			// changes process.cwd() for test execution as it would be a installed plugin
			process.chdir(FIXTURE);

			connection = await ui5Server.serve(tree, {
				port: 3333
			});

		});
	});

	after(function(){
		connection.close();
	});

	it("UI5-tooling can start with this middleware", async () => {
		const response = await axios.get("http://localhost:3333/index.html");
		expect(response.status).to.equal(STATUS_OK);
	});

	it("JS response is instrumented", async () => {
		const response = await axios.get("http://localhost:3333/test.js");
		expect(response.data.startsWith("function cov")).to.be.true;

	});

	it("JS response is contains sourcemap", async () => {
		const response = await axios.get("http://localhost:3333/test.js");
		expect(response.data.includes("//# sourceMappingURL=data")).to.be.true;
	});

	it("Baseline.json exists and has entries for the 3 .js fixtures", async () => {
		const myPath = path.join(process.cwd(), ".nyc_output", "baseline.json");
		const file = await 	fs.promises.readFile(myPath, {encoding: "utf8"});
		const coverageArray = JSON.parse(file);
		expect(Object.keys(coverageArray)).to.have.lengthOf(JS_FILES_IN_FIXTURES);
	});


});
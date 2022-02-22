const chai = require("chai");


global.chai = chai;
global.expect = chai.expect;
/*
const server = require('./support/server')
before(function () { return server.connect(this) })
after(() => { return server.close() })

global.server = server

CDS has also global vars, therefore this doesn't work
const { GET, POST, PATCH, DELETE } = server.httpOperations()
global.HTTP_GET = GET
global.HTTP_POST = POST
global.HTTP_PATCH = PATCH
global.HTTP_DELETE = DELETE


const util = require('./support/util')
global.util = util


const { DateTime } = require('luxon')
global.DateTime = DateTime

return normalizer.generateProjectTree({
		cwd: "./test/fixtures/application.a"
	}).then((tree) => {
		return ui5Server.serve(tree, {
			port: 3333
		}).then((serveResult) => {
			request = supertest("http://localhost:3333");
			serve = serveResult;
		});
	});*/
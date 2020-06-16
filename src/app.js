const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
	console.log('GET REPOSITORIES');
	console.log(repositories);
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body;
	const id = uuid();
	const likes = 0;
	
	const newrepo = {id, title, url, techs, likes};
	repositories.push(newrepo);

	return response.json(newrepo);
});

function findRepoById(request, response, next) {
	const { id } = request.params;

	if (!isUuid(id)) return response.sendStatus(400);

	const index = repositories.findIndex(repo => repo.id == id);	
	if (index < 0) return response.sendStatus(400);
	
	response.locals.index = index;
	response.locals.repo = repositories[index];

	return next();
}

app.put("/repositories/:id", findRepoById, (request, response) => {
	const { repo, index } = response.locals;	
	const { title, url, techs } = request.body;
	const newrepo = {...repo, title, url, techs};
	repositories[index] = newrepo;
	return response.json(newrepo);
});

app.delete("/repositories/:id", findRepoById, (request, response) => {
	const { index } = response.locals;	
	repositories.splice(index,1);	
	return response.sendStatus(204);
});

app.post("/repositories/:id/like", findRepoById, (request, response) => {
	const { repo } = response.locals;
  	repo.likes++;
	return response.json(repo);
});

module.exports = app;

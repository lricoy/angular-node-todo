// server.js

	// set up ==============================
	var express  = require('express');
	var app		 = express();				//create the app with express
	var mongoose = require('mongoose');		//mongoose for mongodb

	// configuration ======================

	mongoose.connect('mongodb://localhost:27017')

	app.configure(function() {
		app.use(express.static(__dirname + '/public'));				// set the static file location /public/img will be /img for users
		app.use(express.logger('dev'));								// log every request to the console
		app.use(express.bodyParser());								// pull information from html in POST
		app.use(express.methodOverride());							// simulate DELETE and PUT
	});


	// define model =======================
	var Todo = mongoose.model('Todo', {
		text: String
	});

	//routes ==============================

		//API

		// GET all todos
		app.get('/api/todos', function(req, res){

			// use mongoose to get all todos in the database
			Todo.find(function(err, todos) {

				// if there is an error retrieving, send the error
				if(err)
					res.send(err);

				res.json(todos); // return all todos in JSON format
			});

		});

		// POST a new todo and return all todos
		app.post('/api/todos', function(req, res){

			// create a todo, information comes from AJAX request from Angular
			Todo.create({
				text: req.body.text,
				done: false
			}, function(err, todo){
				if(err)
					res.send(err);

				// get and return all todos
				Todo.find(function(err, todos){
					if(err)
						res.send(err);

					res.json(todos);
					});
				});
		}); 
		//end app.post

		// DELETE a todo and return all Todos
		app.delete('/api/todos/:todo_id', function(req, res){

			Todo.remove({
				_id: req.params.todo_id
			}, function(err, todo){
				if(err)
					res.send(err);

				// get and return all todos
				Todo.find(function(err, todos){
					if(err)
						res.send(err);

					res.json(todos);
				});
			})

		});


		// Application
		app.get('*', function(req, res){
			res.sendfile('./public/index.html');	// load the single view file
		});


	// listen (start app with node server.js)
	app.listen(8080);
	console.log("App listening on port 8080");
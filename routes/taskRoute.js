const express = require('express');
const taskRouter = express.Router();
const root = require('../path.js');
const {getDb} = require('../db/database.js');
const controllers = require('../controllers/controllers.js');


taskRouter.route('/')
	.get(async (req,res,next)=> {
		res.sendFile('tasks.html', {root: root});
})
	.post(async (req,res,next)=> {
		const {type} = req.body;
		const collection = await getDb().collection('tasks');
		
		if(type === 'addTask') {
			const task = req.body.obj;
			controllers.addTask(res, collection, task);	
		}			
	})
	.put(async (req,res,next)=> {
		const collection = await getDb().collection('tasks');
		console.log(req.body)
		controllers.updateOne(res,collection,req.body);
	})
	.delete(async (req,res,next)=> {
		const collection = await getDb().collection('tasks');
		controllers.deleteOne(res, collection, String(req.body.id));
	})

taskRouter.route('/taskList')
	.get(async (req,res,next)=> {
		const collection = await getDb().collection('tasks');
		const numOfDocuments = await collection.estimatedDocumentCount();
		console.log(req.query)

		if(numOfDocuments === 0) {
			res.json({message: 'No tasks found in the collection! Please, add tasks.'})
		}else {
			console.log(numOfDocuments);
			const sort = req.query.sortBy ? req.query.sortBy : '';
			controllers.getAllTasks(res, collection, sort);
		}	
	})

taskRouter.route('/task')
	.get(async (req,res,next)=> {
			if(req.query) {
				var reg = /^[a-z]+$/i;
					var test = reg.test(req.query.search);
					if(test) {
						const collection = await getDb().collection('tasks');
						controllers.searchTask(res, collection, String(req.query.search));			
					}else {
						res.json({message: 'Not Found!'})
					}
				}
	});



module.exports = taskRouter;

const {count, findByName, createTask, findAllTasks, updateTask, deleteTask} = require('../db/crud.js');

module.exports = {
	getAllTasks: (res, collection, opt)=> {
		const cursor = findAllTasks(collection, opt);
		cursor.then(findCursor => {
			findCursor.toArray((err, result)=> {
				if(err) {
					next()
				}else {
					res.json(result)
				}
			})
		}).catch(err => console.log(err))
	},

	addTask: (res, collection, new_task)=> {
		const newTask = createTask(collection, new_task);
		newTask
			.then(result => res.json({message: 'Success'}))
			.catch(err => res.json({error: 'Cannot create task'})) 
	},

	searchTask: (res, collection, query)=> {
		const cursor = findByName(collection, query);
		cursor.then(findCursor => {
			findCursor.toArray((err, result)=> {
				if(err) {
					next()	
				}else {
					res.json(result)
				}
			})
		})
	},

	updateOne: (res,collection,body) => {
		const updateTaskInDB = updateTask(collection, body['_id'], {task: body['task']});
		try{
			updateTaskInDB.then(edit => {
				if(edit.matchedCount === 1 && edit.modifiedCount > 0) {
					res.json({modified: true, edited: body})
				}else {
					res.json({modified: null})
				}
			})
		}catch(err){
			res.status(404).send('Something went wrong!')
		}
	},

	deleteOne: (res, collection, id) => {
		const deletedDoc = deleteTask(collection, id);
		try{
			deletedDoc.then(result => {
				if(result.message) {
					res.json({message: 'Success'})
				}else {
					res.json({message: 'Failed'})
				}
			})
			.catch(err => console.log(err.message))
		}catch(err) {
			res.status(404).send('File not Found!')
		}
	}
}

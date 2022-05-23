const { ObjectId } = require('mongodb');

class Crud {

	async countDocuments(collection) {
		const count =	await collection.estimatedDocumentCount();
		return count;
	}

	async findDocumentByName(collection, query) {
		//ignore case
		var query_ = new RegExp(`\^${query}`+'$','i');
		const findCursor = await collection.find({task: {$regex: query_}}, {sort:{date: -1}});
		return findCursor
	}

	async deleteDocument(collection, id) {
		const o_id = new ObjectId(id);
		const result = await collection.deleteOne({_id: o_id});
		if(result.deletedCount === 1) {
			return {message: true}
		}else {
			return null
		}
	}
	
	async updateOneDocument(collection, id, userEdit) {
		const o_id = new ObjectId(id);
		const doc = await collection.updateOne({_id: o_id}, {'$set': userEdit},{upsert: false});
		console.log(doc)
		return doc;
	}

	async createDocument(collection, task) {
		const newTask = await collection.insertOne({task: task.taskName, date: task.date, time: task.time, creation_date: new Date().toLocaleDateString()});
		return newTask
	}

	async getAllDocuments(collection, sortOpt) {
		const opt = getOption(sortOpt);
		const	findCursor = await collection.find({}, {sort: opt}).limit(20);
			return findCursor
	}
}

function getOption(opt) {
	switch(opt) {
		case 'name_asc':
			return {task: -1}
		case 'name_dsc':
			return {task: 1}
		case 'date_asc':
			return {date: 1}
		case 'date_dsc':
			return {date: -1}
		default:
			return {date: 1}
	}
}


const crud = new Crud();

module.exports = {
	count: crud.countDocuments,
	findByName: crud.findDocumentByName,
	createTask: crud.createDocument,
	findAllTasks: crud.getAllDocuments,
	updateTask: crud.updateOneDocument,
	deleteTask: crud.deleteDocument
}

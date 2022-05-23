function createTaskArray(tasks) {
	const list = tasks.getElementsByClassName('task');
	const array = Array.from(list);
	return array;
}

export function findTaskID(tasks, id, operation) {
	var array = createTaskArray(tasks);
	var result;
	if(operation === 'find') {
		result = array.find(div => div.id === id);
		return result;
	}
	if(operation === 'edit'){
		result = array.find(div => div.id === id);
		return result
	}
	if(operation === 'delete') {
		result = array.filter(div => div.id === id);
		return result[0]
	}
	return 
}




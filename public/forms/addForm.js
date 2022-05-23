
input.oninput = (e)=> {
	e.target.setCustomValidity('');
	if(e.target.className === 'invalid') {
		input.classList.remove('invalid');
	}
	var str = e.target.value;
	newTask.taskName = str[0].toUpperCase() + str.slice(1);
}

input.oninvalid = (e)=> {
	e.target.setCustomValidity('Enter task name');
	input.className = 'invalid';	
}

addFormDate.oninput = (e)=> {
	e.target.setCustomValidity('');
	console.log(e.target.value)
	var date = new Date(String(e.target.value));
	newTask.date = date;
}

form.addEventListener('submit', (e)=> {
	e.preventDefault();
	if(newTask.taskName) {
		if(!newTask.date || !newTask.time){
				document.querySelector('.dateTimeBox').classList.add('invalid');
		}else {
			submit('addTask', newTask);
			input.value = '';
			addFormDate.value = '';
			addFormTime.value = '';
			newTask = {};
			searchBy.value= '';
			document.querySelector('.dateTimeBox').classList.remove('invalid');
		}
	}
});


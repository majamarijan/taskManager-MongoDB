import {startTimer} from '../start.js';
import {setError} from '../variables.js';
import {findTaskID} from '../controllers.js';
import {renderTasks} from '../renderTasks.js';

class Forms {
	static prevDefault(e) {
		e.preventDefault();
	}
	static validity(e, isValid, message) {
		if(isValid) {
			e.target.setCustomValidity(message);
		}else {
			e.target.setCustomValidity(message)
		}
	}
}

export class CreateTask extends Forms{
	constructor(elements) {
		super();
		this.form = elements.forms.addForm;
		this.input = elements.inputs.addInput;
		this.taskDate = elements.forms.addFormDate;
		this.taskTime = elements.forms.addFormTime;
	}
	
	async addTask(elements) {
		this.input.oninput = function(e) {
			Forms.validity(e, true, '');
			if(e.target.className === 'invalid') {
				e.target.classList.remove('invalid');
			}
			var str = e.target.value;
			if(str !== '') {
			 elements.newTask.taskName = str[0].toUpperCase() + str.slice(1);
			}
		}
		
		this.input.oninvalid = (e)=> {
			Forms.validity(e,false,'Enter task name');
			e.target.className = 'invalid';	
		}
		this.taskDate.oninput = (e)=> {
			Forms.validity(e, true, '');
			var date = new Date(String(e.target.value));
			elements.newTask.date = date;
			console.log(elements.newTask)
		}
		this.taskTime.oninput = (e)=> {
			elements.newTask.time = e.target.value;
		}

		this.form.onsubmit = (e)=> {
			Forms.prevDefault(e);
			var newTask = elements.newTask;
			if(newTask.taskName) {
				if(!newTask.date || !newTask.time){
					elements.dateTimeBox.classList.add('invalid');
				}else {
					CreateTask.submit(elements, 'addTask', newTask)
					console.log('Sent')
					this.input.value = '';
					this.taskDate.value = '';
					this.taskTime.value = '';
					newTask = {};
					elements.searchBy.value= '';
					elements.dateTimeBox.classList.remove('invalid');
				}
			}
		}
	}
	static async submit(el,type, obj) {
		const res = await fetch(el.url, {
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({type, obj})
		});
		const json = await res.json();
		if(json.message === 'Success') {
		startTimer(1, el)
		}else {
		setError(el.error);
		}	
	}

}




export class EditTask extends Forms {
	constructor(el) {
		super()
		this.form = el.forms.editForm;
		this.input = el.inputs.editFormInput;
		this.cancel = el.cancelBtn;
		}

	edit(el, obj) {
		el.backdrop.classList.remove('hidden');
		this.form.classList.remove('hidden');
		this.input.value = obj['task'];
		el.updatedObj = Object.assign(obj);
		
		this.input.oninput = (e)=> {
		var str = e.target.value;
		if(str !== '') {
			obj['task'] = str[0].toUpperCase() + str.slice(1)
			}	
		}
	
		this.cancel.onclick = (e)=> EditTask.closeEditor(el, this.form);

		this.form.onsubmit = async (e)=> {
			Forms.prevDefault(e);
			const res = await fetch('http://localhost:5000/tasks', {
				method: 'PUT',
				headers: {'Content-Type':'application/json'},
				body: JSON.stringify(el.updatedObj)
			});
			const json = res.json();
			json.then(res => {
				if(!res.modified) {
					console.log('Not modified');
					closeEditor(el, this.form);
					}else {
						EditTask.render(el.tasks, res.edited, 'edit');
						EditTask.closeEditor(el, this.form);
					}		
			})
		}
	}
	static render(tasks, ed, msg) {
		const task = findTaskID(tasks, ed['_id'], msg);
		task.getElementsByTagName('p')[0].textContent = ed.task;
	}

	static closeEditor(el, form) {
		el.backdrop.classList.add('hidden');
		form.classList.add('hidden');
	}
}



export class SearchTask extends Forms {
	constructor(el) {
		super();
		this.form = el.forms.searchForm;
		this.input = el.inputs.searchInput;
		if(el.tasks.innerHTML === '') {
			this.input.disabled = true;
			this.input.classList.add('disabled');
			this.form.getElementsByTagName('button')[0].classList.add('disabled')
			this.form.removeEventListener('submit', )

		}
	}

	search(el) {
		this.input.oninput = (e)=> {
			Forms.validity(e, true,'');
			if(e.target.value === '') {
				el.tasks.childNodes.forEach(c => c.classList.remove('hidden'));
				Forms.validity(e, false, 'Enter search term');
			}
		}

		this.form.onsubmit = async (e)=> {
			Forms.prevDefault(e);
			var name = this.input.name;
			var value = this.input.value;
			if(value !== '') {
				const res = await fetch(el.url+`/task?${name}=${value}`, {
					method: 'GET'
				});
				const tasksFound = await res.json();
				if(tasksFound.message) {
					alert(tasksFound.message)
				}else {
					if(tasksFound.length > 0) {
						var result = [];
						tasksFound.forEach(async task => {
						var taskDOM =	findTaskID(el.tasks,task['_id'], 'find');
					//	result.push(taskDOM);
						await SearchTask.render(result, el);

					});
					}
				}
			}
		}
	}
	static render(result, el) {
		for(var i=0; i < el.tasks.children.length; i++) {
			for(var k=0;k<result.length;k++) {
				if(el.tasks.children[i] !== result[k]){
				el.tasks.children[i].classList.add('hidden');	
			 }
			 result[k].classList.remove('hidden')
			}
		}
	}
}



export class SortBy {
	constructor(el) {
		this.select = el.searchBy;
	}

	sort(el) {
		this.select.onchange = async (e)=> {
			var value;
			if(el.tasks.innerHTML !== '') {
				value = e.target.value;
			}
			if(value) {
				el.tasks.innerHTML='';
				await SortBy.render(el.url, el.tasks, value);
			}
		}
	}
	static async render(url, tasks, value) {
		const res = await fetch(url+`/taskList?sortBy=${value}`);
		const json = await res.json();
		tasks.innerHTML = '';
		json.forEach(task => {
			renderTasks(task);
		})
	}
}


export async function TaskControllers(globals) {
	const createTask = new CreateTask(globals);
	createTask.addTask(globals);
	const searchTask = new SearchTask(globals);
	searchTask.search(globals);
	const sortBy = new SortBy(globals);
	sortBy.sort(globals);	
}


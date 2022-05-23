import {EditTask} from './forms/formController.js';
import {startTimer} from './start.js';
import {findTaskID} from './controllers.js';

class TaskHandlers {
	static async openEditor(el,obj) {
		console.log('update activated');
		//activate editForm
		var editTask = new EditTask(el);
		await editTask.edit(el, obj);
	}
	static async deleteTask(e,el,parent) {
		const div = parent;
		const res = await fetch('http://localhost:5000/tasks', {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({id: div.id})
			});
			const json = res.json();
			json.then(result => {
				if(result.message === 'Success') {
					this.removeDeleted(el,div);
				}else {
					alert('Cannot Delete')
				}
			})
		}
	static removeDeleted(el,div) {
			const task = findTaskID(el.tasks, div.id, 'delete');
			el.tasks.removeChild(task);
			if(el.tasks.innerHTML === '') {
				startTimer(1, el); 
			}
		}

}

export class Task {
	constructor(obj, el) {
		this.task = document.createElement('div');
		this.text = document.createElement('p');
		this.btnWrapper = document.createElement('div');
		this.edtBtn = document.createElement('button');
		this.delBtn = document.createElement('button');
		this.dateBox = document.createElement('div');
		// attach classes and content
		Task.style(this);
		Task.addContent(this, obj);
		Task.addHandlers(this.edtBtn, this.delBtn, el, obj, this.task);
	}

	static addHandlers(edtBtn, delBtn, el, json, parent) {
		 edtBtn.addEventListener('click', async (e)=> await TaskHandlers.openEditor(el,json),false);
		delBtn.addEventListener('click', async (e)=> await TaskHandlers.deleteTask(e, el, parent), false);

	}
	
	create(elements) {
		Task.append(elements,this) ;
	}

	static append(el, obj) {
		obj.task.append(obj.dateBox);
		obj.task.append(obj.text);
		obj.btnWrapper.append(obj.edtBtn);
		obj.btnWrapper.append(obj.delBtn);
		obj.task.append(obj.btnWrapper);
		el.tasks.appendChild(obj.task);
	}

	static addContent(task, obj) {
		task.edtBtn.textContent = 'Edit';
		task.delBtn.textContent = 'Delete';
		task.task.id = obj['_id'];
		task.text.textContent = obj['task'];
		task.dateBox.textContent = Task.checkYear(obj);
	}

	static style(obj) {
		obj.task.className = 'task';
		obj.dateBox.className = 'dateBox';
		obj.edtBtn.className = 'editBtn';
		obj.delBtn.className = 'deleteBtn';
		obj.btnWrapper.className = 'buttonWrapper';
	}

	static checkYear(res) {
		const months = ['Jan', 'Feb', 'March', 'Apr', "May", 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
		var date = new Date(res.date);
		var year = date.getFullYear();
		var current = new Date().getFullYear();
		if(current > year) {
			return `${months[date.getMonth()]} ${date.getDate()}, ${year}`
		}else {
			return `${months[date.getMonth()]} ${date.getDate()}`
		}
	}
}



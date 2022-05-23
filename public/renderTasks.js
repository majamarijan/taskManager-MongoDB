import {elements} from './variables.js';
import {EditTask} from './forms/formController.js';
import {startTimer} from './start.js';
import {findTaskID} from './controllers.js';
const tasks = elements.tasks;
const backdrop = elements.backdrop;
const {editForm} = elements.forms;
const {editFormInput} = elements.inputs;
var updatedObj = elements.updatedObj;



export function renderTasks(res) {
			const task = document.createElement('div');
			const btnWrapper = document.createElement('div');
			const deleteBtn = document.createElement('button');
			const editBtn = document.createElement('button');
			const p = document.createElement('p');
			const dateBox = document.createElement('div');
			dateBox.className = 'dateBox';
			task.className = 'task';
			p.textContent = res.task;
			dateBox.textContent = checkYear(res);
			task.id = res['_id'];
			buttonHandler(editBtn, deleteBtn, res, task);
			buttonStyler(editBtn, deleteBtn, btnWrapper);
			btnWrapper.append(editBtn);
			btnWrapper.append(deleteBtn);
			task.append(dateBox);
			task.append(p);
			task.append(btnWrapper);
			tasks.appendChild(task);
		}

		function checkYear(res) {
			//var cd = res.creation_date.split('/').join('-');
			//var creationYear = new Date(cd).getFullYear();
			//
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

		function buttonStyler(edt, dlt, wrapper) {
			edt.className = 'editBtn';
			edt.textContent = 'Edit';
			dlt.className = 'deleteBtn';
			dlt.textContent = 'Delete';
			wrapper.className = 'buttonWrapper';
		}

		function buttonHandler(edt,dlt,json, parent) {
			edt.addEventListener('click', (e)=> openEditor(json),false);
			dlt.addEventListener('click', (e)=>deleteTaskHandler(e, parent), false);
		}

	 function openEditor(obj) {
			console.log('update activated');
			//activate editForm
			var editTask = new EditTask(elements);
			editTask.edit(elements, obj);
		}


		function deleteTaskHandler(e, parent) {
//			const parent = e.target.parentNode.parentNode;
			deleteTask(parent);
		}

		async function deleteTask(div) {
			const res = await fetch('http://localhost:5000/tasks', {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({id: div.id})
			});
			const json = res.json();
			json.then(result => {
				if(result.message === 'Success') {
					removeDeleted(div);
				}else {
					alert('Cannot Delete')
				}
			})
		}

		function removeDeleted(div) {
			const task = findTaskID(tasks, div.id, 'delete');
			tasks.removeChild(task);
			if(tasks.innerHTML === '') {
				startTimer(1, elements); 
			}
		}


//import	{renderTasks} from './renderTasks.js';
import {Task} from './Task.js'

var timer;


export const startTimer = (counter, globals)=> {
	timer = setTimeout(()=> {
	console.log('started')
	start(counter, globals);
	}, 1000);
};

async function start(c, globals) {
	if(c > 0) {
		clearTimeout(timer);
		timer=null;
		console.log('cleared');
		globals.loader.style.display = 'none';
	}
	const res = await fetch('/tasks/taskList');
	const json = await res.json();
	console.log(json)
	if(json.message) {
		globals.tasksInfo.classList.remove('hidden');
		globals.noTasks.textContent = json.message;
	}else {
		globals.noTasks.textContent = '';
		globals.tasksInfo.classList.add('hidden');
		globals.tasks.innerHTML = '';
		json.forEach(res => {
			const task = new Task(res, globals);
			task.create(globals);
		})
		}				
	}


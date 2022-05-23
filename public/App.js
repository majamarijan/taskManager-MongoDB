import {elements} from './variables.js';
import {startTimer} from './start.js'
import {TaskControllers} from './forms/formController.js'

export const App = ()=> {
	const controllers = TaskControllers(elements);
	if(controllers) {
		console.log('ok');
		startTimer(1, elements);
	}
	
}


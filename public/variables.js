const loader = document.querySelector('.loader');
const form = document.querySelector('#addForm');
const searchForm = document.querySelector('#searchForm');
const editForm = document.getElementsByClassName('editForm hidden')[0];
const input = document.querySelector('#addForm input[type=text]');
const addFormDate = document.querySelector('#addForm input[type=date]');
const addFormTime = document.querySelector('#addForm input[type=time]');
const searchInput = document.querySelector('#searchForm input');
const searchBy = document.querySelector('select');
const tasks = document.querySelector('.tasks');
const error = document.getElementsByClassName('error hidden')[0];
const url = '/tasks';		
const backdrop = document.getElementsByClassName('backdrop hidden')[0];
const editFormInput = document.querySelector('.editFormInput');
const cancelBtn = document.querySelector('.editForm button[type=button]');
const dateTimeBox = document.querySelector('.dateTimeBox');
const tasksInfo = document.querySelector('.tasksInfo');
const noTasks = tasksInfo.querySelector('.noTasks');
var updatedObj = {};
var newTask = {};

function Elements() {
	this.elements =  {
		loader: loader,
		tasks: tasks,
		cancelBtn: cancelBtn,
		noTasks: noTasks,
		tasksInfo: tasksInfo,
		forms: {
			addForm: form,
			addFormDate: addFormDate,
			addFormTime: addFormTime,
			searchForm: searchForm,
			editForm: editForm,
		},
		inputs: {
			addInput: input,
			searchInput: searchInput,
			editFormInput: editFormInput
		},
		searchBy: searchBy,
		dateTimeBox: dateTimeBox,
		error: error,
		url: url,
		backdrop: backdrop,
		updatedObj: updatedObj,
		newTask: newTask
	}
}


const elms = new Elements();
export const elements = elms.elements;
export const setError = (el)=> el.classList.remove('hidden');


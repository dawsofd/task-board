// Retrieve tasks and nextId from localStorage
const taskTitle = $('#taskTitle');
const taskDue = $('#taskDue');
const taskDescription = $('#taskDescription');

const taskLanes = $('.swim-lanes');
const taskForm = $('#formModal');

function getTasks() {
    let taskString = localStorage.getItem('tasks');
    let taskList = JSON.parse(taskString) || [];

    return taskList;
}

function saveTask (taskList) {
    let saveString = JSON.stringify(taskList);
    localStorage.setItem('tasks', saveString);
};

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let taskId = crypto.randomUUID();
    console.log(taskId);
    return taskId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>');
    taskCard.addClass('card task-card draggable my-3')
    .attr('data-task-id', task.taskId);
const taskTitle = $('<div>').addClass('card-header h4').text(task.taskName);
const cardBody = $('<div>').addClass('card-body');
const taskDescription = $('<p>').addClass('card-description').text(task.taskDescription);
const taskDue = $('<p>').addClass('card-text').text(task.taskDue);
const cardDelete = $('<button>');
cardDelete
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.taskId);

if (task.taskDue && task.status !== 'done') {
    const now = dayjs();
    const dueDate = dayjs(task.taskDue, 'DD/MM/YYYY');

    if (now.isSame(dueDate, 'day')) {
        taskCard.addClass('bg-warning text-white');
    }   else if (now.isAfter(dueDate)) {
        taskCard.addClass('bg-danger text-white');
        cardDelete.addClass('border-light');
    }
}

cardBody.append(taskDescription, taskDue, cardDelete);
taskCard.append(taskTitle, cardBody);

return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskList = getTasks();

    const toDoList = $('#toDo-cards');
    toDoList.empty();

    const inProgressList = $('#inProgress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of taskList) {
        if (task.status ==='to-do') {
            toDoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    };

    $('.draggable').draggable({
        opacity: 0.5,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable');
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(){
    const inputTitle = taskTitle.val();
    const inputDescription = taskDescription.val();
    const inputDue = taskDue.val();
    const inputTask = {
        taskId: generateTaskId(),
        taskTitle: inputTitle,
        taskDecription: inputDescription,
        taskDue: inputDue,
        taskStatus: 'to-do',
    };

    const tasks = getTasks();
    tasks.push(inputTask);

    saveTask(tasks);

    renderTaskList();

    taskTitle.val('');
    taskDescription.val('');
    taskDue.val('');

};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});

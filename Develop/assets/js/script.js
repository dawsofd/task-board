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
    let id = crypto.randomUUID();
    console.log(id);
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>');
    taskCard.addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
const cardBody = $('<div>').addClass('card-body');
const taskTitle = $('<div>').addClass('card-header h4').text(task.taskTitle);
const taskDescription = $('<p>').addClass('card-description').text(task.taskDescription);
const taskDue = $('<p>').addClass('card-text').text(task.taskDue);
const cardDelete = $('<button>');
cardDelete
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);

if (task.taskDue && task.taskStatus !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.taskDue, 'YYYY-MM-DD');

    if (now.isSame(taskDueDate, 'day')) {
    taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
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

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of taskList) {
        if (task.taskStatus === 'to-do') {
          todoList.append(createTaskCard(task));
        } else if (task.taskStatus === 'in-progress') {
          inProgressList.append(createTaskCard(task));
        } else if (task.taskStatus === 'done') {
          doneList.append(createTaskCard(task));
        }
    };

    $('.draggable').draggable({
        opacity: 0.5,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask() {
    const inputTitle = taskTitle.val();
    const inputDescription = taskDescription.val();
    const inputDue = taskDue.val();
    const inputTask = {
        id: generateTaskId(),
        taskTitle: inputTitle,
        taskDescription: inputDescription,
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

taskForm.on('click', '#add-task', function(event){event.preventDefault()
    handleAddTask();
    taskForm.modal("hide");
});

// Todo: create a function to handle deleting a task
function handleDeleteTask() {
    const taskId = $(this).attr('data-task-id');
    const taskList = getTasks();

    taskList.forEach((task, i) => {
        if (task.id == taskId) {
          taskList.splice(i,1);
        }
    });

    saveTask(taskList);
    renderTaskList();
}

taskLanes.on('click', '.delete', handleDeleteTask);

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskList = getTasks();
    const taskId = ui.draggable[0].dataset.taskId;
    const currentStatus = event.target.id;

    for (let toDo of taskList) {
        if (toDo.id == taskId) {
            toDo.taskStatus = currentStatus;
        }
    }

    saveTask(taskList);
    renderTaskList();
};

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    $('#taskDue').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});

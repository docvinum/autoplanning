let taskIdCounter = 1;
const projectTaskOrderCount = {};
const taskTable = document.getElementById('task-table');
const taskProjectIdSelect = document.getElementById('task_project_id');

document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskName = document.getElementById('task_name').value;
    const taskDeadline = document.getElementById('task_deadline').value;
    let taskPriority = document.getElementById('task_priority').value;
    taskPriority = taskPriority === '' ? 0 : parseInt(taskPriority); // Add this line
    const projectId = taskProjectIdSelect.value;
    const taskDuration = document.getElementById('task_duration').value;
    const taskId = taskIdCounter++;

    const taskOrder = getNextTaskOrderForProject(projectId);
    addTaskRow(taskId, taskName, taskDeadline, taskPriority, projectId, taskOrder, taskDuration);

    // Clear the input fields
    document.getElementById('task_name').value = '';
    document.getElementById('task_deadline').value = '';
    document.getElementById('task_priority').value = '';
    document.getElementById('task_duration').value = '';
});

document.getElementById('generate-task').addEventListener('click', function(event) {
    event.preventDefault();

    const taskName = generateRandomWord(8);
    const taskDeadline = '';
    const taskPriority = getWeightedPriority();
    const taskDuration = getRandomInt(1, 8);
    const taskId = taskIdCounter++;

    // Assign the task to a random project
    const projectOptions = Array.from(taskProjectIdSelect.options).filter(
        option => option.value !== ''
    );
    if (projectOptions.length === 0) {
        alert('No projects available. Please create a project first.');
        return;
    }
    const randomProjectOption = projectOptions[getRandomInt(0, projectOptions.length)];
    const projectId = randomProjectOption.value;
    const taskOrder = getNextTaskOrderForProject(projectId);
    addTaskRow(taskId, taskName, taskDeadline, taskPriority, projectId, taskOrder, taskDuration);
});

function getNextTaskOrderForProject(projectId) {
    if (!projectTaskOrderCount[projectId]) {
        projectTaskOrderCount[projectId] = 1;
    }
    return projectTaskOrderCount[projectId]++;
}

function getWeightedPriority() {
    const randomNumber = Math.random();

    if (randomNumber < 0.7) {
        return 0;
    } else if (randomNumber < 0.9) {
        return 1;
    } else {
        return 2;
    }
}


function addTaskRow(taskId, taskName, taskDeadline, taskPriority, projectId, taskOrder, taskDuration) {
    const formattedDeadline = taskDeadline ? new Date(taskDeadline).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }) : '';

    const newRow = taskTable.insertRow(-1);
    newRow.innerHTML = `
        <td>${taskId}</td>
        <td>${taskName}</td>
        <td>${formattedDeadline}</td>
        <td>${taskPriority}</td>
        <td>${projectId}</td>
        <td>${taskOrder}</td>
        <td>${taskDuration}</td>
    `;
}
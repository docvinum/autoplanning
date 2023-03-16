let taskIdCounter = 1;
const projectTaskOrderCount = {};
const taskTable = document.getElementById('task-table');
const taskProjectIdSelect = document.getElementById('task_project_id');

document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskName = document.getElementById('task_name').value;
    const taskDeadline = document.getElementById('task_deadline').value;
    const taskPriority = document.getElementById('task_priority').value;
    const projectId = document.getElementById('task_project_id').value;
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
    const taskDeadline = new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000);
    const taskPriority = getRandomInt(0, 3);
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
        projectTaskOrderCount[projectId] = 0;
    }
    return projectTaskOrderCount[projectId]++;
}

function addTaskRow(taskId, taskName, taskDeadline, taskPriority, projectId, taskOrder, taskDuration) {
    const newRow = taskTable.insertRow(-1);
    newRow.innerHTML = `
        <td>${taskId}</td>
        <td>${taskName}</td>
        <td>${taskDeadline}</td>
        <td>${taskPriority}</td>
        <td>${projectId}</td>
        <td>${taskOrder}</td>
        <td>${taskDuration}</td>
    `;
}

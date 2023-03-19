let projectIdCounter = 1;
const projectTable = document.getElementById('project-table');

function addProjectRow(projectId, projectName, projectDeadline) {
    const newRow = projectTable.insertRow(-1);

    // Format the date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).format(projectDeadline);

    newRow.innerHTML = `
        <td>${projectId}</td>
        <td>${projectName}</td>
        <td>${formattedDate}</td>
    `;
}

function updateTaskProjectSelect(projectId, projectName) {
    const taskProjectIdSelect = document.getElementById('task_project_id');
    const newOption = document.createElement('option');
    newOption.value = projectId;
    newOption.textContent = projectName;
    taskProjectIdSelect.add(newOption);

    if (taskProjectIdSelect.options.length === 2) {
        taskProjectIdSelect.selectedIndex = 1; // Select the first project option
    }

    taskProjectIdSelect.disabled = false;
}

document.getElementById('project-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const projectName = document.getElementById('project_name').value;
    const projectDeadline = document.getElementById('project_deadline').value;
    let projectId = projectIdCounter++;

    addProjectRow(projectId, projectName, new Date(projectDeadline));
    updateTaskProjectSelect(projectId, projectName);

    // Clear the input fields
    document.getElementById('project_name').value = '';
    document.getElementById('project_deadline').value = '';
});


document.getElementById('generate-project').addEventListener('click', function(event) {
    event.preventDefault();

    const projectName = generateRandomWord(4);
    const projectDeadline = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000);
    let projectId = projectIdCounter++;

    addProjectRow(projectId, projectName, new Date(projectDeadline));
    updateTaskProjectSelect(projectId, projectName);
});
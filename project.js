let projectIdCounter = 1;
const projectTable = document.getElementById('project-table');

document.getElementById('project-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const projectName = document.getElementById('project_name').value;
    const projectDeadline = document.getElementById('project_deadline').value;
    const projectId = projectIdCounter++;

    addProjectRow(projectId, projectName, projectDeadline);

    // Clear the input fields
    document.getElementById('project_name').value = '';
    document.getElementById('project_deadline').value = '';

    updateTaskProjectSelect();
});

document.getElementById('generate-project').addEventListener('click', function(event) {
    event.preventDefault();

    const projectName = generateRandomWord(4);
    const projectDeadline = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000);
    const projectId = projectIdCounter++;

    addProjectRow(projectId, projectName, projectDeadline);

    updateTaskProjectSelect();
});

function addProjectRow(projectId, projectName, projectDeadline) {
    const newRow = projectTable.insertRow(-1);
    newRow.innerHTML = `
        <td>${projectId}</td>
        <td>${projectName}</td>
        <td>${projectDeadline}</td>
    `;
}

function updateTaskProjectSelect() {
    const taskProjectIdSelect = document.getElementById('task_project_id');
    const newOption = document.createElement('option');
    newOption.value = projectIdCounter - 1;
    newOption.textContent = projectName;
    taskProjectIdSelect.add(newOption);
}

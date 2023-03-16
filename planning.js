document.getElementById('plan-tasks').addEventListener('click', function (event) {
    event.preventDefault();
    planTasks();
});

function planTasks() {
    const tasks = getTasks();
    const projects = getProjects();
    const schedule = getEmployeeSchedule();

    // Process tasks based on the rules
    applyRules(tasks, projects, schedule);

    // Dispatch tasks to the employee-schedule-table
    dispatchTasks(tasks, schedule);

    // Check rules 7, 8 and 9
    checkRules(tasks, schedule);
}

function getTasks() {
    // Retrieve tasks from the task-table
}

function getProjects() {
    // Retrieve projects from the project-table
}

function getEmployeeSchedule() {
    // Retrieve the employee schedule from the employee-schedule-table
}

function applyRules(tasks, projects, schedule) {
    // Implement rules 1 to 6
}

function dispatchTasks(tasks, schedule) {
    // Dispatch tasks to the employee-schedule-table
}

function checkRules(tasks, schedule) {
    // Check rules 7, 8, and 9 and display appropriate warnings
}

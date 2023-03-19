document.getElementById('autoplanning').addEventListener('click', function () {
  autoplan();
});

function autoplan() {
  const projects = getProjects();
  console.log('Projects:', projects);

  let tasks = getTasks();
  console.log('Tasks:', tasks);

  // Update tasks' deadlines
  tasks = tasks.map(task => {
    const project = projects.find(p => p.id === task.projectId);

    // If the task has no deadline or its deadline is after the project's deadline, set the task's deadline to the project's deadline
    if (!task.deadline || (project.deadline && task.deadline > project.deadline)) {
      task.deadline = project.deadline;
    }

    return task;
  });

  const schedule = getEmployeeSchedule();
  console.log('Employee Schedule:', schedule);

  projects.sort((a, b) => a.deadline - b.deadline);

  for (const project of projects) {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    projectTasks.sort((a, b) => b.priority - a.priority);
    assignTasks(schedule, projectTasks);
  }

  console.log('Planning:', schedule);

  displayEmployeePlanning(schedule);
}


function getProjects() {
  const projectTable = document.getElementById('project-table');
  const projects = [];

  for (let i = 1; i < projectTable.rows.length; i++) {
    const row = projectTable.rows[i];
    const id = parseInt(row.cells[0].textContent.trim());
    const name = row.cells[1].textContent.trim();
    const deadlineText = row.cells[2].textContent.trim();
    const deadline = deadlineText ? new Date(deadlineText) : null;

    const project = {
      id: id,
      name: name,
      deadline: deadline,
    };

    projects.push(project);
  }

  return projects;
}

function getEmployeeSchedule() {
  const schedule = [];
  const rows = employeeScheduleTable.querySelectorAll("tr:not(:first-child)");

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const date = new Date(cells[0].textContent);
    const workTime = parseInt(cells[1].querySelector("input").value);

    schedule.push({
      date,
      workTime,
      remainingTime: workTime, // Initialize remainingTime as workTime
      workload: 0, // Initialize workload as 0
      tasks: [],
    });
  });

  return schedule;
}


function getTasks() {
  const taskTable = document.getElementById('task-table');
  const tasks = [];

  for (let i = 1; i < taskTable.rows.length; i++) {
    const row = taskTable.rows[i];
    const taskId = parseInt(row.cells[0].textContent.trim());
    const taskName = row.cells[1].textContent.trim();
    const taskDeadline = row.cells[2].textContent.trim() ? new Date(row.cells[5].textContent.trim()) : null;
    const taskPriority = parseInt(row.cells[3].textContent.trim());
    const projectId = parseInt(row.cells[4].textContent.trim());
    const taskDuration = parseInt(row.cells[6].textContent.trim());

    const task = {
      id: taskId,
      projectId: projectId,
      name: taskName,
      duration: taskDuration,
      priority: taskPriority,
      deadline: taskDeadline,
    };

    tasks.push(task);
  }

  return tasks;
}

function assignTasks(schedule, tasks) {
  const taskOrder = [];
  const projectsByDeadline = getProjects().sort((a, b) => a.deadline - b.deadline);

  // Add tasks with priority 2 to taskOrder
  for (const project of projectsByDeadline) {
    const priority2Tasks = tasks.filter(task => task.projectId === project.id && task.priority === 2);
    taskOrder.push(...priority2Tasks);
  }

  // Add the other tasks to taskOrder
  for (const project of projectsByDeadline) {
    const otherTasks = tasks
      .filter(task => task.projectId === project.id && !taskOrder.includes(task))
      .sort((a, b) => a.id - b.id);
    taskOrder.push(...otherTasks);
  }

  // Assign tasks from taskOrder to the planning
  for (const task of taskOrder) {
    let remainingDuration = task.duration;

    for (let i = 0; i < schedule.length && remainingDuration > 0; i++) {
      const day = schedule[i];

      if (day.workTime > day.workload) {
        const taskDuration = Math.min(remainingDuration, day.workTime - day.workload);

        day.workload += taskDuration;
        day.remainingTime = day.workTime - day.workload;
        day.tasks.push({
          id: task.id,
          name: task.name,
          priority: task.priority,
          duration: taskDuration,
        });

        remainingDuration -= taskDuration;
      }
    }
  }

  return schedule;
}


function displayEmployeePlanning(schedule) {
  const employeePlanningTable = document.getElementById("employee-planning-table");

  // Clear the existing table rows (except the header)
  while (employeePlanningTable.rows.length > 1) {
    employeePlanningTable.deleteRow(1);
  }

  schedule.forEach(day => {
    const newRow = employeePlanningTable.insertRow(-1);

    newRow.innerHTML = `
      <td>${formatDate(day.date)}</td>
      <td>${day.workTime}</td>
      <td>${day.workload}</td>
      <td>${day.remainingTime}</td>
      <td>${day.tasks.map(task => `${task.id}`).join("<br>")}</td>
      <td>${day.tasks.map(task => `${task.name}`).join("<br>")}</td>
      <td>${day.tasks.map(task => `${task.priority}`).join("<br>")}</td>
      <td>${day.tasks.map(task => `${task.duration}`).join("<br>")}</td>
    `;
  });
}

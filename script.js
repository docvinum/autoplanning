// utilities
function generateRandomWord(length) {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';

    let word = '';
    for (let i = 0; i < length; i++) {
        const letters = i % 2 === 0 ? consonants : vowels;
        word += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return word;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getNextMonday() {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const daysTillNextMonday = (7 - dayOfWeek + 1) % 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysTillNextMonday);
}


// projects
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

// tasks
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

// employee-schedule
const employeeScheduleTable = document.getElementById('employee-schedule-table');

document.getElementById('employee-schedule-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const scheduleStartDate = document.getElementById('schedule_start_date').value;
    const scheduleEndDate = document.getElementById('schedule_end_date').value;
    const workTime = document.getElementById('work_time').value;

    const startDate = new Date(scheduleStartDate);
    const endDate = new Date(scheduleEndDate);

    if (endDate <= startDate) {
        alert("End date must be after the start date.");
        return;
    }

    clearEmployeeScheduleTable();
    populateEmployeeSchedule(startDate, endDate, workTime);

    // Clear the input fields
    document.getElementById('schedule_start_date').value = '';
    document.getElementById('schedule_end_date').value = '';
    document.getElementById('work_time').value = '';
});

document.getElementById('generate-schedule').addEventListener('click', function(event) {
    event.preventDefault();

    const startDate = getNextMonday();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 13); // Add 4 days to get Friday
    const workTime = [8, 8, 3, 8, 8, 0, 0, 8, 8, 3, 8, 8, 0, 0]; // Work time for each day from Monday to Friday

    clearEmployeeScheduleTable();
    populateEmployeeSchedule(startDate, endDate, workTime);
});

function clearEmployeeScheduleTable() {
    while (employeeScheduleTable.rows.length > 1) {
        employeeScheduleTable.deleteRow(1);
    }
}

function formatDate(date) {
    return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function populateEmployeeSchedule(startDate, endDate) {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        let workTime;

        switch (dayOfWeek) {
            case 1: // Monday
            case 2: // Tuesday
            case 4: // Thursday
            case 5: // Friday
                workTime = 8;
                break;
            case 3: // Wednesday
                workTime = 3;
                break;
            default: // Saturday and Sunday
                workTime = 0;
                break;
        }

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const newRow = employeeScheduleTable.insertRow(-1);
        newRow.innerHTML = `
        <td>${formatDate(currentDate)}</td>
            <td>
                <input type="number" min="0" value="${workTime}" />
            </td>
        `;
        if (!isWeekend) {
            newRow.querySelector('td:first-child').style.fontWeight = 'bold';
        } else {
            newRow.style.fontStyle = 'italic';
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
}



// planning
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
  highlightDeadlineWarnings(schedule, tasks);
}

function highlightDeadlineWarnings(schedule, tasks) {
  const employeePlanningTable = document.getElementById("employee-planning-table");
  const rows = employeePlanningTable.querySelectorAll("tr:not(:first-child)");

  rows.forEach((row, rowIndex) => {
    if (schedule[rowIndex]) {
      const day = schedule[rowIndex];
      const taskIdsCell = row.querySelector("td:nth-child(5)");
      const taskIds = taskIdsCell.textContent.split(", ").map(id => parseInt(id));

      taskIds.forEach((taskId, taskIndex) => {
        const task = tasks.find(t => t.id === taskId);

        if (task && task.deadline && day.date >= task.deadline) {
          const cellsToHighlight = [
            row.querySelector(`td:nth-child(5)`),
            row.querySelector(`td:nth-child(6)`),
            row.querySelector(`td:nth-child(7)`),
            row.querySelector(`td:nth-child(8)`),
          ];

          cellsToHighlight.forEach(cell => {
            cell.classList.add("bg-warning");
          });
        }
      });
    }
  });
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
  const projectsByDeadline = getProjects().sort((a, b) => a.deadline - b.deadline);

  // Create taskOrder
  const taskOrder = [];

  // Add tasks with priority 2 to taskOrder
  const priority2Tasks = tasks.filter(task => task.priority === 2);
  taskOrder.push(...priority2Tasks);

  // Add the other tasks to taskOrder
  for (const project of projectsByDeadline) {
    const otherTasks = tasks
      .filter(task => task.projectId === project.id && !priority2Tasks.includes(task))
      .sort((a, b) => a.id - b.id);
    taskOrder.push(...otherTasks);
  }

  console.log('Task Order:', taskOrder);

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

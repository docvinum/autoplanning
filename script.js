let projectIdCounter = 1;
let taskIdCounter = 1;

const projectTable = document.getElementById('project-table');
const taskTable = document.getElementById('task-table');
const scheduleTable = document.getElementById('employee-schedule-table');
const taskProjectIdSelect = document.getElementById('task_project_id');

const projectTaskOrderCount = {};

document.addEventListener('DOMContentLoaded', () => {
  // Disable the Project ID select if there are no projects
  if (taskProjectIdSelect.childElementCount <= 1) {
    taskProjectIdSelect.disabled = true;
  }
});

document.getElementById('project-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const projectId = projectIdCounter++;
  const projectName = document.getElementById('project_name').value;
  const projectDeadline = document.getElementById('project_deadline').value;

  addProjectRow(projectId, projectName, projectDeadline);

  const option = document.createElement('option');
  option.value = projectId;
  option.text = projectName;
  taskProjectIdSelect.add(option);
  taskProjectIdSelect.disabled = false;
});

function addProjectRow(projectId, projectName, projectDeadline) {
  const newRow = projectTable.insertRow(-1);
  newRow.innerHTML = `
        <td>${projectId}</td>
        <td>${projectName}</td>
        <td>${projectDeadline}</td>
    `;
}

document.getElementById('generate-project').addEventListener('click', function(event) {
  event.preventDefault();

  const projectId = projectIdCounter++;
  const projectName = generateRandomWord(4);
  const projectDeadline = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000);

  addProjectRow(projectId, projectName, projectDeadline);

  const option = document.createElement('option');
  option.value = projectId;
  option.text = projectName;
  taskProjectIdSelect.add(option);
  taskProjectIdSelect.disabled = false;
});

document.getElementById('task-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const taskId = taskIdCounter++;
  const taskName = document.getElementById('task_name').value;
  const taskDeadline = document.getElementById('task_deadline').value;
  const taskPriority = document.getElementById('task_priority').value;
  const projectId = document.getElementById('task_project_id').value;
  const taskDuration = document.getElementById('task_duration').value;

  const taskOrder = getNextTaskOrderForProject(projectId);
  addTaskRow(taskId, taskName, taskDeadline, taskPriority, projectId, taskOrder, taskDuration);
});

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


document.getElementById('employee-schedule-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const startDate = document.getElementById('schedule_start_date').value;
  const endDate = document.getElementById('schedule_end_date').value;
  const workTime = document.getElementById('work_time').value;

  generateSchedule(startDate, endDate, workTime);
});

document.getElementById('generate-employee-schedule').addEventListener('click', function(event) {
  event.preventDefault();

  const startDate = getNextMonday();
  const endDate = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000);
  const workTime = [8, 8, 3, 8, 8];

  generateSchedule(startDate, endDate, workTime);
});

function getNextTaskOrderForProject(projectId) {
  if (!projectTaskOrderCount[projectId]) {
    projectTaskOrderCount[projectId] = 0;
  }
  return projectTaskOrderCount[projectId]++;
}

function generateSchedule(startDate, endDate, workTime) {
  scheduleTable.innerHTML = '';

  const start = new Date(startDate);
  const end = new Date(endDate);
  let currentDate = start;

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    const workTimeForDay = typeof workTime === 'object' ? workTime[dayOfWeek - 1] : workTime;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isWeekday = !isWeekend;

    const newRow = scheduleTable.insertRow(-1);
    newRow.innerHTML = `
        <td>${isWeekday ? '<b>' : ''}${currentDate.toISOString().split('T')[0]}${isWeekday ? '</b>' : ''}</td>
        <td>${isWeekend ? '<i>' : ''}<input type="number" value="${workTimeForDay}" min="0" max="24">${isWeekend ? '</i>' : ''}</td>
    `;
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

function generateRandomWord(length) {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';

  let word = '';
  for (let i = 0; i < length; i++) {
    const letters = i % 2 === 0 ? consonants : vowels;
    word += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return word;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function getNextMonday() {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const daysTillNextMonday = (7 - dayOfWeek + 1) % 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysTillNextMonday);
  }
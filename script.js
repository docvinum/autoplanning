let projectIdCounter = 1;
let taskIdCounter = 1;

const projectTable = document.getElementById('project-table');
const taskTable = document.getElementById('task-table');
const scheduleTable = document.getElementById('employee-schedule-table');
const taskProjectIdSelect = document.getElementById('task_project_id');

document.addEventListener('DOMContentLoaded', () => {
  // Disable the Project ID select if there are no projects
  if (taskProjectIdSelect.childElementCount <= 1) {
    taskProjectIdSelect.disabled = true;
  }
});

    function addTableRow(table, rowData) {
        const row = table.insertRow(-1);
        rowData.forEach((cellData) => {
            const cell = row.insertCell(-1);
            cell.textContent = cellData;
        });
    }

    document.getElementById('project-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const projectId = `P${projectIdCounter++}`;

        addTableRow(projectTable, [
            projectId,
            event.target.project_name.value,
            event.target.project_deadline.value,
        ]);

        const option = document.createElement('option');
        option.value = projectId;
        option.textContent = projectId;
        taskProjectIdSelect.appendChild(option);
        taskProjectIdSelect.disabled = false;
    });

    document.getElementById('task-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const taskId = `T${taskIdCounter++}`;

        const projectId = taskProjectIdSelect.value;
        const taskOrder = getNextTaskOrderForProject(projectId);

        addTableRow(taskTable, [
            taskId,
            event.target.task_name.value,
            event.target.task_deadline.value,
            event.target.task_priority.value,
            projectId,
            taskOrder,
            event.target.task_duration.value,
        ]);
    });

    function formatDate(date) {
        return date.toISOString().slice(0, 10);
    }

    function isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    function addEmployeeScheduleRow(date, workTime) {
        const row = scheduleTable.insertRow(-1);
        const dateCell = row.insertCell(-1);
        const workTimeCell = row.insertCell(-1);

        dateCell.textContent = formatDate(date);
        if (isWeekend(date)) {
            dateCell.style.fontStyle = 'italic';
        }
        if (!isWeekend(date)) {
            dateCell.style.fontWeight = 'bold';
        }

        workTimeCell.textContent = workTime;
        workTimeCell.contentEditable = 'true';

        // Restrict input to numeric values only
        workTimeCell.addEventListener('input', function(event) {
            event.target.textContent = event.target.textContent.replace(/[^0-9]/g, '');
        });
    }

    function clearEmployeeScheduleTable() {
        const numRows = scheduleTable.rows.length;
        for (let i = numRows - 1; i > 0; i--) {
            scheduleTable.deleteRow(i);
        }
    }

    document.getElementById('employee-schedule-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const startDate = new Date(event.target.schedule_start_date.value);
        const endDate = new Date(event.target.schedule_end_date.value);
        const workTime = event.target.work_time.value;

        if (startDate <= endDate) {
            clearEmployeeScheduleTable();

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                addEmployeeScheduleRow(date, workTime);
            }
        } else {
            alert('The end date must be after the start date.');
        }
    });

    // Disable the Project ID select if there are no projects
    if (taskProjectIdSelect.childElementCount <= 1) {
        taskProjectIdSelect.disabled = true;
    }

    const projectTaskOrderCount = {};

    function getNextTaskOrderForProject(projectId) {
        if (!projectTaskOrderCount[projectId]) {
            projectTaskOrderCount[projectId] = 1;
        }
        return projectTaskOrderCount[projectId]++;
    }

    taskProjectIdSelect.addEventListener('change', function(event) {
        const projectId = event.target.value;
        const taskOrderInput = document.getElementById('task_order');
        taskOrderInput.value = getNextTaskOrderForProject(projectId);
    });

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateRandomWord(length, isVowel) {
        const vowels = 'aeiou';
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        let word = '';

        for (let i = 0; i < length; i++) {
            const letters = isVowel ? vowels : consonants;
            word += letters.charAt(Math.floor(Math.random() * letters.length));
            isVowel = !isVowel;
        }

        return word;
    }

    function addDays(date, days) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    function nextWeekdayDate(date, dayOfWeek) {
        const resultDate = new Date(date);
        resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
        return resultDate;
    }

    document.getElementById('generate-project').addEventListener('click', function() {
        const projectName = generateRandomWord(4, true);
        const projectDeadline = formatDate(addDays(new Date(), 15));

        document.getElementById('project_name').value = projectName;
        document.getElementById('project_deadline').value = projectDeadline;

        document.getElementById('project-form').submit();
    });

    document.getElementById('generate-task').addEventListener('click', function() {
        const taskName = generateRandomWord(8, true);
        const taskDeadline = formatDate(addDays(new Date(), 8));
        const taskPriority = getRandomInt(0, 2);
        const taskDuration = getRandomInt(1, 7);

        document.getElementById('task_name').value = taskName;
        document.getElementById('task_deadline').value = taskDeadline;
        document.getElementById('task_priority').value = taskPriority;
        document.getElementById('task_duration').value = taskDuration;

        document.getElementById('task-form').submit();
    });
                                                                           document.getElementById('generate-employee-schedule').addEventListener('click', function() {
    const startDate = nextWeekdayDate(new Date(), 1); // Next Monday
    const endDate = nextWeekdayDate(new Date(), 5); // Next Friday
    const workTime = [8, 8, 3, 8, 8];

    document.getElementById('schedule_start_date').value = formatDate(startDate);
    document.getElementById('schedule_end_date').value = formatDate(endDate);

    document.getElementById('employee-schedule-form').submit();

    // Set work time for each day
    const rows = scheduleTable.rows;
    for (let i = 1; i < rows.length; i++) {
        const workTimeCell = rows[i].cells[1];
        workTimeCell.textContent = workTime[i - 1];
    }
});
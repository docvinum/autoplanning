function autoPlanning() {
  const scheduleRows = document.querySelectorAll('#employee-schedule-table tr:not(:first-child)');
  const planningTable = document.getElementById('employee-planning-table');

  // Clear employee-planning-table
  while (planningTable.rows.length > 1) {
    planningTable.deleteRow(1);
  }

  scheduleRows.forEach(scheduleRow => {
    const newRow = planningTable.insertRow(-1);

    // Clone the existing schedule row structure
    newRow.innerHTML = scheduleRow.innerHTML;

    // Add an empty cell for Workload and Tasks columns
    newRow.insertCell(-1).textContent = '';
    newRow.insertCell(-1).textContent = '';
  });

  // Fetch the task rows every time the function is executed
  const taskRows = document.querySelectorAll('#task-table tr:not(:first-child)');

  taskRows.forEach(taskRow => {
    // Extract task information
    const taskId = taskRow.cells[0].textContent;
    const taskDuration = parseInt(taskRow.cells[6].textContent);

    // Iterate through scheduleRows to find an available slot
    for (let i = 0; i < scheduleRows.length; i++) {
      const scheduleRow = scheduleRows[i];
      const planningRow = planningTable.rows[i + 1];
      const availableWorkTimeInput = scheduleRow.cells[1].querySelector('input');
      const availableWorkTime = parseInt(availableWorkTimeInput.value);

      if (availableWorkTime >= taskDuration) {
        // Assign task to the employee's schedule
        availableWorkTimeInput.value = availableWorkTime - taskDuration;

        // Update Workload and Tasks columns in the planning table
        const workloadCell = planningRow.cells[2];
        const tasksCell = planningRow.cells[3];

        workloadCell.textContent = parseInt(workloadCell.textContent || '0') + taskDuration;
        tasksCell.textContent = tasksCell.textContent
          ? tasksCell.textContent + ', ' + taskId
          : taskId;

        // Break the loop as the task has been assigned
        break;
      }
    }
  });
}

function checkConditions() {
  const taskRows = document.querySelectorAll('#task-table tr:not(:first-child)');
  const scheduleRows = document.querySelectorAll('#employee-schedule-table tr:not(:first-child)');
  
  let totalTaskDuration = 0;
  let totalWorkCapacity = 0;
  let tasksExceedingDailyWorkTime = [];

  // Calculate total task duration
  taskRows.forEach(taskRow => {
    const taskDuration = parseInt(taskRow.cells[6].textContent);
    const taskId = taskRow.cells[0].textContent;

    totalTaskDuration += taskDuration;

    // Check if the task can be done in 1 day maximum
    if (taskDuration > 8) {
      tasksExceedingDailyWorkTime.push(taskId);
    }
  });

  // Calculate total work capacity
  scheduleRows.forEach(scheduleRow => {
    const availableWorkTimeInput = scheduleRow.cells[1].querySelector('input');
    const availableWorkTime = parseInt(availableWorkTimeInput.value);

    totalWorkCapacity += availableWorkTime;
  });

  if (totalTaskDuration > totalWorkCapacity) {
    alert(`The sum of all task durations (${totalTaskDuration}) exceeds the total work capacity of the employee (${totalWorkCapacity}). Please adjust tasks or the employee's schedule.`);
    return false;
  }

  if (tasksExceedingDailyWorkTime.length > 0) {
    alert(`The following tasks cannot be completed in 1 day: ${tasksExceedingDailyWorkTime.join(', ')}. Please adjust their durations or the daily work time.`);
    return false;
  }

  return true;
}

function handleClick() {
  if (checkConditions()) {
    autoPlanning();
  }
}

document.getElementById('autoplanning').addEventListener('click', handleClick);

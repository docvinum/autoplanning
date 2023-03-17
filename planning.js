function autoPlanning() {
  const taskRows = document.querySelectorAll('#task-table tr:not(:first-child)');
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

document.getElementById('autoplanning').addEventListener('click', autoPlanning);

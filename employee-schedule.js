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

function populateEmployeeSchedule(startDate, endDate, workTime) {
    let currentDate = new Date(startDate);
    let workTimeIndex = 0;

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const newRow = employeeScheduleTable.insertRow(-1);
        newRow.innerHTML = `
            <td>${currentDate.toISOString().split('T')[0]}</td>
            <td>
                <input type="number" min="0" value="${isWeekend ? 0 : workTime[workTimeIndex++]}" />
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

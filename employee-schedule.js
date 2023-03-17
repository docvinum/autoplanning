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

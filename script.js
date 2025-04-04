// Show current day and time
function updateCurrentDateTime() {
    const currentDateTime = new Date();
    const currentDay = currentDateTime.toDateString();
    const currentTime = currentDateTime.toLocaleTimeString();
    document.getElementById('current-day').textContent = `Today is: ${currentDay}, ${currentTime}`;
}

// Update the chart with the saved category data
function updateChart(categoryData) {
    const categories = categoryData.map(item => item.category);
    const hours = categoryData.map(item => parseFloat(item.hours) || 0); // Ensure it's a number, default to 0 if NaN

    const ctx = document.getElementById('statsChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: hours,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#33FF57", "#FF33FF", "#5733FF"],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw} hours`;
                        }
                    }
                }
            }
        }
    });
}

// Save category data to LocalStorage
function saveCategoryData() {
    const categoryInputs = document.querySelectorAll('.category-input');
    let categoryData = [];

    categoryInputs.forEach(input => {
        categoryData.push({
            category: input.getAttribute('data-category'),
            hours: input.value
        });
    });

    // Save data as JSON to LocalStorage
    localStorage.setItem('categoryData', JSON.stringify(categoryData));

    // Update the chart with the saved data
    updateChart(categoryData);
}

// Load saved data from LocalStorage (if available) on page load
window.onload = () => {
    updateCurrentDateTime();  // Display current date and time

    const savedData = JSON.parse(localStorage.getItem('categoryData'));
    if (savedData) {
        savedData.forEach(item => {
            const input = document.querySelector(`input[data-category="${item.category}"]`);
            if (input) {
                input.value = item.hours;
            }
        });
        updateChart(savedData);  // Update the chart with saved data
    }

    // Update the current time every second
    setInterval(updateCurrentDateTime, 1000);  // Updates every second
};

// Clear category data from LocalStorage and input fields
function clearCategoryData() {
    const categoryInputs = document.querySelectorAll('.category-input');
    categoryInputs.forEach(input => input.value = '');

    // Remove data from LocalStorage
    localStorage.removeItem('categoryData');

    // Clear the chart
    const ctx = document.getElementById('statsChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
            }]
        }
    });
}

// Add categories dynamically
function addCategory() {
    const name = document.getElementById('new-category').value.trim();
    if (name !== '') {
        const div = document.createElement('div');
        div.innerHTML = `<label>${name}: <input type="number" placeholder="Hours" class="category-input" data-category="${name}"></label>`;
        document.getElementById('category-list').appendChild(div);
        document.getElementById('new-category').value = '';
    }
}

// To-Do List
function addTodo() {
    const task = document.getElementById('todo-input').value;
    const type = document.getElementById('task-type').value;
    if (task !== '') {
        const item = document.createElement('li');
        item.textContent = task;
        if (type === 'time-saving') item.style.color = 'green';
        document.getElementById('todo-list').appendChild(item);
    }
}

// Schedule
function addSchedule() {
    const task = document.getElementById('task-input').value;
    const time = document.getElementById('task-time').value;
    if (task && time) {
        const item = document.createElement('li');
        item.textContent = `${task} - ${time} hours`;
        document.getElementById('schedule-list').appendChild(item);
    }
}

// Reminders
function addReminder() {
    const reminder = document.getElementById('reminder-input').value;
    if (reminder !== '') {
        const item = document.createElement('li');
        item.textContent = reminder;
        document.getElementById('reminder-list').appendChild(item);
    }
}

// Event listeners for Save and Clear buttons
document.getElementById('save-button').addEventListener('click', saveCategoryData);
document.getElementById('clear-button').addEventListener('click', clearCategoryData);

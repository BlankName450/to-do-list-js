const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const listContainer = document.querySelector('ul');

// ======================
// IMPROVED STORAGE SYSTEM
// ======================

// Save tasks as JSON (safer and more flexible)
function savedData() {
  const tasks = Array.from(listContainer.children).map(task => ({
    text: task.querySelector('span').textContent,
    completed: task.classList.contains('checked')
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from JSON
function showTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
  listContainer.innerHTML = tasks.map(task => `
    <li class="${task.completed ? 'checked' : ''}">
      <span>${escapeHTML(task.text)}</span>
      <button class="edit-btn">🖋️</button>
      <button class="delete-btn">🗑️</button>
    </li>
  `).join('');
}

// Prevent XSS attacks (critical security fix)
function escapeHTML(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ======================
// EVENT HANDLERS (UNCHANGED STRUCTURE)
// ======================

addTaskButton.addEventListener('click', () => {
    if (taskInput.value.trim() === '') {
        alert('Please enter a valid task.');
        return;
    }
    
    const newTask = document.createElement('li');
    newTask.innerHTML = `
        <span>${escapeHTML(taskInput.value.trim())}</span>
        <button class="edit-btn">🖋️</button>
        <button class="delete-btn">🗑️</button>
    `;
    
    taskList.appendChild(newTask);
    taskInput.value = '';
    savedData(); // Now saves structured JSON
});

listContainer.addEventListener('click', function(e) {
    const taskItem = e.target.closest('li');
    if (!taskItem) return;

    if (e.target.tagName === 'SPAN' || e.target.tagName === 'LI') {
        taskItem.classList.toggle('checked');
        savedData();
    }
    else if (e.target.classList.contains('edit-btn')) {
        const span = taskItem.querySelector('span');
        const newText = prompt('Edit task:', span.textContent);
        if (newText !== null && newText.trim() !== '') {
            span.textContent = escapeHTML(newText.trim());
            savedData();
        }
    }
    else if (e.target.classList.contains('delete-btn')) {
        taskItem.remove();
        savedData();
    }
});

// Initialize the app
showTasks();
        
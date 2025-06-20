// To-Do List with localStorage persistence

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    let arrayOfTasks = loadTasks();

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));
    }

    function loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function renderTasks() {
        taskList.innerHTML = '';
        arrayOfTasks.forEach((task, index) => {
            const newTask = document.createElement('li');
            if (task.checked) newTask.classList.add('checked');

            const span = document.createElement('span');
            span.textContent = task.text;
            newTask.appendChild(span);

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.textContent = '🖋️';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newText = prompt('edit task', span.textContent);
                if (newText !== null && newText !== '') {
                    span.textContent = newText;
                    arrayOfTasks[index].text = newText;
                    saveTasks();
                }
            });

            // Delete button
            const dltBtn = document.createElement('button');
            dltBtn.textContent = '🗑️';
            dltBtn.className = 'delete-btn';
            dltBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                arrayOfTasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            // Toggle checked on click (except on buttons)
            newTask.addEventListener('click', (e) => {
                if (e.target === editBtn || e.target === dltBtn) return;
                newTask.classList.toggle('checked');
                arrayOfTasks[index].checked = !arrayOfTasks[index].checked;
                saveTasks();
            });

            newTask.appendChild(editBtn);
            newTask.appendChild(dltBtn);
            taskList.appendChild(newTask);
        });
    }

    addTaskButton.addEventListener('click', () => {
        if (taskInput.value === '') {
            alert('Please enter a task.');
            return;
        }
        arrayOfTasks.push({ text: taskInput.value, checked: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    });

    // Optional: Add task on Enter key
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    renderTasks();
});
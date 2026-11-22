
const form = document.querySelector("#todo-form");
const input = document.querySelector("#task");
const list = document.querySelector("#todo-list");
const remainingCount = document.querySelector("#remaining-count");
const userList = document.querySelector("#user-list");

// Load previously saved tasks
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!Array.isArray(tasks)) tasks = [];
} catch (error) {
    tasks = [];
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update remaining task count
function updateCount() {
    const remaining = tasks.filter(task => !task.done).length;

    remainingCount.textContent =
        "Remaining tasks: " + remaining;
}

// Display all tasks
function displayTasks() {
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.done) {
            span.classList.add("done");
        }

        // Mark task as completed
        span.addEventListener("click", () => {
            task.done = !task.done;
            saveTasks();
            displayTasks();
        });

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        // Second event listener for deleting tasks
        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.append(span, deleteButton);
        list.append(li);
    });

    updateCount();
}

// Add a new task
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    tasks.push({
        text: text,
        done: false
    });

    saveTasks();
    displayTasks();
    form.reset();
});

// Show saved tasks when the page loads
displayTasks();

// Fetch users from JSONPlaceholder API
fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return response.json();
    })
    .then(users => {
        userList.innerHTML = "";

        users.forEach(user => {
            const li = document.createElement("li");
            li.textContent = user.name;
            userList.append(li);
        });
    })
    .catch(error => {
        console.error("Error fetching users:", error);
        userList.textContent = "Unable to load users.";
    });

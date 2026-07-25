/* ==========================================
   TASK MANAGER
========================================== */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

/* Save Tasks */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Render Tasks */
function renderTasks() {

    if (!taskList) return;

    taskList.innerHTML = "";

    const totalTasks = tasks.length;

    const completedTasks =
        tasks.filter(task => task.status === "Completed").length;

    const cards = document.querySelectorAll(".card h1");

    if (cards.length >= 2) {
        cards[0].textContent = totalTasks;
        cards[1].textContent = completedTasks;
    }

    tasks.forEach((task, index) => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";

        taskCard.innerHTML = `
            <div class="task-info">
                <h3>${task.name}</h3>
                <p>Status: ${task.status}</p>
            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${index})">
                    Toggle
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${index})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskCard);

    });

}

/* Add Task */
function addTask() {

    const taskInput =
        document.getElementById("taskInput");

    const taskStatus =
        document.getElementById("taskStatus");

    const taskName =
        taskInput.value.trim();

    if (taskName === "") {

        alert("Please enter a task.");

        return;

    }

    tasks.push({

        name: taskName,
        status: taskStatus.value

    });

    saveTasks();

    renderTasks();

    taskInput.value = "";

}

/* Delete Task */
function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();

}

/* Toggle Task */
function toggleTask(index) {

    tasks[index].status =
        tasks[index].status === "Pending"
            ? "Completed"
            : "Pending";

    saveTasks();

    renderTasks();

}

renderTasks();


/* ==========================================
   SIDEBAR
========================================== */

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (sidebar) {

        sidebar.classList.toggle("show");

    }

}


/* ==========================================
   SECTION NAVIGATION
========================================== */

function showSection(sectionId, element) {

    const sections =
        document.querySelectorAll(".content-section");

    sections.forEach(section => {

        section.classList.add("hidden");

    });

    document
        .getElementById(sectionId)
        .classList.remove("hidden");

    const menuItems =
        document.querySelectorAll(".menu li");

    menuItems.forEach(item => {

        item.classList.remove("active");

    });

    if (element) {

        element.classList.add("active");

    }

}
/* ===========================
   KANBAN BOARD
=========================== */

let kanbanTasks =
JSON.parse(localStorage.getItem("kanbanTasks")) || [];

let nextKanbanId =
kanbanTasks.length
? Math.max(...kanbanTasks.map(t=>t.id))+1
:1;

function saveKanbanTasks(){

    localStorage.setItem(
        "kanbanTasks",
        JSON.stringify(kanbanTasks)
    );

}

function addKanbanTask(){

    const input=document.getElementById("kanbanTaskInput");

    const text=input.value.trim();

    if(text===""){

        alert("Enter a task");

        return;

    }

    kanbanTasks.push({

        id:nextKanbanId++,

        text:text,

        status:"todo"

    });

    saveKanbanTasks();

    renderKanban();

    input.value="";

}

function renderKanban(){

    const todo=document.getElementById("todo");
    const progress=document.getElementById("progress");
    const done=document.getElementById("done");

    if(!todo||!progress||!done)
        return;

    todo.innerHTML="";
    progress.innerHTML="";
    done.innerHTML="";

    kanbanTasks.forEach(task=>{

        const card=document.createElement("div");

        card.className="kanban-task";

        card.id=task.id;

        card.draggable=true;

        card.addEventListener(
            "dragstart",
            drag
        );

        card.innerHTML=`

            <p>${task.text}</p>

            <div class="kanban-actions">

                <button
                class="edit-btn"
                onclick="editKanbanTask(${task.id})">

                    Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteKanbanTask(${task.id})">

                    Delete

                </button>

            </div>

        `;

        if(task.status==="todo")
            todo.appendChild(card);

        if(task.status==="progress")
            progress.appendChild(card);

        if(task.status==="done")
            done.appendChild(card);

    });

}

function editKanbanTask(id){

    const task=
    kanbanTasks.find(
        t=>t.id===id
    );

    if(!task)
        return;

    const updated=
    prompt(
        "Edit Task",
        task.text
    );

    if(updated===null)
        return;

    if(updated.trim()==="")
        return;

    task.text=updated.trim();

    saveKanbanTasks();

    renderKanban();

}

function deleteKanbanTask(id){

    kanbanTasks=
    kanbanTasks.filter(
        t=>t.id!==id
    );

    saveKanbanTasks();

    renderKanban();

}

function drag(event){

    event.dataTransfer.setData(
        "text",
        event.target.id
    );

}

function allowDrop(event){

    event.preventDefault();

}

function drop(event){

    event.preventDefault();

    let column=event.target;

    while(
        column &&
        !column.classList.contains("kanban-tasks")
    ){

        column=column.parentElement;

    }

    if(!column)
        return;

    const id=Number(
        event.dataTransfer.getData("text")
    );

    const task=
    kanbanTasks.find(
        t=>t.id===id
    );

    if(!task)
        return;

    task.status=column.id;

    saveKanbanTasks();

    renderKanban();

}

renderKanban();


/* ==========================================
   POMODORO TIMER
========================================== */

let timer = null;

let minutes = 25;

let seconds = 0;

let isRunning = false;

let sessions = 0;


/* Update Display */
function updateTimerDisplay() {

    const display =
        document.getElementById("timer");

    if (!display) return;

    const min =
        String(minutes).padStart(2, "0");

    const sec =
        String(seconds).padStart(2, "0");

    display.textContent =
        `${min}:${sec}`;

}


/* Start Timer */
function startTimer() {

    if (isRunning) return;

    isRunning = true;

    timer = setInterval(() => {

        if (minutes === 0 && seconds === 0) {

            clearInterval(timer);

            isRunning = false;

            sessions++;

            const sessionCount =
                document.getElementById("sessionCount");

            if (sessionCount) {
                sessionCount.textContent =
                    sessions;
            }

            alert("Pomodoro Session Completed!");

            return;

        }

        if (seconds === 0) {

            minutes--;

            seconds = 59;

        } else {

            seconds--;

        }

        updateTimerDisplay();

    }, 1000);

}


/* Pause Timer */
function pauseTimer() {

    clearInterval(timer);

    isRunning = false;

}


/* Reset Timer */
function resetTimer() {

    clearInterval(timer);

    isRunning = false;

    minutes = 25;

    seconds = 0;

    updateTimerDisplay();

}

updateTimerDisplay();
/* ==========================================
   NOTES SYSTEM
========================================== */

let notes =
    JSON.parse(localStorage.getItem("notes")) || [];

/* Save Notes */
function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

}

/* Render Notes */
function renderNotes() {

    const notesGrid =
        document.getElementById("notesGrid");

    if (!notesGrid) return;

    notesGrid.innerHTML = "";

    notes.forEach((note, index) => {

        const noteCard =
            document.createElement("div");

        noteCard.className = "note-card";

        noteCard.innerHTML = `

            <button
                class="note-delete"
                onclick="deleteNote(${index})">

                Delete

            </button>

            <p>${note}</p>

        `;

        notesGrid.appendChild(noteCard);

    });

}

/* Add Note */
function addNote() {

    const noteInput =
        document.getElementById("noteInput");

    if (!noteInput) return;

    const text =
        noteInput.value.trim();

    if (text === "") {

        alert("Please write a note.");

        return;

    }

    notes.push(text);

    saveNotes();

    renderNotes();

    noteInput.value = "";

}

/* Delete Note */
function deleteNote(index) {

    notes.splice(index, 1);

    saveNotes();

    renderNotes();

}

renderNotes();


/* ==========================================
   ANALYTICS CHARTS
========================================== */

const taskCanvas =
    document.getElementById("taskChart");

if (taskCanvas) {

    new Chart(taskCanvas, {

        type: "doughnut",

        data: {

            labels: [
                "Completed",
                "Pending"
            ],

            datasets: [

                {

                    data: [8, 4],

                    backgroundColor: [
                        "#2563eb",
                        "#93c5fd"
                    ]

                }

            ]

        }

    });

}

const studyCanvas =
    document.getElementById("studyChart");

if (studyCanvas) {

    new Chart(studyCanvas, {

        type: "bar",

        data: {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets: [

                {

                    label: "Study Hours",

                    data: [
                        2,
                        4,
                        3,
                        5,
                        6,
                        4,
                        7
                    ],

                    backgroundColor:
                        "#2563eb"

                }

            ]

        }

    });

}


/* ==========================================
   DARK MODE
========================================== */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark-mode"
    );

    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        localStorage.setItem(
            "darkMode",
            "enabled"
        );

    } else {

        localStorage.setItem(
            "darkMode",
            "disabled"
        );

    }

}


/* ==========================================
   LOAD DARK MODE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const darkMode =
            localStorage.getItem(
                "darkMode"
            );

        if (
            darkMode === "enabled"
        ) {

            document.body.classList.add(
                "dark-mode"
            );

            const toggle =
                document.getElementById(
                    "darkModeToggle"
                );

            if (toggle) {

                toggle.checked = true;

            }

        }

    }
);
/* ==========================================
   AUTHENTICATION SYSTEM
========================================== */

/* Show Signup Form */
function showSignup() {

    document
        .getElementById("loginForm")
        .classList.add("hidden");

    document
        .getElementById("signupForm")
        .classList.remove("hidden");

}

/* Show Login Form */
function showLogin() {

    document
        .getElementById("signupForm")
        .classList.add("hidden");

    document
        .getElementById("loginForm")
        .classList.remove("hidden");

}


/* ==========================================
   SIGNUP
========================================== */

function signupUser() {

    const name =
        document.getElementById("signupName")
        .value.trim();

    const email =
        document.getElementById("signupEmail")
        .value.trim();

    const password =
        document.getElementById("signupPassword")
        .value.trim();

    if (!name || !email || !password) {

        alert("Please fill all fields.");

        return;

    }

    const user = {

        name,
        email,
        password

    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert(
        "Signup successful! Please login."
    );

    document.getElementById(
        "signupName"
    ).value = "";

    document.getElementById(
        "signupEmail"
    ).value = "";

    document.getElementById(
        "signupPassword"
    ).value = "";

    showLogin();

}


/* ==========================================
   LOGIN
========================================== */

function loginUser() {

    const email =
        document.getElementById("loginEmail")
        .value.trim();

    const password =
        document.getElementById("loginPassword")
        .value.trim();

    const storedUser =
        JSON.parse(
            localStorage.getItem("user")
        );

    if (!storedUser) {

        alert(
            "No account found. Please signup first."
        );

        return;

    }

    if (
        storedUser.email !== email ||
        storedUser.password !== password
    ) {

        alert(
            "Invalid Email or Password."
        );

        return;

    }

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

    document
        .getElementById("usernameDisplay")
        .textContent = storedUser.name;

    document
        .getElementById("authContainer")
        .classList.add("hidden");

    document
        .getElementById("appContainer")
        .classList.remove("hidden");

}


/* ==========================================
   LOGOUT
========================================== */

function logoutUser() {

    localStorage.removeItem(
        "isLoggedIn"
    );

    document
        .getElementById("appContainer")
        .classList.add("hidden");

    document
        .getElementById("authContainer")
        .classList.remove("hidden");

    showLogin();

}


/* ==========================================
   AUTO LOGIN
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const authContainer =
            document.getElementById(
                "authContainer"
            );

        const appContainer =
            document.getElementById(
                "appContainer"
            );

        const storedUser =
            JSON.parse(
                localStorage.getItem("user")
            );

        const isLoggedIn =
            localStorage.getItem(
                "isLoggedIn"
            );

        if (
            storedUser &&
            isLoggedIn === "true"
        ) {

            authContainer.classList.add(
                "hidden"
            );

            appContainer.classList.remove(
                "hidden"
            );

            document
                .getElementById(
                    "usernameDisplay"
                )
                .textContent =
                storedUser.name;

        } else {

            authContainer.classList.remove(
                "hidden"
            );

            appContainer.classList.add(
                "hidden"
            );

        }

    }
);
/* ==========================================
   CALENDAR EVENTS
========================================== */

let events =
    JSON.parse(localStorage.getItem("events")) || [];

/* Save Events */
function saveEvents() {

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );

}

/* Render Events */
function renderEvents() {

    const eventList =
        document.getElementById("eventList");

    if (!eventList) return;

    eventList.innerHTML = "";

    events.forEach((event, index) => {

        const eventCard =
            document.createElement("div");

        eventCard.className = "event-card";

        eventCard.innerHTML = `

            <div class="event-info">

                <h3>${event.title}</h3>

                <p>${event.date}</p>

            </div>

            <button
                class="event-delete"
                onclick="deleteEvent(${index})">

                Delete

            </button>

        `;

        eventList.appendChild(eventCard);

    });

}

/* Add Event */
function addEvent() {

    const title =
        document.getElementById("eventTitle");

    const date =
        document.getElementById("eventDate");

    if (!title || !date) return;

    if (
        title.value.trim() === "" ||
        date.value === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    events.push({

        title: title.value.trim(),

        date: date.value

    });

    saveEvents();

    renderEvents();

    title.value = "";

    date.value = "";

}

/* Delete Event */
function deleteEvent(index) {

    events.splice(index, 1);

    saveEvents();

    renderEvents();

}

renderEvents();


/* ==========================================
   NOTIFICATIONS
========================================== */

function enableNotifications() {

    if (!("Notification" in window)) {

        alert(
            "This browser doesn't support notifications."
        );

        return;

    }

    Notification.requestPermission()

        .then(permission => {

            if (permission === "granted") {

                new Notification(

                    "Notifications Enabled 🎉",

                    {

                        body:
                            "You will now receive study reminders."

                    }

                );

            } else {

                alert(
                    "Notification permission denied."
                );

            }

        });

}


/* ==========================================
   STUDY REMINDER
========================================== */

function sendStudyReminder() {

    if (
        Notification.permission === "granted"
    ) {

        new Notification(

            "Study Reminder 📚",

            {

                body:
                    "Time to focus on your study goals!"

            }

        );

    }

}


/* ==========================================
   AUTO REMINDER
========================================== */

setInterval(() => {

    sendStudyReminder();

}, 3600000);


/* ==========================================
   FINAL INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderTasks();

        renderKanban();

        renderNotes();

        renderEvents();

        updateTimerDisplay();

    }
);
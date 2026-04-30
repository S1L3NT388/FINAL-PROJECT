let schedule = [];
let editId = null; 

const dayNames = {
    "Пн": "Понеділок",
    "Вв": "Вівторок",
    "Ср": "Середа",
    "Чт": "Четвер",
    "Пт": "П'ятниця"
};

function saveLesson() {
    const subject = document.getElementById('subject').value;
    const teacher = document.getElementById('teacher').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;

    if (!subject || !teacher || !time) {
        alert("Заповни всі поля.");
        return;
    }

    if (editId !== null) {
        const index = schedule.findIndex(l => l.id === editId);
        schedule[index] = { ...schedule[index], subject, teacher, day, time };
        editId = null;
        document.querySelector('.add-btn').innerText = "Додати заняття";
    } else {
        const newLesson = {
            id: Date.now(),
            subject,
            teacher,
            day,
            time
        };
        schedule.push(newLesson);
    }

    clearInputs();
    renderSchedule();
}

function clearInputs() {
    document.getElementById('subject').value = '';
    document.getElementById('teacher').value = '';
    document.getElementById('time').value = '';
}


function deleteLesson(id) {
    schedule = schedule.filter(lesson => lesson.id !== id);
    renderSchedule();
}

function editLesson(id) {
    const lesson = schedule.find(l => l.id === id);
    document.getElementById('subject').value = lesson.subject;
    document.getElementById('teacher').value = lesson.teacher;
    document.getElementById('day').value = lesson.day;
    document.getElementById('time').value = lesson.time;

    editId = id;
    document.querySelector('.add-btn').innerText = "Зберегти зміни";
}

function renderSchedule() {
    const listContainer = document.querySelector('.lesson-list');
    listContainer.innerHTML = '';

    const grouped = schedule.reduce((acc, lesson) => {
        if (!acc[lesson.day]) acc[lesson.day] = [];
        acc[lesson.day].push(lesson);
        return acc;
    }, {});

    const dayOrder = ["Пн", "Вв", "Ср", "Чт", "Пт"];

    dayOrder.forEach(dayCode => {
        if (grouped[dayCode]) {
            const dayHeader = document.createElement('h3');
            dayHeader.innerText = dayNames[dayCode];
            dayHeader.style.margin = "20px 0 10px 0";
            dayHeader.style.color = "#4f46e5";
            listContainer.appendChild(dayHeader);

            grouped[dayCode].sort((a, b) => a.time.localeCompare(b.time));

            grouped[dayCode].forEach(lesson => {
                const li = document.createElement('li');
                li.className = 'lesson-card';
                li.innerHTML = `
                    <div class="lesson-title">${lesson.subject}</div>
                    <div class="lesson-info">
                        <span>${lesson.teacher} | <strong>${lesson.time}</strong></span>
                        <div>
                            <button onclick="editLesson(${lesson.id})" style="color: blue; cursor:pointer; background:none; border:none;">Ред.</button>
                            <button onclick="deleteLesson(${lesson.id})" style="color: red; cursor:pointer; background:none; border:none; margin-left:10px;">Вид.</button>
                        </div>
                    </div>
                `;
                listContainer.appendChild(li);
            });
        }
    });
}

document.querySelector('.add-btn').addEventListener('click', saveLesson);
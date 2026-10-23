
const form = document.getElementById("resultForm");
const result = document.getElementById("result");
const savedResults = document.getElementById("savedResults");

let students = JSON.parse(localStorage.getItem("students")) || [];

const saveStudents = () =>
    localStorage.setItem("students", JSON.stringify(students));

const calculateResult = (event) => {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const values = ["english", "math", "computer"].map(id =>
        document.getElementById(id).value
    );

    if (!name || values.some(mark => mark === "")) {
        result.innerHTML = '<p class="text-danger">Fill in all fields.</p>';
        return;
    }

    const [english, math, computer] = values.map(Number);
    const marks = [english, math, computer];

    if (marks.some(mark => !Number.isFinite(mark) || mark < 0 || mark > 100)) {
        result.innerHTML = '<p class="text-danger">Marks must be between 0 and 100.</p>';
        return;
    }

    const obtainedMarks = marks.reduce((sum, mark) => sum + mark, 0);
    const percentage = (obtainedMarks / 300) * 100;

    const grade = percentage >= 80 ? "A+" :
        percentage >= 70 ? "A" :
            percentage >= 60 ? "B" :
                percentage >= 50 ? "C" :
                    percentage >= 40 ? "D" : "F";

    const status = marks.every(mark => mark >= 40) ? "Pass" : "Fail";

    const student = {
        name, english, math, computer,
        totalMarks: 300, obtainedMarks,
        percentage: percentage.toFixed(2), grade, status
    };

    students.push(student);
    saveStudents();

    result.innerHTML = `
        <div class="result-box">
            <h4>${student.name}</h4>
            <p>Obtained Marks: ${obtainedMarks}/300</p>
            <p>Percentage: ${student.percentage}%</p>
            <p>Grade: ${grade}</p>
            <p>Status: <strong>${status}</strong></p>
        </div>`;

    displayStudents();
    form.reset();
};

const displayStudents = () => {
    savedResults.innerHTML = students.length
        ? students.map((s, i) => `
            <div class="student-record">
                <h5>${s.name}</h5>
                <p>${s.obtainedMarks}/300 | ${s.percentage}% | ${s.grade} | ${s.status}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${i})">
                    Delete
                </button>
            </div>`).join("")
        : "<p>No saved results found.</p>";
};

const deleteStudent = (index) => {
    students.splice(index, 1);
    saveStudents();
    displayStudents();
};

form.addEventListener("submit", calculateResult);
displayStudents();

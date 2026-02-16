const clips = [
    { id: "I01", file: "audio/Clip1.wav", type: "Instrumental" },
    { id: "S01", file: "audio/Clip2.wav", type: "Singing" },
    { id: "C01", file: "audio/Clip3.wav", type: "Complete Song" }
];

clips.sort(() => Math.random() - 0.5);


let current = 0;
let responses = [];

const audioPlayer = document.getElementById("audioPlayer");
const clipTitle = document.getElementById("clipTitle");

loadClip();

audioPlayer.onplay = () => {
    window.audioPlayed = true;
};

function loadClip() {
    const clip = clips[current];
    clipTitle.innerText = `${clip.type} Clip ${clip.id}`;
    audioPlayer.src = clip.file;

    generateQuestions(clip.type);
}
function clearRating() {
    document.querySelectorAll("input[name='rating']").forEach(r => r.checked = false);
}

function nextClip() {

    let answers = [];
    const questions = document.querySelectorAll(".question");

    for (let i = 0; i < questions.length; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (!selected) {
            alert("Please answer all questions!");
            return;
        }
        answers.push(selected.value);
    }

    responses.push({
        name: document.getElementById("name").value,
        background: document.getElementById("background").value,
        clip: clips[current].id,
        type: clips[current].type,
        ratings: answers.join(",")
    });

    current++;

    if (current < clips.length) {
        loadClip();
    } else {
        downloadCSV();
        alert("Thank you! Responses downloaded.");
    }
}


function downloadCSV() {
    let csv = "Name,Background,Clip,Type,Q1,Q2,Q3,Q4\n";

    responses.forEach(r => {
        let row = `${r.name},${r.background},${r.clip},${r.type},${r.ratings}\n`;
        csv += row;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mos_results.csv";
    a.click();
}

function generateQuestions(type) {

    const container = document.getElementById("questionBlock");
    container.innerHTML = "";

    let questions = [];

    if (type === "Instrumental") {
        questions = [
            "Musical Naturalness",
            "Melody & Harmony Quality",
            "Overall Quality"
        ];
    }

    if (type === "Singing") {
        questions = [
            "Vocal Naturalness",
            "Marathi Pronunciation Clarity",
            "Pitch & Expression",
            "Overall Singing Quality"
        ];
    }

    if (type === "Complete Song") {
        questions = [
            "Overall Listening Experience",
            "Music–Vocal Synchronization",
            "Mixing & Balance Quality",
            "Professional Quality"
        ];
    }

    questions.forEach((q, index) => {
        let html = `<div class="question">
                        <p>${q}</p>
                        <div class="rating-buttons">`;

        for (let i = 1; i <= 5; i++) {
            html += `<label>
                        <input type="radio" name="q${index}" value="${i}">
                        <span>${i}</span>
                     </label>`;
        }

        html += `</div></div>`;

        container.innerHTML += html;
    });
}

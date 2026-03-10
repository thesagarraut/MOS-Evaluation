const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyap0Xae-QbcHIzK6ANH_tgtxTfQIxAspgWk1zMUOyCCXEcvVqFQ-g8hTEk4TcXMw_u/exec";

const clips = [
    { id: "I01", file: "audio/I01.wav", type: "Instrumental" },
    { id: "I02", file: "audio/I02.wav", type: "Instrumental" },
    { id: "I03", file: "audio/I03.wav", type: "Instrumental" },
    { id: "I04", file: "audio/I04.wav", type: "Instrumental" },
    { id: "I05", file: "audio/I05.wav", type: "Instrumental" },
    { id: "I06", file: "audio/I06.wav", type: "Instrumental" },
    { id: "I07", file: "audio/I07.wav", type: "Instrumental" },
    { id: "I08", file: "audio/I08.wav", type: "Instrumental" },
    { id: "I09", file: "audio/I09.wav", type: "Instrumental" },
    { id: "I10", file: "audio/I10.wav", type: "Instrumental" },
    
    { id: "S01", file: "audio/S01.wav", type: "Singing" },
    { id: "S02", file: "audio/S02.wav", type: "Singing" },
    { id: "S03", file: "audio/S03.wav", type: "Singing" },
    { id: "S04", file: "audio/S04.wav", type: "Singing" },
    { id: "S05", file: "audio/S05.wav", type: "Singing" },
    { id: "S06", file: "audio/S06.wav", type: "Singing" },
    { id: "S07", file: "audio/S07.wav", type: "Singing" },
    { id: "S08", file: "audio/S08.wav", type: "Singing" },
    { id: "S09", file: "audio/S09.wav", type: "Singing" },
    { id: "S010", file: "audio/S010.wav", type: "Singing" },
    
    { id: "C01", file: "audio/C01.wav", type: "Complete Song" },
    { id: "C02", file: "audio/C02.wav", type: "Complete Song" },
    { id: "C03", file: "audio/C03.wav", type: "Complete Song" },
    { id: "C04", file: "audio/C04.wav", type: "Complete Song" },
    { id: "C05", file: "audio/C05.wav", type: "Complete Song" },
    { id: "C06", file: "audio/C06.wav", type: "Complete Song" },
    { id: "C07", file: "audio/C07.wav", type: "Complete Song" },
    { id: "C08", file: "audio/C08.wav", type: "Complete Song" },
    { id: "C09", file: "audio/C09.wav", type: "Complete Song" },
    { id: "C10", file: "audio/C10.wav", type: "Complete Song" }
    
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

    let responseData = {
    name: document.getElementById("name").value,
    background: document.getElementById("background").value,
    clip: clips[current].id,
    type: clips[current].type
};

// Initialize all fields blank
responseData.musical_naturalness = "";
responseData.melody_quality = "";
responseData.vocal_naturalness = "";
responseData.pronunciation = "";
responseData.pitch_expression = "";
responseData.sync = "";
responseData.mixing = "";
responseData.professional = "";
responseData.overall = "";

// Assign based on type
if (clips[current].type === "Instrumental") {
    responseData.musical_naturalness = answers[0];
    responseData.melody_quality = answers[1];
    responseData.overall = answers[2];
}

if (clips[current].type === "Singing") {
    responseData.vocal_naturalness = answers[0];
    responseData.pronunciation = answers[1];
    responseData.pitch_expression = answers[2];
    responseData.overall = answers[3];
}

if (clips[current].type === "Complete Song") {
    responseData.overall = answers[0];
    responseData.sync = answers[1];
    responseData.mixing = answers[2];
    responseData.professional = answers[3];
}

sendToGoogle(responseData);



    current++;

if (current >= clips.length) {
    alert("Thank you! Your responses have been recorded.");
    return;
}

loadClip();
}


function sendToGoogle(data) {

    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    })
    .then(() => console.log("Data sent"))
    .catch(error => console.error("Error:", error));
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











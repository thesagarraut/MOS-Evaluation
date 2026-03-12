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
   
    
    { id: "C01", file: "audio/C01.wav", type: "Complete Song" },
    { id: "C02", file: "audio/C02.wav", type: "Complete Song" },
    { id: "C03", file: "audio/C03.wav", type: "Complete Song" },
    { id: "C04", file: "audio/C04.wav", type: "Complete Song" },
    { id: "C05", file: "audio/C05.wav", type: "Complete Song" },
    

    { id: "AI_I01", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I02", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I03", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I04", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I05", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I06", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I07", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I08", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I09", file: "audio/AI_I01.wav", type: "Instrumental" },
    { id: "AI_I010", file: "audio/AI_I01.wav", type: "Instrumental" },

    { id: "AI_S01", file: "audio/AI_S01.wav", type: "Singing" },
    { id: "AI_S02", file: "audio/AI_S02.wav", type: "Singing" },
    { id: "AI_S03", file: "audio/AI_S03.wav", type: "Singing" },
    { id: "AI_S04", file: "audio/AI_S04.wav", type: "Singing" },
    { id: "AI_S05", file: "audio/AI_S05.wav", type: "Singing" },

    { id: "AI_C01", file: "audio/AI_C01.wav", type: "Complete Song" },
    { id: "AI_C02", file: "audio/AI_C02.wav", type: "Complete Song" },
    { id: "AI_C03", file: "audio/AI_C03.wav", type: "Complete Song" },
    { id: "AI_C04", file: "audio/AI_C04.wav", type: "Complete Song" },
    { id: "AI_C05", file: "audio/AI_C05.wav", type: "Complete Song" },
    

];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function selectBatch() {

    function removePairs(realArray, aiArray, count) {

        shuffle(realArray);
        shuffle(aiArray);

        let selected = [];
        let usedNumbers = new Set();

        for (let clip of realArray) {

            let num = clip.id.replace(/\D/g,'');

            if (!usedNumbers.has(num) && selected.length < count) {
                selected.push(clip);
                usedNumbers.add(num);
            }
        }

        for (let clip of aiArray) {

            let num = clip.id.replace(/\D/g,'');

            if (!usedNumbers.has(num) && selected.length < count*2) {
                selected.push(clip);
                usedNumbers.add(num);
            }
        }

        return selected.slice(0,count*2);
    }

    let instrumental_real = clips.filter(c => c.type=="Instrumental" && !c.id.startsWith("AI"));
    let instrumental_ai = clips.filter(c => c.type=="Instrumental" && c.id.startsWith("AI"));

    let singing_real = clips.filter(c => c.type=="Singing" && !c.id.startsWith("AI"));
    let singing_ai = clips.filter(c => c.type=="Singing" && c.id.startsWith("AI"));

    let complete_real = clips.filter(c => c.type=="Complete Song" && !c.id.startsWith("AI"));
    let complete_ai = clips.filter(c => c.type=="Complete Song" && c.id.startsWith("AI"));

    let batch = [

        ...removePairs(instrumental_real, instrumental_ai, 3),
        ...removePairs(singing_real, singing_ai, 3),
        ...removePairs(complete_real, complete_ai, 4)

    ];

    return shuffle(batch);
}
let evaluationClips = selectBatch();

console.log(evaluationClips);

let current = 0;
let responses = [];

const audioPlayer = document.getElementById("audioPlayer");
const clipTitle = document.getElementById("clipTitle");

loadClip();

audioPlayer.onplay = () => {
    window.audioPlayed = true;
};

function loadClip() {
    const clip = evaluationClips[current];
    clipTitle.innerText = `${clip.type} Clip ${clip.id}`;
    document.getElementById("progressText").innerText =
        `Clip ${current + 1} / ${evaluationClips.length}`;
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
    clip: evaluationClips[current].id,
    type: evaluationClips[current].type
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
if (evaluationClips[current].type === "Instrumental") {
    responseData.musical_naturalness = answers[0];
    responseData.melody_quality = answers[1];
    responseData.overall = answers[2];
}

if (evaluationClips[current].type === "Singing") {
    responseData.vocal_naturalness = answers[0];
    responseData.pronunciation = answers[1];
    responseData.pitch_expression = answers[2];
    responseData.overall = answers[3];
}

if (evaluationClips[current].type === "Complete Song") {
    responseData.overall = answers[0];
    responseData.sync = answers[1];
    responseData.mixing = answers[2];
    responseData.professional = answers[3];
}

sendToGoogle(responseData);



    current++;

if (current >= evaluationClips.length) {
    alert("Thank you! Your responses have been recorded.");
    return;
}
window.audioPlayed = false;
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













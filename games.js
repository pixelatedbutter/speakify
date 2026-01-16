let currentScore = 0, questionIndex = 0, lives = 3, isMuted = false;
let currentLanguage = 'english', timer, timeLeft = 10;
let currentSentence = [];
let safariSelected = [];

const progressData = {
    english: { won: 0, completedGames: [] },
    japanese: { won: 0, completedGames: [] },
    french: { won: 0, completedGames: [] }
};

const allGameData = {
    english: [
        { type: 'match', title: 'Word Match', icon: '🔤', desc: "Find the synonym for common English words!", questions: [
            { q: "Synonym: Big", options: ["Large", "Small"], correct: "Large" },
            { q: "Synonym: Quick", options: ["Fast", "Slow"], correct: "Fast" },
            { q: "Synonym: Happy", options: ["Joyful", "Sad"], correct: "Joyful" },
            { q: "Synonym: Cold", options: ["Chilly", "Hot"], correct: "Chilly" },
            { q: "Synonym: Silent", options: ["Quiet", "Loud"], correct: "Quiet" }
        ]},
        { type: 'quiz', title: 'Grammar Quiz', icon: '📝', desc: "Master verb tenses and sentence structures here!", questions: [
            { q: "I ___ a student.", options: ["am", "is"], correct: "am" },
            { q: "She ___ pizza.", options: ["likes", "like"], correct: "likes" },
            { q: "They ___ running.", options: ["are", "is"], correct: "are" },
            { q: "He ___ a car.", options: ["has", "have"], correct: "has" },
            { q: "We ___ to the park.", options: ["go", "goes"], correct: "go" }
        ]},
        { type: 'scramble', title: 'Scramble', icon: '🧩', desc: "Rebuild broken sentences in the correct order.", questions: [
            { s: "I love coding" }, { s: "The sky is blue" }, { s: "Cats like milk" }, { s: "Open the door" }, { s: "Birds can fly" }
        ]},
        { type: 'safari', title: 'Word Safari', icon: '🦁', desc: "Find 3 words that belong to the category!", questions: [
            { cat: "Fruits", options: ["Apple", "Dog", "Banana", "Car", "Orange", "Blue"], correct: ["Apple", "Banana", "Orange"] },
            { cat: "Colors", options: ["Red", "Blue", "Run", "Green", "Jump", "Speak"], correct: ["Red", "Blue", "Green"] },
            { cat: "Animals", options: ["Tiger", "Bread", "Lion", "Zebra", "Milk", "Coffee"], correct: ["Tiger", "Lion", "Zebra"] },
            { cat: "Furniture", options: ["Chair", "Water", "Table", "Bed", "Bird", "Sky"], correct: ["Chair", "Table", "Bed"] },
            { cat: "Weather", options: ["Rain", "Sun", "Car", "Snow", "Phone", "Key"], correct: ["Rain", "Sun", "Snow"] }
        ]},
        { type: 'picture', title: 'Picture This', icon: '🖼️', desc: "Match the emoji to the correct vocabulary word.", questions: [
            { q: "🍎", options: ["Apple", "Bread", "Water"], correct: "Apple" },
            { q: "🚗", options: ["Car", "Plane", "Boat"], correct: "Car" },
            { q: "🏠", options: ["House", "School", "Work"], correct: "House" },
            { q: "🐶", options: ["Dog", "Cat", "Bird"], correct: "Dog" },
            { q: "🌞", options: ["Sun", "Moon", "Star"], correct: "Sun" }
        ]},
        { type: 'translator', title: 'Response Master', icon: '💬', desc: "Choose the most natural response.", questions: [
            { q: "Person A: How are you?", options: ["I am fine, thanks!", "Blue sky", "Yesterday"], correct: "I am fine, thanks!" },
            { q: "Person A: Nice to meet you.", options: ["Nice to meet you too!", "I like pizza", "Hello"], correct: "Nice to meet you too!" },
            { q: "Person A: What time is it?", options: ["It is 5 o'clock", "Yes please", "No thank you"], correct: "It is 5 o'clock" },
            { q: "Person A: Can you help me?", options: ["Sure, what's up?", "I am a cat", "Goodbye"], correct: "Sure, what's up?" },
            { q: "Person A: See you later!", options: ["Bye! Take care.", "I am hungry", "Red car"], correct: "Bye! Take care." }
        ]},
        { type: 'speed', title: 'Speed Master', icon: '⚡', desc: "Quick! Choose the opposite.", questions: [
            { q: "Opposite: Win", options: ["Lose", "Fail"], correct: "Lose" },
            { q: "Opposite: Day", options: ["Night", "Dark"], correct: "Night" },
            { q: "Opposite: Hot", options: ["Cold", "Warm"], correct: "Cold" },
            { q: "Opposite: Up", options: ["Down", "Low"], correct: "Down" },
            { q: "Opposite: Fast", options: ["Slow", "Quiet"], correct: "Slow" }
        ]},
        { type: 'architect', title: 'Architect', icon: '🏗️', desc: "Build sentences. Avoid the distraction words!", questions: [
            { s: "The dog barked yesterday", decoys: ["blue", "water"] },
            { s: "I like sweet apples", decoys: ["car", "green"] },
            { s: "She plays the piano", decoys: ["bird", "fast"] },
            { s: "We go to school", decoys: ["red", "apple"] },
            { s: "The sun is hot", decoys: ["cat", "run"] }
        ]},
        { type: 'detective', title: 'Error Detective', icon: '🔍', desc: "Click the word that is grammatically WRONG.", questions: [
            { s: "She have two apples.", options: ["She", "have", "two", "apples"], correct: "have" },
            { s: "They is going home.", options: ["They", "is", "going", "home"], correct: "is" },
            { s: "I doesn't like milk.", options: ["I", "doesn't", "like", "milk"], correct: "doesn't" },
            { s: "He run very fast.", options: ["He", "run", "very", "fast"], correct: "run" },
            { s: "We was at school.", options: ["We", "was", "at", "school"], correct: "was" }
        ]}
    ],
    japanese: [
        { type: 'match', title: 'Word Match', icon: '🎎', desc: "Match English to Romaji.", questions: [{ q: "Water", options: ["Mizu", "Inu"], correct: "Mizu" }, { q: "Teacher", options: ["Sensei", "Gakusei"], correct: "Sensei" }, { q: "Friend", options: ["Tomodachi", "Neko"], correct: "Tomodachi" }, { q: "School", options: ["Gakkou", "Mizu"], correct: "Gakkou" }, { q: "Today", options: ["Kyou", "Ashita"], correct: "Kyou" }] },
        { type: 'quiz', title: 'Grammar Quiz', icon: '⛩️', desc: "Basic sentence particles.", questions: [{ q: "Watashi __ Tanaka desu.", options: ["wa", "o"], correct: "wa" }, { q: "Sushi __ tabemasu.", options: ["o", "wa"], correct: "o" }, { q: "Doko __ desu ka.", options: ["desu", "ka"], correct: "desu" }, { q: "Inu __ suki desu.", options: ["ga", "wa"], correct: "ga" }, { q: "Nihongo __ hanashimasu.", options: ["o", "ni"], correct: "o" }] },
        { type: 'scramble', title: 'Scramble', icon: '🍣', desc: "Fix the phrase.", questions: [{ s: "Ohayou gozaimasu" }, { s: "Watashi wa Tanaka" }, { s: "Kore wa nan" }, { s: "Sushi ga suki" }, { s: "Genki desu ka" }] },
        { type: 'safari', title: 'Word Safari', icon: '🍡', desc: "Find 3 words in the category!", questions: [
            { cat: "Animals", options: ["Inu", "Neko", "Tori", "Mizu", "Sushi", "Yama"], correct: ["Inu", "Neko", "Tori"] },
            { cat: "Food", options: ["Sushi", "Ramen", "Mochi", "Haha", "Chichi", "Inu"], correct: ["Sushi", "Ramen", "Mochi"] },
            { cat: "Family", options: ["Haha", "Chichi", "Ani", "Umi", "Yama", "Kawa"], correct: ["Haha", "Chichi", "Ani"] },
            { cat: "Nature", options: ["Yama", "Kawa", "Umi", "Neko", "Inu", "Mizu"], correct: ["Yama", "Kawa", "Umi"] },
            { cat: "Numbers", options: ["Ichi", "Ni", "San", "Pan", "Bento", "Sushi"], correct: ["Ichi", "Ni", "San"] }
        ]},
        { type: 'picture', title: 'Picture This', icon: '🗾', desc: "Match emoji to word.", questions: [{ q: "🐈", options: ["Neko", "Inu", "Tori"], correct: "Neko" }, { q: "🗻", options: ["Yama", "Umi", "Kawa"], correct: "Yama" }, { q: "🍱", options: ["Bento", "Sushi", "Ramen"], correct: "Bento" }, { q: "🌸", options: ["Sakura", "Hana", "Kusa"], correct: "Sakura" }, { q: "🐕", options: ["Inu", "Neko", "Tori"], correct: "Inu" }] },
        { type: 'translator', title: 'Response Master', icon: '💬', desc: "Natural responses.", questions: [{ q: "A: O-genki desu ka?", options: ["Genki desu!", "Mizu", "Neko"], correct: "Genki desu!" }, { q: "A: Arigatou!", options: ["Douitashimashite", "Ohayou", "Iie"], correct: "Douitashimashite" }, { q: "A: Ohayou!", options: ["Ohayou!", "Konbanwa", "Sayounara"], correct: "Ohayou!" }, { q: "A: Itadakimasu!", options: ["Gochisousama", "Arigatou", "Hai"], correct: "Gochisousama" }, { q: "A: Sayounara!", options: ["Mata ne!", "Ohayou", "Mizu"], correct: "Mata ne!" }] },
        { type: 'speed', title: 'Speed Master', icon: '⚡', desc: "Opposites.", questions: [{ q: "Opposite: Hayai", options: ["Osoi", "Takai"], correct: "Osoi" }, { q: "Opposite: Ookii", options: ["Chiisai", "Atsui"], correct: "Chiisai" }, { q: "Opposite: Atsui", options: ["Samui", "Nagai"], correct: "Samui" }, { q: "Opposite: Shiroi", options: ["Kuroi", "Aoi"], correct: "Kuroi" }, { q: "Opposite: Ii", options: ["Warui", "Chotto"], correct: "Warui" }] },
        { type: 'architect', title: 'Architect', icon: '🏯', desc: "Build phrases.", questions: [{ s: "Watashi wa Tanaka desu", decoys: ["ringo", "mizu"] }, { s: "Sushi o tabemasu", decoys: ["inu", "neko"] }, { s: "Kore wa hon desu", decoys: ["umi", "yama"] }, { s: "Gakkou e ikimasu", decoys: ["chichi", "haha"] }, { s: "Nihon ga suki desu", decoys: ["pan", "tori"] }] },
        { type: 'detective', title: 'Error Detective', icon: '🔍', desc: "Wrong particles.", questions: [{ s: "Watashi o Tanaka desu.", options: ["Watashi", "o", "Tanaka", "desu"], correct: "o" }, { s: "Sushi wa tabemasu.", options: ["Sushi", "wa", "tabemasu"], correct: "wa" }, { s: "Doko desu wa.", options: ["Doko", "desu", "wa"], correct: "wa" }, { s: "Inu o suki desu.", options: ["Inu", "o", "suki", "desu"], correct: "o" }, { s: "Nihongo ga hanashimasu.", options: ["Nihongo", "ga", "hanashimasu"], correct: "ga" }] }
    ],
    french: [
        { type: 'match', title: 'Word Match', icon: '🗼', desc: "Vocab match.", questions: [{ q: "Hello", options: ["Bonjour", "Merci"], correct: "Bonjour" }, { q: "Red", options: ["Rouge", "Bleu"], correct: "Rouge" }, { q: "House", options: ["Maison", "Livre"], correct: "Maison" }, { q: "Cat", options: ["Chat", "Chien"], correct: "Chat" }, { q: "Friend", options: ["Ami", "Pain"], correct: "Ami" }] },
        { type: 'quiz', title: 'Grammar Quiz', icon: '🥐', desc: "Gender & Verbs.", questions: [{ q: "Je ___ (I am).", options: ["suis", "es"], correct: "suis" }, { q: "___ fille (The girl).", options: ["La", "Le"], correct: "La" }, { q: "___ garçon (The boy).", options: ["Le", "La"], correct: "Le" }, { q: "Tu ___ (You have).", options: ["as", "a"], correct: "as" }, { q: "Nous ___ (We are).", options: ["sommes", "etes"], correct: "sommes" }] },
        { type: 'scramble', title: 'Scramble', icon: '🎨', desc: "Expressions.", questions: [{ s: "Je m'appelle Marie" }, { s: "Comment ça va" }, { s: "Il fait beau" }, { s: "J'aime le chocolat" }, { s: "C'est la vie" }] },
        { type: 'safari', title: 'Word Safari', icon: '🥖', desc: "Find 3 words in the category!", questions: [
            { cat: "Colors", options: ["Rouge", "Bleu", "Vert", "Pain", "Livre", "Chat"], correct: ["Rouge", "Bleu", "Vert"] },
            { cat: "Family", options: ["Mère", "Père", "Frère", "Soleil", "Eau", "Vin"], correct: ["Mère", "Père", "Frère"] },
            { cat: "Drinks", options: ["Eau", "Lait", "Vin", "Chat", "Chien", "Table"], correct: ["Eau", "Lait", "Vin"] },
            { cat: "Animals", options: ["Chat", "Chien", "Lion", "Pomme", "Vert", "Bleu"], correct: ["Chat", "Chien", "Lion"] },
            { cat: "Objects", options: ["Livre", "Stylo", "Table", "Mère", "Père", "Frère"], correct: ["Livre", "Stylo", "Table"] }
        ]},
        { type: 'picture', title: 'Picture This', icon: '🍷', desc: "Match picture to word.", questions: [{ q: "🥖", options: ["Pain", "Pomme", "Eau"], correct: "Pain" }, { q: "🧀", options: ["Fromage", "Lait", "Vin"], correct: "Fromage" }, { q: "🐈", options: ["Chat", "Chien", "Oiseau"], correct: "Chat" }, { q: "☀️", options: ["Soleil", "Lune", "Pluie"], correct: "Soleil" }, { q: "🚗", options: ["Voiture", "Avion", "Vélo"], correct: "Voiture" }] },
        { type: 'translator', title: 'Response Master', icon: '💬', desc: "Natural responses.", questions: [{ q: "A: Comment ça va ?", options: ["Ça va bien !", "Merci", "Rouge"], correct: "Ça va bien !" }, { q: "A: Merci beaucoup !", options: ["De rien", "Bonjour", "Oui"], correct: "De rien" }, { q: "A: Enchanté !", options: ["Enchanté aussi !", "Pain", "Vin"], correct: "Enchanté aussi !" }, { q: "A: Quel âge as-tu ?", options: ["J'ai dix ans", "Je suis grand", "Non"], correct: "J'ai dix ans" }, { q: "A: Au revoir !", options: ["À bientôt !", "Bonjour", "Eau"], correct: "À bientôt !" }] },
        { type: 'speed', title: 'Speed Master', icon: '⚡', desc: "Opposites.", questions: [{ q: "Opposite: Petit", options: ["Grand", "Vite"], correct: "Grand" }, { q: "Opposite: Froid", options: ["Chaud", "Beau"], correct: "Chaud" }, { q: "Opposite: Jour", options: ["Nuit", "Soir"], correct: "Nuit" }, { q: "Opposite: Mauvais", options: ["Bon", "Lent"], correct: "Bon" }, { q: "Opposite: Triste", options: ["Heureux", "Fou"], correct: "Heureux" }] },
        { type: 'architect', title: 'Architect', icon: '🏰', desc: "Build phrases.", questions: [{ s: "J'aime le chocolat", decoys: ["voiture", "bleu"] }, { s: "C'est une pomme", decoys: ["chat", "chien"] }, { s: "Il est très beau", decoys: ["eau", "pain"] }, { s: "Nous allons à Paris", decoys: ["stylo", "livre"] }, { s: "La vie est belle", decoys: ["rouge", "vert"] }] },
        { type: 'detective', title: 'Error Detective', icon: '🔍', desc: "Gender/Plural errors.", questions: [{ s: "Le fille est belle.", options: ["Le", "fille", "est", "belle"], correct: "Le" }, { s: "Un pomme rouge.", options: ["Un", "pomme", "rouge"], correct: "Un" }, { s: "Les enfant jouent.", options: ["Les", "enfant", "jouent"], correct: "enfant" }, { s: "Je suis un petite garçon.", options: ["Je", "suis", "un", "petite"], correct: "petite" }, { s: "Elle est très beau.", options: ["Elle", "est", "très", "beau"], correct: "beau" }] }
    ]
};

function init() { renderGames(); updateProgress(); }

function renderGames() {
    const dashboard = document.getElementById('game-dashboard');
    dashboard.innerHTML = `
        <div class="level-section"><h2 class="level-title">Level 1: Beginner</h2><div class="game-grid" id="grid-beginner"></div></div>
        <div class="level-section"><h2 class="level-title">Level 2: Intermediate</h2><div class="game-grid" id="grid-intermediate"></div></div>
        <div class="level-section"><h2 class="level-title">Level 3: Advanced</h2><div class="game-grid" id="grid-advanced"></div></div>
    `;
    allGameData[currentLanguage].forEach((game, index) => {
        let gridId = index < 3 ? 'grid-beginner' : index < 6 ? 'grid-intermediate' : 'grid-advanced';
        document.getElementById(gridId).innerHTML += `
            <div class="game-card">
                <span class="game-icon">${game.icon}</span>
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
                <button class="btn-play" onclick="playGame(${index})">Play Now</button>
            </div>
        `;
    });
}

let activeGameIndex = 0;
function playGame(index) {
    activeGameIndex = index; currentScore = 0; questionIndex = 0; lives = 3;
    document.getElementById('gameModal').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const game = allGameData[currentLanguage][activeGameIndex];
    const content = document.getElementById('game-content');
    const timerWrapper = document.getElementById('timer-wrapper');
    clearInterval(timer);
    
    timerWrapper.style.display = (game.type === 'speed') ? 'inline' : 'none';
    content.innerHTML = ""; updateLivesUI(); document.getElementById('score').innerText = currentScore;
    document.getElementById('modal-title').innerText = game.title;

    if (lives <= 0) { 
        content.innerHTML = "<h3>Game Over! 💀</h3><button class='btn-play' onclick='closeModal()'>Try Again</button>"; 
        playSfx('sound-fail'); 
        return; 
    }
    
    if (questionIndex >= 5) {
        content.innerHTML = "<h3>Level Complete! 🎉</h3>";
        if (!progressData[currentLanguage].completedGames.includes(activeGameIndex)) {
            progressData[currentLanguage].completedGames.push(activeGameIndex);
            progressData[currentLanguage].won++;
            updateProgress();
        }
        triggerConfetti();
        playSfx('sound-congrats');
        return;
    }

    const qData = game.questions[questionIndex];

    if (['match', 'quiz', 'picture', 'translator', 'speed', 'detective'].includes(game.type)) {
        content.innerHTML = `<div class="display-phrase">${qData.q || qData.s}</div><div id="options-container"></div>`;
        qData.options.forEach(opt => {
            document.getElementById('options-container').innerHTML += `<button class="game-opt" onclick="checkAnswer('${opt}', '${qData.correct}')">${opt}</button>`;
        });
        if(game.type === 'speed') startTimer();
    } 
    else if (game.type === 'safari') {
        safariSelected = [];
        content.innerHTML = `<div class="display-phrase">Category: ${qData.cat} (Pick 3)</div><div id="word-pool"></div>`;
        qData.options.forEach(opt => {
            document.getElementById('word-pool').innerHTML += `<button class="game-opt" onclick="toggleSafari('${opt}', this)">${opt}</button>`;
        });
        content.innerHTML += `<br><button class="btn-submit-game" onclick="checkSafari()">Check Selection</button>`;
    }
    else if (game.type === 'scramble' || game.type === 'architect') {
        let words = qData.s.split(" ");
        if(qData.decoys) words = [...words, ...qData.decoys];
        words.sort(() => Math.random() - 0.5);
        content.innerHTML = `<div id="drop-area" class="display-phrase" style="min-height:50px">...</div><div id="word-pool"></div>`;
        words.forEach(w => { 
            document.getElementById('word-pool').innerHTML += `<button class="game-opt" onclick="addToSentence('${w}', this)">${w}</button>`; 
        });
        currentSentence = [];
        content.innerHTML += `<br><button class="game-opt" style="background:#e74c3c; color:white; border:none" onclick="loadQuestion()">Clear</button>`;
        content.innerHTML += `<button class="btn-submit-game" onclick="validateArchitect('${qData.s}')">Submit</button>`;
    }
}

function checkAnswer(selected, correct) {
    if (selected === correct) { 
        currentScore += 10; questionIndex++; playSfx('sound-correct'); loadQuestion(); 
    } else { 
        lives--; playSfx('sound-wrong'); updateLivesUI(); if (lives <= 0) loadQuestion(); 
    }
}

function toggleSafari(word, btn) {
    if (safariSelected.includes(word)) {
        safariSelected = safariSelected.filter(w => w !== word);
        btn.classList.remove('active-safari');
    } else if (safariSelected.length < 3) {
        safariSelected.push(word);
        btn.classList.add('active-safari');
    }
}

function checkSafari() {
    const correctAnswers = allGameData[currentLanguage][activeGameIndex].questions[questionIndex].correct;
    const isCorrect = safariSelected.length === 3 && safariSelected.every(w => correctAnswers.includes(w));
    if (isCorrect) checkAnswer('ok', 'ok');
    else { lives--; playSfx('sound-wrong'); updateLivesUI(); if (lives > 0) alert("Incorrect! Try again."); loadQuestion(); }
}

function startTimer() {
    timeLeft = 10; document.getElementById('timer-sec').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--; document.getElementById('timer-sec').innerText = timeLeft;
        if (timeLeft <= 0) { lives--; playSfx('sound-wrong'); loadQuestion(); }
    }, 1000);
}

function addToSentence(word, btn) {
    currentSentence.push(word); btn.disabled = true; btn.style.opacity = 0.5;
    document.getElementById('drop-area').innerText = currentSentence.join(" ");
}

function validateArchitect(correctSentence) {
    if (currentSentence.join(" ") === correctSentence) checkAnswer('ok', 'ok');
    else { lives--; playSfx('sound-wrong'); updateLivesUI(); loadQuestion(); }
}

function updateProgress() {
    let totalGames = allGameData[currentLanguage].length;
    let won = progressData[currentLanguage].won;
    let percent = Math.floor((won / totalGames) * 100);
    document.getElementById('progress-bar').style.height = percent + "%";
    document.getElementById('progress-text').innerText = percent + "%";
}

function showLang(lang, btn) {
    currentLanguage = lang;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGames();
    updateProgress();
}

function updateLivesUI() { document.getElementById('lives').innerText = lives > 0 ? "❤️".repeat(lives) : "💀"; }
function toggleMute() { isMuted = !isMuted; document.getElementById('muteToggle').innerText = isMuted ? "🔇" : "🔊"; }
function playSfx(id) { if (!isMuted) { let s = document.getElementById(id); s.currentTime = 0; s.play(); } }
function closeModal() { document.getElementById('gameModal').style.display = 'none'; clearInterval(timer); }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function triggerConfetti() {
    var end = Date.now() + 3 * 1000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 5000 });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 5000 });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

window.onscroll = function() {
    const topBtn = document.getElementById("backToTop");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) topBtn.style.display = "block";
    else topBtn.style.display = "none";
};

init();
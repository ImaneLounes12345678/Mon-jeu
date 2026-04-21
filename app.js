let currentEvent = null;
let timelines = { P1: [], P2: [] };
let scores = { P1: 0, P2: 0 };
let streaks = { P1: 0, P2: 0 };
let globalTime = 120; 
let timerId = null;
let isPaused = false;

// Démarrage du jeu via le bouton
function startGame() {
    document.getElementById('start-screen').style.opacity = "0";
    setTimeout(() => {
        document.getElementById('start-screen').style.display = "none";
        fetchEvent();
        startGlobalTimer();
    }, 500);
}

async function fetchEvent() {
    try {
        const res = await fetch('get_event.php');
        currentEvent = await res.json();
        document.getElementById('current-event').innerText = currentEvent.titre;
    } catch (e) {
        console.error("Erreur de chargement des données.");
    }
}

function startGlobalTimer() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
        if (!isPaused) {
            globalTime -= 0.1;
            const percentage = (globalTime / 120) * 100;
            document.getElementById('timer-bar').style.width = percentage + "%";
            
            if (globalTime <= 0) {
                clearInterval(timerId);
                showEndScreen();
            }
        }
    }, 100);
}

function render(pId) {
    const scale = document.getElementById(`scale-${pId}`);
    scale.innerHTML = '';
    timelines[pId].forEach((ev, i) => {
        scale.innerHTML += `<div class="drop-zone" onclick="jouer('${pId}', ${i})">+</div>`;
        scale.innerHTML += `<div class="bubble"><strong>${ev.titre}</strong><br>${ev.date}</div>`;
    });
    scale.innerHTML += `<div class="drop-zone" onclick="jouer('${pId}', ${timelines[pId].length})">+</div>`;
}

function animateScore(pId) {
    const scoreEl = document.getElementById(`score-${pId}`);
    scoreEl.classList.add('pop');
    setTimeout(() => scoreEl.classList.remove('pop'), 300);
}

function jouer(pId, index) {
    const list = timelines[pId];
    let ok = true;
    if (index > 0 && list[index-1].date > currentEvent.date) ok = false;
    if (index < list.length && list[index].date < currentEvent.date) ok = false;

    if (ok) {
        list.splice(index, 0, currentEvent);
        scores[pId]++;
        streaks[pId]++;
        
        document.getElementById(`score-${pId}`).innerText = scores[pId];
        animateScore(pId);
        
        // Apparition du bouton spécial si 3 bonnes réponses de suite
        if (streaks[pId] >= 3) {
            document.getElementById(`btn-time-${pId}`).style.display = "inline-block";
        }
        
        render(pId);
        fetchEvent();
    } else {
        streaks[pId] = 0;
        document.getElementById(`btn-time-${pId}`).style.display = "none";
        alert("Faux ! La série est brisée.");
    }
}

function pouvoir(type, lanceur) {
    const cible = lanceur === 'P1' ? 'P2' : 'P1';
    if (type === 'gel') {
        document.getElementById(cible).classList.add('frozen');
        setTimeout(() => document.getElementById(cible).classList.remove('frozen'), 5000);
    } else if (type === 'temps') {
        isPaused = true;
        document.getElementById(`btn-time-${lanceur}`).style.display = "none";
        streaks[lanceur] = 0;
        setTimeout(() => isPaused = false, 8000); // Chrono stoppé 8 secondes
    }
}

function showEndScreen() {
    const winner = scores.P1 > scores.P2 ? "MAGE VERT TRIOMPHE" : "MAGE BLEU TRIOMPHE";
    document.getElementById('winner-text').innerText = winner;
    document.getElementById('final-scores').innerHTML = `<h2>SCORE: ${scores.P1} - ${scores.P2}</h2>`;
    document.getElementById('end-screen').style.display = "flex";
}

window.onload = () => { render('P1'); render('P2'); };

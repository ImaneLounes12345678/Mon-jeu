let currentEvent = null;
let timelines = { P1: [], P2: [] };
let scores = { P1: 0, P2: 0 };
let timeLeft = 20;
let timerId = null;

async function fetchEvent() {
    const res = await fetch('get_event.php');
    currentEvent = await res.json();
    document.getElementById('current-event').innerText = currentEvent.titre;
    startChrono();
}

function startChrono() {
    clearInterval(timerId);
    timeLeft = 20;
    timerId = setInterval(() => {
        timeLeft -= 0.1;
        document.getElementById('timer-bar').style.width = (timeLeft / 20) * 100 + "%";
        if (timeLeft <= 0) fetchEvent();
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

function jouer(pId, index) {
    const list = timelines[pId];
    let ok = true;
    if (index > 0 && list[index-1].date > currentEvent.date) ok = false;
    if (index < list.length && list[index].date < currentEvent.date) ok = false;

    if (ok) {
        list.splice(index, 0, currentEvent);
        scores[pId]++;
        document.getElementById(`score-${pId}`).innerText = scores[pId];
        render(pId);
        fetchEvent(); // Élimine l'événement actuel pour l'autre joueur !
    } else {
        const card = document.getElementById('current-event');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 400);
        alert("Faux ! L'événement retourne à l'Oracle.");
    }
}

function pouvoir(type, lanceur) {
    const cible = lanceur === 'P1' ? 'P2' : 'P1';
    if (type === 'gel') {
        document.getElementById(cible).classList.add('frozen');
        setTimeout(() => document.getElementById(cible).classList.remove('frozen'), 5000);
    } else {
        if (scores[cible] > 0) {
            scores[cible]--; scores[lanceur]++;
            document.getElementById(`score-P1`).innerText = scores.P1;
            document.getElementById(`score-P2`).innerText = scores.P2;
        }
    }
}

window.onload = () => { fetchEvent(); render('P1'); render('P2'); };
let currentEvent = null;
let timelines = { P1: [], P2: [] };
let scores = { P1: 0, P2: 0 };
let currentPlayer = 'P1';
let turnTime = 15;
let turnTimer = null;
let gameActive = false;
let evenementsPoses = [];

function introAnimation() {
    document.getElementById('start-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        const vs = document.getElementById('vs-screen');
        vs.style.display = 'flex';
        setTimeout(() => vs.style.opacity = '1', 50);
        setTimeout(() => {
            vs.style.opacity = '0';
            setTimeout(() => {
                vs.style.display = 'none';
                gameActive = true;
                fetchEvent();
                startTurnTimer();
            }, 800);
        }, 2500);
    }, 800);
}

async function fetchEvent() {
    const card = document.getElementById('oracle-card');
    const res = await fetch('get_event.php');
    const nouvelEvenement = await res.json();
    if (evenementsPoses.includes(nouvelEvenement.titre)) {
        return fetchEvent();
    }
    currentEvent = nouvelEvenement;
    card.classList.remove('reveal', 'fixed-top');
    card.style.opacity = "0";
    card.style.transform = "scale(0)";
    setTimeout(() => {
        document.getElementById('current-event').innerText = currentEvent.titre;
        card.classList.add('reveal');
        setTimeout(() => {
            card.classList.remove('reveal');
            card.classList.add('fixed-top');
        }, 1200);
    }, 200);
}

function startTurnTimer() {
    if (turnTimer) clearInterval(turnTimer);
    turnTime = 15;
    updateVisualTurns();
    turnTimer = setInterval(() => {
        if (!gameActive) return;
        turnTime -= 0.1;
        document.getElementById(`timer-bar-${currentPlayer}`).style.width = (turnTime / 15) * 100 + "%";
        if (turnTime <= 0) nextTurn();
    }, 100);
}

function updateVisualTurns() {
    document.getElementById('P1').className = (currentPlayer === 'P1') ? 'player-side active-turn' : 'player-side disabled-turn';
    document.getElementById('P2').className = (currentPlayer === 'P2') ? 'player-side active-turn' : 'player-side disabled-turn';
}

function nextTurn() {
    currentPlayer = (currentPlayer === 'P1') ? 'P2' : 'P1';
    fetchEvent();
    startTurnTimer();
}

function jouer(pId, index) {
    if (!gameActive || pId !== currentPlayer) return;
    const list = timelines[pId];
    let ok = true;
    if (index > 0 && list[index-1].date > currentEvent.date) ok = false;
    if (index < list.length && list[index].date < currentEvent.date) ok = false;
    if (ok) {
        evenementsPoses.push(currentEvent.titre);
        list.splice(index, 0, currentEvent);
        scores[pId]++;
        document.getElementById(`score-${pId}`).innerText = scores[pId];
        render(pId);
        if (scores[pId] >= 5) showWinner(pId);
        else nextTurn();
    } else {
        alert("Mauvaise époque !");
        nextTurn();
    }
}

function gelerTemps(pId) {
    if (pId !== currentPlayer) return;
    turnTime = Math.min(turnTime + 7, 15);
    document.getElementById(`btn-time-${pId}`).style.display = 'none';
}

function render(pId) {
    const scale = document.getElementById(`scale-${pId}`);
    scale.innerHTML = '';
    timelines[pId].forEach((ev, i) => {
        scale.innerHTML += `<div class="drop-zone" onclick="jouer('${pId}', ${i})">+</div>`;
        scale.innerHTML += `<div class="bubble">${ev.titre}<br><small>${ev.date}</small></div>`;
    });
    scale.innerHTML += `<div class="drop-zone" onclick="jouer('${pId}', ${timelines[pId].length})">+</div>`;
}

function showWinner(pId) {
    gameActive = false;
    clearInterval(turnTimer);
    document.getElementById('winner-text').innerText = `Le Joueur ${(pId==='P1'?1:2)} a maîtrisé le temps !`;
    document.getElementById('end-screen').style.display = 'flex';
}

window.onload = () => {
    render('P1');
    render('P2');
};

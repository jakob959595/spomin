let selIgrnoPolje;
let kartice = [];
let steviloParov = 0;
let odporljeKartice = [];
let najdeniPari = 0;
let kliki = 0;
let cas = 0;
let casMerjenja = null;
let igraSeVrti = false;

const slike = ['🍎', '🍌', '🍒', '🍊', '🍉', '🍓', '🍍', '🥑'];

document.addEventListener('DOMContentLoaded', function () {
    selIgrnoPolje = document.getElementById('igralno-polje');
    
    document.querySelectorAll('.btn-tezavnost').forEach(btn => {
        btn.addEventListener('click', izbreriTezavnost);
    });

    document.getElementById('btn-zacni').addEventListener('click', zacniIgro);
    document.getElementById('btn-reset').addEventListener('click', resetIgro);
});

function izbreriTezavnost(event) {
    document.querySelectorAll('.btn-tezavnost').forEach(btn => {
        btn.classList.remove('aktivna');
    });

    event.target.classList.add('aktivna');
    steviloParov = parseInt(event.target.dataset.pari);
    document.getElementById('obvestilo').textContent = `Izbral si ${steviloParov} parov`;
}

function zacniIgro() {
    if (steviloParov === 0) {
        document.getElementById('obvestilo').textContent = '⚠️ Izberi težavnost!';
        return;
    }

    resetIgro();
    igraSeVrti = true;
    document.getElementById('btn-zacni').disabled = true;

    pripraviKartice();
    premesiKartice();
    narediKarticeHTML();

    casMerjenja = new Date();
    meriCas();
    predvajajGlas();
}

function pripraviKartice() {
    kartice = [];
    
    const potrebneSlike = slike.slice(0, steviloParov);
    
    potrebneSlike.forEach(slika => {
        kartice.push({ slika: slika, id: Math.random(), odkrita: false, izginula: false });
        kartice.push({ slika: slika, id: Math.random(), odkrita: false, izginula: false });
    });
}

function premesiKartice() {
    for (let i = kartice.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kartice[i], kartice[j]] = [kartice[j], kartice[i]];
    }
}

function narediKarticeHTML() {
    selIgrnoPolje.innerHTML = '';
    
    selIgrnoPolje.className = `igralno-polje pari-${steviloParov}`;

    kartice.forEach((kartica, indeks) => {
        const gumb = document.createElement('button');
        gumb.className = 'kartica';
        gumb.dataset.indeks = indeks;
        gumb.textContent = '?';
        
        gumb.addEventListener('click', () => odpriKartico(indeks));
        
        selIgrnoPolje.appendChild(gumb);
    });
}

function odpriKartico(indeks) {
    if (!igraSeVrti) return;
    if (kartice[indeks].odkrita) return;
    if (kartice[indeks].izginula) return;
    if (odporljeKartice.length >= 2) return;

    kartice[indeks].odkrita = true;
    odporljeKartice.push(indeks);

    const gumb = document.querySelector(`[data-indeks="${indeks}"]`);
    gumb.textContent = kartice[indeks].slika;
    gumb.classList.add('odkrita');

    kliki++;
    document.getElementById('kliki').textContent = kliki;

    if (odporljeKartice.length === 2) {
        setTimeout(preverijParico, 1000);
    }
}

function preverijParico() {
    const [indeks1, indeks2] = odporljeKartice;
    const kartica1 = kartice[indeks1];
    const kartica2 = kartice[indeks2];

    if (kartica1.slika === kartica2.slika) {
        kartica1.izginula = true;
        kartica2.izginula = true;

        const gumb1 = document.querySelector(`[data-indeks="${indeks1}"]`);
        const gumb2 = document.querySelector(`[data-indeks="${indeks2}"]`);
        gumb1.classList.add('izginula');
        gumb2.classList.add('izginula');

        najdeniPari++;
        document.getElementById('pari').textContent = najdeniPari;

        if (najdeniPari === steviloParov) {
            koncajIgro();
        }
    } else {
        const gumb1 = document.querySelector(`[data-indeks="${indeks1}"]`);
        const gumb2 = document.querySelector(`[data-indeks="${indeks2}"]`);

        gumb1.classList.remove('odkrita');
        gumb2.classList.remove('odkrita');
        gumb1.textContent = '?';
        gumb2.textContent = '?';

        kartica1.odkrita = false;
        kartica2.odkrita = false;
    }

    odporljeKartice = [];
}

function meriCas() {
    if (!casMerjenja) return;

    const casIntervala = setInterval(() => {
        if (!igraSeVrti) {
            clearInterval(casIntervala);
            return;
        }

        const trenutniCas = new Date();
        const razlika = Math.floor((trenutniCas - casMerjenja) / 1000);
        const minute = Math.floor(razlika / 60);
        const sekunde = razlika % 60;

        document.getElementById('cas').textContent = 
            `${minute}:${sekunde < 10 ? '0' : ''}${sekunde}`;
    }, 1000);
}

function koncajIgro() {
    igraSeVrti = false;
    const obvestilo = document.getElementById('obvestilo');
    
    obvestilo.classList.add('zmaga');
    obvestilo.innerHTML = `
        🎉 <strong>ČESTITKE!</strong> 🎉<br>
        Našel si vse pare!<br>
        <small>Čas: ${document.getElementById('cas').textContent} | Kliki: ${kliki}</small>
    `;

    document.getElementById('btn-zacni').disabled = false;
}

function resetIgro() {
    igraSeVrti = false;
    kartice = [];
    odporljeKartice = [];
    najdeniPari = 0;
    kliki = 0;
    cas = 0;
    casMerjenja = null;

    document.getElementById('kliki').textContent = '0';
    document.getElementById('pari').textContent = '0';
    document.getElementById('cas').textContent = '0:00';
    document.getElementById('obvestilo').textContent = '';
    document.getElementById('obvestilo').className = 'obvestilo';
    
    selIgrnoPolje.innerHTML = '';
    document.getElementById('btn-zacni').disabled = false;
}

function predvajajGlas() {
    const audioKontekst = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscilator = audioKontekst.createOscillator();
    const ojacevec = audioKontekst.createGain();
    
    oscilator.connect(ojacevec);
    ojacevec.connect(audioKontekst.destination);
    
    oscilator.frequency.value = 800;
    ojacevec.gain.setValueAtTime(0.3, audioKontekst.currentTime);
    ojacevec.gain.exponentialRampToValueAtTime(0.01, audioKontekst.currentTime + 0.1);
    
    oscilator.start(audioKontekst.currentTime);
    oscilator.stop(audioKontekst.currentTime + 0.1);
}

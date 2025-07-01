let currentLang = 'en';
let langSettings = {};
let numberOfStories = 2;

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.getAttribute('data-lang');
    applyLang(currentLang);
  });
});

document.getElementById('darkBtn').addEventListener('click', () => {
  document.body.classList.remove('light-mode');
  document.body.classList.add('dark-mode');
});

document.getElementById('lightBtn').addEventListener('click', () => {
  document.body.classList.remove('dark-mode');
  document.body.classList.add('light-mode');
});

function applyLang(lang) {
  fetch('data/langs.json')
    .then(res => res.json())
    .then(data => {
      langSettings = data[lang];
      document.body.setAttribute('dir', langSettings.dir || 'ltr');

      // Update titles and button text
      document.getElementById('pageTitle').innerText = langSettings.title;
      document.getElementById('mainHeading').innerText = langSettings.title;
      document.getElementById('darkBtn').innerText = `🌙 ${langSettings.dark}`;
      document.getElementById('lightBtn').innerText = `☀️ ${langSettings.light}`;
    });

  loadIntro();
  loadStories();
}

function loadIntro() {
  fetch('data/intro.json')
    .then(res => res.json())
    .then(data => {
      document.getElementById('introText').innerText = data[currentLang] || data['en'];
    });
}

function loadStories() {
  const maskContainer = document.getElementById('maskContainer');
  maskContainer.innerHTML = '';

  let count = 0;

  for (let i = 1; i <= numberOfStories; i++) {
    fetch(`data/story${i}.json`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;

        count++;
        const col = document.createElement('div');
        col.className = 'col-auto text-center';

        const img = document.createElement('img');
        img.src = 'mask.jpg';
        img.alt = `Story #${count}`;
        img.setAttribute('data-bs-toggle', 'modal');
        img.setAttribute('data-bs-target', '#storyModal');
        img.classList.add('img-thumbnail');
        img.addEventListener('click', () => showStory(data, count));

        const label = document.createElement('div');
        label.textContent = `#${count}`;

        col.appendChild(img);
        col.appendChild(label);
        maskContainer.appendChild(col);
      });
  }
}

function showStory(data, index) {
  const storyText = data[currentLang]?.text || data['en']?.text || 'No content';
  const storySource = data[currentLang]?.source || data['en']?.source || '';

  document.querySelector('#storyModal .modal-title').innerText = `Story #${index}`;
  document.getElementById('storyText').innerText = storyText;
  document.getElementById('storySource').innerText = storySource ? `Source: ${storySource}` : '';
}

applyLang(currentLang);

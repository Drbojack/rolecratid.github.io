const card = document.getElementById('card');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let idx = 0;
const questions = [
  "I enjoy creating new ideas.",
  "I value consistency.",
  "I am energized by people."
];

function render(){
  progressBar.style.width = ((idx+1)/questions.length*100) + "%";
  progressText.textContent = `Q ${idx+1} / ${questions.length}`;

  card.classList.add('is-fading');
  setTimeout(() => {
    card.innerHTML = `<h3>${questions[idx]}</h3>`;
    card.classList.remove('is-fading');
  }, 120);
}

nextBtn.onclick = () => {
  if (idx < questions.length-1){
    idx++;
    render();
  } else {
    showResults();
  }
};

prevBtn.onclick = () => {
  if (idx > 0){
    idx--;
    render();
  }
};

function showResults(){
  document.body.classList.add('show-results');
  document.getElementById('resultsHeadline').textContent = "Prophet / Teacher";
  document.getElementById('resultsBox').innerHTML = "<p>Your combined results go here.</p>";
}

document.getElementById('restartResults').onclick = () => {
  document.body.classList.remove('show-results');
  idx = 0;
  render();
};

render();

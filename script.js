document.addEventListener('DOMContentLoaded', function () {
  const randomSentenceBtn = document.getElementById('randomSentence');
  const selectAmount = document.getElementById('selectAmount');
  const startBtn = document.getElementById('start');
  const resultContainer = document.getElementById('resultContainer');
  const showPronunciation = document.getElementById('showPronunciation');
  const showMeaning = document.getElementById('showMeaning');
  const sentencesDiv = document.getElementById('sentences');
  const refreshBtn = document.getElementById('refresh');
  const backToMainBtn = document.getElementById('backToMain');

  let isRandom = false;
  let numOfSentences = 5;

  randomSentenceBtn.addEventListener('click', function () {
    isRandom = true;
    randomSentenceBtn.style.backgroundColor = 'green';
  });

  selectAmount.addEventListener('change', function () {
    numOfSentences = parseInt(this.value, 10);
  });

  startBtn.addEventListener('click', function () {
    fetch('data.csv')
      .then(response => response.text())
      .then(data => {
        const sentences = data.split('\n').slice(1);
        let selectedSentences = [];

        if (isRandom) {
          for (let i = 0; i < numOfSentences; i++) {
            const randomIndex = Math.floor(Math.random() * sentences.length);
            selectedSentences.push(sentences[randomIndex]);
          }
        } else {
          selectedSentences = sentences.slice(0, numOfSentences);
        }

        displaySentences(selectedSentences);
      });
  });

  refreshBtn.addEventListener('click', function () {
    startBtn.click();
  });

  backToMainBtn.addEventListener('click', function () {
    resultContainer.style.display = 'none';
  });

  function displaySentences(sentences) {
    sentencesDiv.innerHTML = '';
    sentences.forEach(sentence => {
      const parts = sentence.split(',');

      const sentenceDiv = document.createElement('div');
      sentenceDiv.textContent = parts[0];

      if (showPronunciation.checked) {
        const pronunciationDiv = document.createElement('div');
        pronunciationDiv.textContent = `คำอ่าน: ${parts[1]}`;
        sentenceDiv.appendChild(pronunciationDiv);
      }

      if (showMeaning.checked) {
        const meaningDiv = document.createElement('div');
        meaningDiv.textContent = `ความหมาย: ${parts[2]}`;
        sentenceDiv.appendChild(meaningDiv);
      }

      sentencesDiv.appendChild(sentenceDiv);
    });

    resultContainer.style.display = 'block';
  }
});
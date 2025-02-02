document.addEventListener("DOMContentLoaded", () => {
    const randomizeBtn = document.getElementById("randomizeBtn");
    const startBtn = document.getElementById("startBtn");
    const quantitySelect = document.getElementById("quantity");

    let isRandom = false;

    if (randomizeBtn) {
        randomizeBtn.addEventListener("click", () => {
            isRandom = !isRandom;
            randomizeBtn.style.backgroundColor = isRandom ? "green" : "";
        });
    }

    if (startBtn) {
        startBtn.addEventListener("click", () => {
            const quantity = quantitySelect.value;
            window.location.href = `display.html?random=${isRandom}&quantity=${quantity}`;
        });
    }

    if (window.location.pathname.includes("display.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const isRandom = urlParams.get("random") === "true";
        const quantity = parseInt(urlParams.get("quantity"));

        fetch("words.csv")
            .then(response => response.text())
            .then(data => {
                let rows = data.split("\n").map(row => row.split(","));
                if (isRandom) {
                    rows = rows.sort(() => Math.random() - 0.5);
                }
                rows = rows.slice(0, quantity);

                const wordList = document.getElementById("wordList");
                wordList.innerHTML = "";

                rows.forEach(([word, pronunciation, meaning]) => {
                    const li = document.createElement("li");
                    li.textContent = word;
                    li.dataset.pronunciation = pronunciation;
                    li.dataset.meaning = meaning;

                    li.addEventListener("click", () => speakWord(word));
                    wordList.appendChild(li);
                });

                updateWordList();
            });

        function speakWord(word) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = "en-US";
            synth.speak(utterance);
        }

        function updateWordList() {
            const showPronunciation = document.getElementById("showPronunciation").checked;
            const showMeaning = document.getElementById("showMeaning").checked;

            document.querySelectorAll("#wordList li").forEach(li => {
                li.innerHTML = li.dataset.word;

                if (showPronunciation) {
                    li.innerHTML += ` <br><small style="color: gray;">(${li.dataset.pronunciation})</small>`;
                }
                if (showMeaning) {
                    li.innerHTML += ` <br><small style="color: green;">${li.dataset.meaning}</small>`;
                }
            });
        }

        document.getElementById("showPronunciation").addEventListener("change", updateWordList);
        document.getElementById("showMeaning").addEventListener("change", updateWordList);

        document.getElementById("refreshBtn").addEventListener("click", () => {
            location.reload();
        });

        document.getElementById("backBtn").addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});

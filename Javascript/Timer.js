let timeLeft = 15; // 15 seconden per vraag
let timerInterval;

function startTimer() {
    timeLeft = 15;
    document.getElementById("timer").textContent = `Tijd over: ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Tijd over: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
}

function handleTimeUp() {
    alert("Uh oh! De tijd is op. Je bent gediddy'd.");
    goToPreviousQuestion();
}

function goToPreviousQuestion() {
    // Logica om terug te gaan naar de vorige vraag
    console.log("Terug naar de vorige groomer!");
}

// Roep startTimer() aan wanneer een nieuwe vraag begint

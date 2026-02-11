const questions = [
    {
        text: "Little interest or pleasure in doing things",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Feeling down, depressed, or hopeless",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Trouble falling or staying asleep, or sleeping too much",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Feeling tired or having little energy",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Poor appetite or overeating",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Trouble concentrating on things, such as reading the newspaper or watching television",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "Thoughts that you would be better off dead or of hurting yourself in some way",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
        ],
    },
    {
        text: "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
        options: [
            { text: "Not difficult at all", score: 0 },
            { text: "Somewhat difficult", score: 1 },
            { text: "Very difficult", score: 2 },
            { text: "Extremely difficult", score: 3 },
        ],
        is_functional_impact: true, // Marker for this question type
    },
];

let currentQuestionIndex = 0;
let userScores = Array(questions.length).fill(null); // Use null to indicate unanswered

// Get elements
const instructionsContainer = document.getElementById("instructions-container");
const startTestButton = document.getElementById("start-test-button");
const questionTextElement = document.getElementById("question-text");
const optionsContainerElement = document.getElementById("options-container");
const prevButton = document.getElementById("prev-button");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("results-container");
const totalScoreElement = document.getElementById("total-score");
const interpretationElement = document.getElementById("interpretation");
const retakeButton = document.getElementById("retake-button");

// Initial setup
instructionsContainer.style.display = "block";
quizContainer.style.display = "none";
resultsContainer.style.display = "none";

startTestButton.addEventListener("click", () => {
    instructionsContainer.style.display = "none";
    quizContainer.style.display = "block";
    loadQuestion();
});

function loadQuestion() {
    // Reset animations
    questionTextElement.classList.remove('fade-in');
    optionsContainerElement.classList.remove('fade-in');
    questionTextElement.style.transform = 'translateY(20px)'; // Reset transform for re-animation
    optionsContainerElement.style.transform = 'translateY(20px)'; // Reset transform for re-animation


    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        
        questionTextElement.textContent = question.text;

        if (question.is_functional_impact) {
            questionTextElement.classList.add('additional-question');
        } else {
            questionTextElement.classList.remove('additional-question');
        }

        optionsContainerElement.innerHTML = "";

        question.options.forEach((option, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "option";
            input.value = option.score;
            input.dataset.score = option.score;

            const handleSelectionAndAdvance = () => {
                userScores[currentQuestionIndex] = option.score; // Always set the score
                updateNavigationButtons();

                // Advance logic
                if (currentQuestionIndex < questions.length - 1) {
                    setTimeout(() => {
                        currentQuestionIndex++;
                        loadQuestion();
                    }, 300);
                } else {
                    // All questions answered, display results
                    setTimeout(() => {
                        displayResults();
                    }, 300);
                }
            };

            // This handles the primary selection/change event
            input.addEventListener("change", handleSelectionAndAdvance);

            // This handles re-clicking an already selected option to trigger advance
            label.addEventListener("click", () => {
                if (input.checked && userScores[currentQuestionIndex] !== null && userScores[currentQuestionIndex] === option.score) {
                    // If the radio is already checked and matches the stored score, trigger advance
                    handleSelectionAndAdvance();
                }
            });


            label.appendChild(input);
            label.appendChild(document.createTextNode(option.text));
            optionsContainerElement.appendChild(label);

            if (userScores[currentQuestionIndex] !== null && userScores[currentQuestionIndex] === option.score) {
                input.checked = true;
            }
        });
        updateNavigationButtons();

        // Staggered animation for question text and options
        setTimeout(() => {
            questionTextElement.classList.add('fade-in');
        }, 50); // Small delay for question text

        setTimeout(() => {
            optionsContainerElement.classList.add('fade-in');
        }, 150); // Longer delay for options
    } else {
        displayResults();
    }
}

function displayResults() {
    quizContainer.style.display = "none";
    resultsContainer.style.display = "block";

    const phq9Scores = userScores.slice(0, 9);
    const totalPHQ9Score = phq9Scores.reduce((acc, score) => acc + (score || 0), 0);
    totalScoreElement.textContent = `Your total PHQ-9 score is: ${totalPHQ9Score}`;

    let interpretationText = "";
    let severity = "";

    if (totalPHQ9Score >= 0 && totalPHQ9Score <= 4) {
        severity = "Minimal or no depression";
    } else if (totalPHQ9Score >= 5 && totalPHQ9Score <= 9) {
        severity = "Mild depression";
    } else if (totalPHQ9Score >= 10 && totalPHQ9Score <= 14) {
        severity = "Moderate depression";
    } else if (totalPHQ9Score >= 15 && totalPHQ9Score <= 19) {
        severity = "Moderately severe depression";
    } else if (totalPHQ9Score >= 20 && totalPHQ9Score <= 27) {
        severity = "Severe depression";
    }
    interpretationText += `Your Depression Severity: <strong>${severity}</strong>.`;

    interpretationText += "\n\nImportant Note: This PHQ-9 is a screening tool, not a definitive diagnosis. It is crucial to consult with a qualified healthcare professional or mental health expert for an accurate diagnosis and personalized guidance if you have concerns about your well-being or symptoms of depression.";

    interpretationElement.innerHTML = interpretationText;
}

prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

retakeButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    userScores = Array(questions.length).fill(null);
    instructionsContainer.style.display = "block"; // Go back to instructions page
    quizContainer.style.display = "none";
    resultsContainer.style.display = "none";
});
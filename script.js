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

const questionTextElement = document.getElementById("question-text");
const optionsContainerElement = document.getElementById("options-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("results-container");
const totalScoreElement = document.getElementById("total-score");
const interpretationElement = document.getElementById("interpretation");
const retakeButton = document.getElementById("retake-button");

function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionTextElement.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}: ${question.text}`;
        optionsContainerElement.innerHTML = "";

        question.options.forEach((option, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "option";
            input.value = option.score;
            input.dataset.score = option.score; // Store score in dataset
            input.addEventListener("change", () => {
                userScores[currentQuestionIndex] = option.score;
                updateNavigationButtons();
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(option.text));
            optionsContainerElement.appendChild(label);

            // Pre-select if already answered
            if (userScores[currentQuestionIndex] !== null && userScores[currentQuestionIndex] === option.score) {
                input.checked = true;
            }
        });
        updateNavigationButtons();
    } else {
        displayResults();
    }
}

function updateNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = userScores[currentQuestionIndex] === null && currentQuestionIndex < questions.length - 1;
    // The "Next" button should not be disabled for the last question if it's not answered yet, as it will trigger results
}

function displayResults() {
    quizContainer.style.display = "none";
    resultsContainer.style.display = "block";

    const phq9Scores = userScores.slice(0, 9);
    const totalPHQ9Score = phq9Scores.reduce((acc, score) => acc + (score || 0), 0); // Handle null for unanswered
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
    interpretationText += `Severity: ${severity}.`;

    interpretationText += "\n\nClinical Benchmarks:";

    if (totalPHQ9Score >= 10) {
        interpretationText += "\n- Cut-off for Major Depression: A score of 10 or higher is the standard threshold for identifying probable Major Depressive Disorder (MDD), with roughly 88% sensitivity and specificity.";
    }

    const suicideRiskScore = userScores[8]; // Score for the 9th question (index 8)
    if (suicideRiskScore > 0) {
        interpretationText += "\n- Suicide Risk (Item 9): Any score above 0 on the final question (\"Thoughts that you would be better off dead...\") requires immediate clinical assessment for suicide risk.";
    }

    const functionalImpactQuestion = questions[9];
    const functionalImpactScore = userScores[9];
    if (functionalImpactQuestion && functionalImpactQuestion.is_functional_impact && (functionalImpactScore === 2 || functionalImpactScore === 3)) {
        interpretationText += "\n- Functional Impact: Responses of \"very difficult\" or \"extremely difficult\" suggest significant functional impairment.";
    }

    interpretationText += "\n- Monitoring Progress: A change of 5 or more points is considered a clinically significant improvement or worsening of symptoms (for serial assessments).";
    interpretationText += "\n\nNote: The PHQ-9 is a screening tool, not a definitive diagnosis. A clinical interview by a healthcare professional is necessary to confirm a diagnosis.";

    interpretationElement.textContent = interpretationText;
}

prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

nextButton.addEventListener("click", () => {
    // Only proceed if an option is selected or if it's the last question
    if (userScores[currentQuestionIndex] !== null || currentQuestionIndex === questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

retakeButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    userScores = Array(questions.length).fill(null);
    quizContainer.style.display = "block";
    resultsContainer.style.display = "none";
    loadQuestion();
});

// Initial load
loadQuestion();

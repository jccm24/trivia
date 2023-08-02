const apiUrl = 'https://opentdb.com/api.php?amount=10';

// Función para obtener las categorías desde la API
async function getCategories() {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    return data.trivia_categories;
}

// Función para generar la trivia
async function generateTrivia() {
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;

    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}&encode=url3986&lang=es`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const questions = data.results;

        // Limpiar trivia anterior
        document.getElementById('trivia-container').innerHTML = '';

        // Generar preguntas y respuestas
        questions.forEach((question, index) => {
            const questionHTML = createQuestionHTML(question, index + 1);
            document.getElementById('trivia-container').innerHTML += questionHTML;
        });
    } catch (error) {
        console.log('Error al obtener las preguntas:', error);
    }
}

// Función para crear el HTML de una pregunta
function createQuestionHTML(question, index) {
    const decodedQuestion = decodeURIComponent(question.question);
    const decodedCorrectAnswer = decodeURIComponent(question.correct_answer);
    const decodedIncorrectAnswers = question.incorrect_answers.map((answer) => decodeURIComponent(answer));

    let optionsHTML = `
        <div class="question">
            <h3>Pregunta ${index}:</h3>
            <p>${decodedQuestion}</p>
            <div class="options">`;

    const allAnswers = [...decodedIncorrectAnswers, decodedCorrectAnswer];
    const shuffledAnswers = shuffleArray(allAnswers);

    shuffledAnswers.forEach((option) => {
        optionsHTML += `<button class="option">${option}</button>`;
    });

    optionsHTML += `
            </div>
        </div>`;

    return optionsHTML;
}

// Función de utilidad para mezclar aleatoriamente un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para calcular el puntaje final
function calculateScore() {
    const correctAnswers = document.querySelectorAll('.question .option.correct');
    const score = correctAnswers.length * 100;
    alert(`Tu puntaje: ${score}`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener y llenar las categorías desde la API
    const categories = await getCategories();
    const categorySelect = document.getElementById('category');
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
});

document.getElementById('generate').addEventListener('click', generateTrivia);

document.getElementById('trivia-container').addEventListener('click', (event) => {
    const option = event.target.closest('.option');
    if (option) {
        option.classList.toggle('correct');
    }
});


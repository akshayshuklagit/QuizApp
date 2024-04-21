const categoryNumber = JSON.parse(localStorage.getItem("categoryNumber"))
const API_URI =
  `https://opentdb.com/api.php?amount=25&categorsy=${categoryNumber["categoryNumber"]}&type=multiple`;

const optionsPanel = document.querySelector("#options-panel");
const nextBtn = document.querySelector("#nextBtn");
const submitBtn = document.querySelector("#submitBtn");
const questionHead = document.querySelector("#question-head");
const questionPanel = document.querySelector("#question-panel");
const questionSideHead = document.querySelector("#question-side-head");
const startLoader = document.querySelector("#loader");
const quizCard = document.querySelector("#quiz-card");
const questionNoTracker = document.querySelector("#question-no-tracker");
const scoreCardContianer = document.querySelector("#score-card-contianer");
const scoreOutOf = document.querySelector("#score-out-of");
const progressBar = document.querySelector("#progress-loader");
const span = progressBar.firstElementChild;
const timeRemainingPanel = document.querySelector("#time-remaining-panel");



let questions = null;
let counter = 0;
let isSkipped = true;
let score = 0;
let spansArr = [];
let timeFormat = 0;
const setTimeFormat = (data) => {
  let min = data.split(":")
  timeFormat = (12 - parseInt(min[0])) + ":"+ 49
};

const setQuestions = (data) => {
  questions = data;
  console.log(questions);
};
const setCounter = (count) => {
  if (count >= questions.length - 1) nextBtn.disabled = true;
  counter = count;
};
const setIsSkipped = (val) => {
  isSkipped = val;
};
const setScore = (val) => {
  score = val;
};


const fetchData = async () => {
  try {
    Loader(true);
    const res = await fetch(API_URI);
    const data = await res.json();
    setQuestions(data.results);
  } catch (err) {
    console.log(err.message);
  } finally {
    Loader(false);
  }

  renderQuestion(questions, counter);
  addClickEvents();
  QuestionsTracker(questions);
  RenderTimeRemaining(questions.length, 30);
};

window.addEventListener("load", fetchData());

nextBtn.addEventListener("click", () => {
  isSkippedQuestion(isSkipped, setIsSkipped, counter);
  setCounter(counter + 1);
  renderQuestion(questions, counter);
  addClickEvents();
});

submitBtn.addEventListener("click", () => {
  scoreCalculator(score, questions.length);
  let wrong = 30 - score;
  const user = JSON.parse(localStorage.getItem("user"))
  user.score = score
  user.correctQuestions = score
  user.wrongQuestions = wrong
  user.time = timeFormat 
  localStorage.setItem("user", JSON.stringify(user))

  testDataDB().then(data=>console.log(data))

});

function addClickEvents() {
  let answerOption = null;
  let buttonOptions = Array.from(optionsPanel.getElementsByTagName("button"));

  buttonOptions.forEach((item) => {
    if (item.innerHTML === questions[counter].correct_answer)
      answerOption = item;

    item.addEventListener("click", () => {
      if (item.innerHTML === answerOption.innerHTML) {
        item.classList.add("bg-green-400");
        setScore(score + 1);
      } else {
        item.classList.add("bg-red-400");
        answerOption.classList.add("bg-green-400");
      }

      setIsSkipped(false);
      isSkippedQuestion(isSkipped, setIsSkipped, counter);

      buttonOptions.forEach((btn) => (btn.disabled = "true"));
    });
  });
}


function renderQuestion (questions, counter) {
  let { incorrect_answers, correct_answer } = questions[counter];
  let randomIndex = Math.floor(Math.random() * (incorrect_answers.length + 1));
  incorrect_answers.splice(randomIndex, 0, correct_answer);

  questionSideHead.innerHTML = `Question ${counter+1}/${questions.length}`
  questionHead.innerHTML = `Question ${counter + 1}`;
  questionPanel.innerHTML = `${questions[counter].question}`;
  optionsPanel.innerHTML = `
          ${incorrect_answers.map((opt) => `<button>${opt}</button>`).join("")}
          `;
};

function Loader (status) {
  if (status) {
    startLoader.classList.remove("invisible");
    quizCard.classList.add("invisible");
  } else {
    startLoader.classList.add("invisible");
    quizCard.classList.remove("invisible");
  }
};

function QuestionsTracker (questions) {
  questionNoTracker.innerHTML = `
    ${questions.map((_, idx) => `<span>${idx + 1}</span>`).join("")}`;

  spansArr = document.querySelectorAll("span");
};

function isSkippedQuestion (isSkipped, setIsSkipped, counter) {
  
  if (isSkipped) {
    spansArr[counter].classList.add("bg-blue-500", "text-white");
  } else {
    spansArr[counter].classList.add("bg-green-500", "text-white");
  }
  setIsSkipped(true)
};


function scoreCalculator (score, total) {
  scoreCardContianer.classList.remove("invisible");
  scoreOutOf.innerText = `Your Score ${score} out of ${total}`;
  let percentage = Math.ceil((score * 100) / total);

  let progressCounter = 0;
  const loaderID = setInterval(() => {
    if (progressCounter === percentage) clearInterval(loaderID);
    span.innerText = `${progressCounter}%`;
    progressBar.style.background = `conic-gradient(blue ${progressCounter}%, #e5e4e2 0%)`;
    progressCounter++;
  }, 40);
};



function RenderTimeRemaining (NoOfQuestions, TimePerQuestion) {
  let totalTime = NoOfQuestions * TimePerQuestion;

  let m = Math.floor((totalTime % 3600) / 60);
  let s = Math.floor((totalTime % 3600) % 60);

  const id = setInterval(() => {
    let mDisplay = m <= 9 ? "0" + m + ":" : m + ":";
    let sDisplay = s <= 9 ? "0" + s : s;
    let format = mDisplay + sDisplay;
    setTimeFormat(format)
    timeRemainingPanel.innerHTML = `Time Remaining : <span class=" rounded-md py-1 px-2 border bg-sky-200 border-sky-500">${format}</span>`;
    if (m === 0 && s === 0) clearInterval(id);
    if (s === 0 && m > 0) {
      m--;
      s = 60;
    }
    s--;
  }, 1000);
};


async function testDataDB(){
  const user = JSON.parse(localStorage.getItem("user"))
  console.log(user)
  const {email,testID,category,score,correctQuestions,wrongQuestions,time} = user
  
  const response = await fetch("http://127.0.0.1:5000/test", {
    method: 'PATCH',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email,testID,category,score,correctQuestions,wrongQuestions,time}),
  })
  
}
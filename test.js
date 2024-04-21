
let testsContainer = document.querySelector("#data-from-db");
let testID = 0;

const setTestID = (value) => {
    testID = value;
    const user = JSON.parse(localStorage.getItem("user"))
    user.testID = testID;
    localStorage.setItem("user", JSON.stringify(user))
}

let userNameShow = document.querySelector("#user-name")
let accoutName = document.querySelector('#account');
const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const res = await fetch("http://127.0.0.1:5000/users");
    const data = await res.json();
    const loginUser = data.filter((u) => u.email === user.email)[0]
    console.log(loginUser);
    userNameShow.innerText = loginUser.name
    accoutName.innerText =loginUser.name;

}
fetchData()

document.querySelector("#take-test").addEventListener("click", ()=>{
    document.querySelector("#score-card-contianer").classList.remove("invisible");
})

function takeTest(){
document.querySelector("#take-test-btn").addEventListener("click", ()=>{
    document.querySelector("#take-test-btn").disabled = true
    let startTag = document.querySelector("#test-start-time");
    let start = 10;
    const id = setInterval(() => {
    if (start <= 0){
        clearInterval(id)
        location.href = "Quiz2.html"
    } 
    startTag.innerText = `Please wait: ${start>9?start:("0"+start)}`
    start--
    }, 1000)
    

    const categoryNumber = document.querySelector("#category").value
    const value = categoryNumber === "select" ? "9": categoryNumber
    localStorage.setItem("categoryNumber", JSON.stringify(value))
    
    testIDGenerator()
    categoryName(value);
    
    
})}
takeTest();

function testIDGenerator () {
  
    setTestID(Math.floor(Math.random() * 10000))
   
}

function categoryName(number){
    let name;
    if (number === '9') name = "G.K";
    if (number === '18') name = "Science";
    if (number === '21') name = "Sports";
    console.log(name);
    const user = JSON.parse(localStorage.getItem("user"))
    user.category = name;
    localStorage.setItem("user", JSON.stringify(user))

}


async function testFromDB(){
    const user = JSON.parse(localStorage.getItem("user"))
    const res = await fetch("http://127.0.0.1:5000/users");
    const data = await res.json();
    const userTest = data.filter((u) => u.email === user.email)[0]

    testsContainer.innerHTML = `
        ${userTest.tests.reverse().map((test)=>(
            `<div class="min-h-[50px] data-container">
                <div class="header text-slate-700">
                    <div>${test.date.substring(0, test.date.indexOf("T"))}</div>
                    <div>${test.testID}</div>
                    <div>${test.category}</div>
                    <div>${test.score}</div>
                    <div>${test.correctQuestions}</div>
                    <div>${test.wrongQuestions}</div>
                    <div>${test.time}</div>
                </div>
            </div>`
        )).join("")}
    `
}

testFromDB()







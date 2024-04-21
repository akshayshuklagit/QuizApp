let signUpForm = document.querySelector("#signupForm")
let loginInForm = document.querySelector("#loginForm")



signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = e.target[0].value
    let email = e.target[1].value   
    let password = e.target[2].value

    const res = await fetch("http://127.0.0.1:5000/signup", {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, password}),
    })

    const data = await res.json();

    if (data.success) {
        alert(data.message)
        location.href="dashboard.html"
    
    }

    else alert (data.message)

})


loginInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = e.target[0].value
    let password = e.target[1].value

    const res = await fetch("http://127.0.0.1:5000/login", {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    })

    const data = await res.json();

    if (data.success) {
        alert(data.message)
        localStorage.setItem("user", JSON.stringify({email: data.user.email}))
        location.href="dashboard.html"
    }
    else alert (data.message)
    
})

// Toggle between dark and light mode
function toggleLightDarkMode(button) {
    body = document.body
    if(button.checked){
        body.classList.remove('light')
        body.classList.add('dark')
    }
    else {
        body.classList.remove('dark')
        body.classList.add('light')
    }
}

async function setLightDarkMode(darkmode, delay) {
    if(delay) {
        await new Promise(resolve => setTimeout(resolve, delay))
        console.log("Waited")
    }
    
    body = document.body;
    button = document.getElementById("theme-switch");
    if(darkmode){
        body.classList.remove('light');
        body.classList.add('dark');
        button.checked = true;
    }
    else {
        body.classList.remove('dark');
        body.classList.add('light');
        button.checked = false;
    }
}

async function applyTransition() {
    setTimeout(() => {
        console.log("Applying transitions");
        document.body.classList.remove('instant');
    }, 500)
}
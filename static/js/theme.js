// Toggle between dark and light mode
function toggleLightDarkMode(button) {
    body = document.body
    if(button.checked){
    body.classList.remove('skeleton-blue')
        body.classList.add('soothing-orange')
    }
    else {
        body.classList.remove('soothing-orange')
        body.classList.add('skeleton-blue')
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
        body.classList.remove('skeleton-blue');
        body.classList.add('soothing-orange');
        button.checked = true;
    }
    else {
        body.classList.remove('soothing-orange');
        body.classList.add('skeleton-blue');
        button.checked = false;
    }
}

async function applyTransition() {
    setTimeout(() => {
        console.log("Applying transitions");
        document.body.classList.remove('instant');
    }, 500)
}
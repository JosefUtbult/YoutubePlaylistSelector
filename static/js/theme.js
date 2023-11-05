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
function closeHidden(element) {
    element.style.opacity = 0;
    setTimeout(() => {
        element.style.display = 'none';
    }, 200);
}

function openHidden(element) {
    element.style.display = 'block';
    setTimeout(() => {
        element.style.opacity = 1;
    }, 50);
}

function closeSettings() {
    closeHidden(document.getElementById('settings-menu'));
}

function openSettings() {
    closeHelp();
    openHidden(document.getElementById('settings-menu'));
}

function closeHelp() {
    closeHidden(document.getElementById('help-menu'));
}

function openHelp() {
    closeSettings();
    openHidden(document.getElementById('help-menu'));
}
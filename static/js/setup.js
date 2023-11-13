import('./player.js');
import('./cookies.js');
import('./theme.js');
import('./settings.js');

window.onload = () => {
    settings = getSettings();

    setLightDarkMode(settings.darkmode);
    applyTransition();
    setupPlayer(settings);
    populateSettings(settings);
    applyEnter();
}
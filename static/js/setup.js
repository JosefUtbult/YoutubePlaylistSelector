import('./player.js');
import('./cookies.js');
import('./theme.js');

window.onload = () => {
    settings = getSettings();
    setupPlayer(settings);
}
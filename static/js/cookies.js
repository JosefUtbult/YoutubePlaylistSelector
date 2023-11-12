import('./player.js');
import('./theme.js');
import('./settings.js');

const TEMPLATE = {
    version: '1.0',
    darkmode: false,
    playlists: [
        {
            title: "Funk Classics 70's & 80's",
            id: "PLBA986EF6C0FAA1D9"
        },
        {
            title: "Horror Music",
            id: "PLh9R0KdDnt86-neT6YyJCAAp-Wrz4jVcg"
        },
        {
            title: "Kids TV Shows Theme Songs",
            id: "PLiu41wwvHjSSum4YqwD-ds8l5Hu80sUnd"
        }
    ]
}

function log(message) {
    console.log(message);
}

// Take a settings object and store it as a cookie
function setSettings(settings) {
    if(settings.version === undefined) {
        log("Version is not specified in settings");
        return
    }
    if(settings.darkmode === undefined) {
        log("Darkmode flag not specified in settings")
        return
    }
    else if(settings.playlists === undefined) {
        log("Playlists not specified in settings")
        return
    }
    else if(!Array.isArray(settings.playlists)) {
        log("Malformed playlist list")
        return
    }

    if(!settings.playlists.every(element => {
        index = settings.playlists.indexOf(element);
        if(element.title === undefined) {
            log(`Title unspecified on playlist index ${index}`)
            return false;
        }
        else if(element.id === undefined) {
            log(`Playlist ID unspecified on playlist index ${index}`)
            return false;
        }
        return true;
    })) {
        return
    };

    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 365.25*1000*36000;
    now.setTime(expireTime);

    document.cookie = 'Settings='+ JSON.stringify(settings) +';expires='+now.toUTCString()+';path=/;SameSite=Strict'

    log("Imported settings");

    setupMenu(settings);
    populateSettings(settings);
    setLightDarkMode(settings.darkmode, 200);
}

// Retrieve the settings cookie
function getSettings() {
    try {
        const regex = /Settings=([^;]*)/gm;
        return JSON.parse(regex.exec(document.cookie)[1])
    } catch (error) {
        console.log("Unable to get settings from cookies. Using default")
        return {
            darkmode: false,
            playlists: []
        }
    } 
}

// Import settings from a file object and save it as a cookie
function importSettings() {
    element = document.getElementById("settings-input")
    if(element.files.length)
    {
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                settings = JSON.parse(e.target.result)
                setSettings(settings);
            } catch (error) {
                log("Unable to parse JSON file")
                return;
            }

        };

        reader.readAsBinaryString(element.files[0]);
    }
}
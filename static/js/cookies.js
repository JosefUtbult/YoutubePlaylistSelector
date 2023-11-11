import('./player.js');

function log(message) {
    console.log(message);
}

function setCookie() {
    element = document.getElementById("settings-input")
    if(element.files.length)
    {
        var reader = new FileReader();
        reader.onload = function(e) {
            let settings;
            try {
                settings = JSON.parse(e.target.result)
            } catch (error) {
                log("Unable to parse JSON file")
                return;
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
        };

        reader.readAsBinaryString(element.files[0]);
    }
}

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
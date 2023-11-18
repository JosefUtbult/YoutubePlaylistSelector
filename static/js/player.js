const RATE = 3000;

let player;
let skip = true;
let rechangePlaylist = true;
let lock = false;
let storedVolume = undefined;
let storedButton;
let playbackStatus = 0;

// BUFFERING: 3
// CUED: 5
// ENDED: 0
// PAUSED: 2
// PLAYING: 1
// UNSTARTED: -1

// Youtube stuff
function setupYoutube() {
    // Setup Youtube stuff
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Setup youtube playlist with an incorrect playlist ID at start
const initialSetup = {
    listType: 'playlist',
    list: 'not-applicable',
    index: parseInt(0),
    suggestedQuality: 'small'
}

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        loadPlaylist: initialSetup,
        events: {
            'onReady': (event) => {event.target.loadPlaylist(initialSetup)},
            'onStateChange': onPlayerStateChange
        }
    });
}

async function onPlayerStateChange(event) {
    console.log(`State change. Event: ${Object.keys(YT.PlayerState).find(key => YT.PlayerState[key] === event.data)}`);

    if(storedVolume === undefined) {
        // Store the first volume as the original one
        console.log("Applying first volume")
        storedVolume = event.target.getVolume()
        event.target.setVolume(0);
    }
   
    playbackStatus = event.data;
    if (event.data === YT.PlayerState.BUFFERING) {
        // The Youtube API is shit and won't change the playlist the first time for
        // some reason. Therefore, change it once again and retry
        if(rechangePlaylist) {
            console.log("Force rechaning playlist")

            await player.loadPlaylist({
                listType: 'playlist',
                list: storedButton.getAttribute('playlistid'),
                index: parseInt(0),
                suggestedQuality: 'small'
            })
            rechangePlaylist = false;
            return;
        }
        // After the second time changing the playlist, apply shuffle on the new
        // playlist and skip the first song which will allways be the same
        else if(skip) {
            console.log("Skip");
            player.setShuffle(true);
            player.setLoop(true);
            player.nextVideo();
            
            // Set the opacity to 1 for the first time
            document.getElementById('player').style.opacity = 1;
            skip = false;
        }
    }
    else if (event.data === YT.PlayerState.PLAYING) {
        // Increase the volume back to the original
        await increaseVolume();
        if(storedButton) {
            storedButton.classList.add('button-primary');
        }
        lock = false;
    }
    // Unlock when a video has paused
    else if (event.data === YT.PlayerState.PAUSED) {
        lock = false;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function decreaseVolume(originalVolume) {

    // If nothing is playing, skip decreasing the volume. Otherwise,
    // decrease it
    if([YT.PlayerState.UNSTARTED, YT.PlayerState.PAUSED, YT.PlayerState.ENDED].indexOf(playbackStatus) < 0) {
        
        // Store the current volume, to make sure it wont be muted the next time
        storedVolume = player.getVolume();
        
        console.log(`Decreasing volume from ${originalVolume}`)
        for (let i = originalVolume - 1; i >= 0; i--) {
            player.setVolume(i);
            await delay(RATE / originalVolume);
        }
    }
}

async function increaseVolume() {
    if(storedVolume) {
        for (let i = 0; i <= storedVolume; i++) {
            player.setVolume(i);
            await delay(RATE / storedVolume);
        }
        console.log(`Increased volume back to ${storedVolume}`);
    }
}

// Activates when one of the playlist buttons is pressed
async function changeVideo(button) {
    // Lock button functionality until the next playlist has started
    if (!lock) {
        console.log("Changing video")

        lock = true;
        let originalVolume
        try {
            originalVolume = player.getVolume();
        } catch {
            console.log("Unable to get player correctly. Probably still loading");
            lock = false;
            return
        }
        console.log(`Original volume: ${originalVolume}`);

        // Change playlist if playing. Otherwise, pause
        if(button.getAttribute('state') != 'true') {

            Array.from(document.getElementsByClassName('playlist-button')).forEach(element => {
                element.classList.remove('button-primary');
                element.classList.remove('pre-active');
                element.setAttribute('state', 'false');
            })

            button.classList.add('pre-active');
            button.setAttribute('state', 'true')
            
            // Decrease the volume gradually
            await decreaseVolume(originalVolume);

            // Make sure the video player is running
            player.playVideo();

            // Tell the OnPlayerChanged event to apply shuffle and loop, then to
            // skip the first video. This is to get shuffling working without
            // always playing the same video first
            skip = true;
            rechangePlaylist = true;
            await player.loadPlaylist({
                listType: 'playlist',
                list: button.getAttribute('playlistid'),
                index: parseInt(0),
                suggestedQuality: 'small'
            })

            // Store the current button for the event driven change to set as active
            storedButton = button;
        }
        else {
            button.classList.remove('button-primary');

            // Decrease the volume gradually
            await decreaseVolume(originalVolume);

            player.pauseVideo();

            button.classList.remove('pre-active');
            button.setAttribute('state', 'false');
            lock = false;
        }
    }
    else {
        console.log("Ignore input when loading lock is active");
    }
}

function setupMenu(settings) {
    let el = document.getElementById("selectionButtons");
    el.innerHTML = '';

    // For each instance in the playlist, create a button
    settings.playlists.forEach(element => {
        if(element.title !== '' && element.id !== '') {
            button = document.createElement('button');
            button.innerHTML = element.title;
            button.setAttribute('playlistid', element.id);
            button.setAttribute('title', element.title);
            button.classList.add('button');
            button.classList.add('playlist-button');
            button.onclick = function () { changeVideo(this) }
            
            el.appendChild(button);
        }
    });

}

function setupPlayer(settings) {
    setupYoutube();
    setupMenu(settings);
}
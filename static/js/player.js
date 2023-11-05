let playlists = [
    {
        title: "CoC: Mystery",
        id: 'PLuu9kZA0CNfMqrEvFuHxcnGJWEW8EN5Hm'
    },
    {
        title: "CoC: Horror",
        id: 'PLuu9kZA0CNfPjXkT4BWCSV2tKJOhhe2oS'
    }
];

const RATE = 3000;

let player;
let skip = false;
let lock = false;
let storedVolume = 0;

// BUFFERING: 3
// CUED: 5
// ENDED: 0
// PAUSED: 2
// PLAYING: 1
// UNSTARTED: -1

let playbackStatus = 0;

// Youtube stuff
function setupYoutube() {
    // Setup Youtube stuff
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        loadPlaylist: {
            listType: 'playlist',
            list: playlists[0].id,
            index: parseInt(0),
            suggestedQuality: 'small'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    console.log(YT.PlayerState)
}
function onPlayerReady(event) {
    event.target.loadPlaylist({
        listType: 'playlist',
        list: playlists[0].id,
        index: parseInt(0),
        suggestedQuality: 'small',
    });
}

function onPlayerStateChange(event) {
    // console.log(`State change. Event: ${event.data}`)
    playbackStatus = event.data;

    if (event.data === YT.PlayerState.PLAYING && skip) {
        console.log("Skip");
        player.setShuffle(true);
        player.setLoop(true);
        player.nextVideo();

        // Set the opacity to 1 for the first time
        document.getElementById('player').style.opacity = 1;
        skip = false;
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

async function increaseVolume(originalVolume) {
    if(originalVolume === 0) {
        originalVolume = storedVolume;
        console.log(`Playback paused. Changing to stored volume: ${storedVolume}`)
    }
    for (let i = 0; i <= originalVolume; i++) {
        player.setVolume(i);
        await delay(RATE / originalVolume);
    }
    console.log(`Increased volume back to ${originalVolume}`);
}

// Activates when one of the playlist buttons is pressed
async function changeVideo(button) {
    // Lock button functionality until the next playlist has started
    if (!lock) {
        console.log("Changing video")

        lock = true;
        let originalVolume = player.getVolume();
        console.log(`Original volume: ${originalVolume}`);

        // Change playlist if playing. Otherwise, pause
        if(button.getAttribute('state') != 'true') {

            Array.from(document.getElementsByClassName('playlist-button')).forEach(element => {
                element.classList.remove('active');
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
            await player.loadPlaylist({
                listType: 'playlist',
                list: button.getAttribute('playlistid'),
                index: parseInt(0),
                suggestedQuality: 'small'
            })

            // Increase the volume back to the original
            await increaseVolume(originalVolume);
            button.classList.add('active');
        }
        else {
            button.classList.remove('active');

            // Decrease the volume gradually
            await decreaseVolume(originalVolume);

            player.pauseVideo();

            button.classList.remove('pre-active');
            button.setAttribute('state', 'false');
        }

        lock = false;
    }
    else {
        console.log("Ignore input when loading lock is active");
    }
}

function setupMenu() {
    let el = document.getElementById("selectionButtons");
    // For each instance in the playlist, create a button
    playlists.forEach(element => {
        button = document.createElement('button');
        button.innerHTML = element.title;
        button.setAttribute('playlistid', element.id);
        button.setAttribute('title', element.title);
        button.classList.add('playlist-button');
        button.onclick = function () { changeVideo(this) }
        el.appendChild(button);
    });

}

window.onload = () => {

    setupYoutube();
    setupMenu();
}
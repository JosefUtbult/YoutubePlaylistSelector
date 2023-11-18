function setupTrashButton(index) {
    let trashContainer = document.createElement('div');
    trashContainer.classList.add('two')
    trashContainer.classList.add('columns')
    trashContainer.classList.add('trash-button-container')

    let trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    // Copy the trash icon that has the correct URL to the svg file
    let trashSvg = document.getElementById('trashcan-icon').cloneNode(true);
    trashSvg.id = '';
    trashSvg.style.display = "block";
    trashButton.appendChild(trashSvg);

    trashButton.onclick = function () { removeField(this) };
    trashButton.setAttribute('index', index);

    trashContainer.appendChild(trashButton);

    return trashContainer;
}

function setupTitleField(index, title) {
    let titleContainer = document.createElement('div');
    titleContainer.classList.add('five');
    titleContainer.classList.add('columns');

    let titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', `settings-title-${index}`);
    titleLabel.innerHTML = "Title";

    let titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.id = `settings-title-${index}`;
    titleInput.value = title;

    titleContainer.appendChild(titleLabel);
    titleContainer.appendChild(titleInput);

    return titleContainer;
}

function setupIdField(index, id) {
    let idContainer = document.createElement('div');
    idContainer.classList.add('five');
    idContainer.classList.add('columns');

    let idLabel = document.createElement('label');
    idLabel.setAttribute('for', `settings-id-${index}`);
    idLabel.innerHTML = "Playlist ID or URL";

    let idInput = document.createElement('input');
    idInput.setAttribute('type', 'text');
    idInput.id = `settings-id-${index}`;
    idInput.value = id;

    idContainer.appendChild(idLabel);
    idContainer.appendChild(idInput);

    return idContainer;
}

function setupHr() {
    return document.createElement('hr');
}

function populateSettings(settings) {
    let playlists = settings.playlists;
    parentElement = document.getElementById('playlists-form');
    parentElement.innerHTML = '';

    playlists.forEach(element => {
        index = settings.playlists.indexOf(element);

        let container = document.createElement('div');
        container.classList.add('row');
        
        container.appendChild(setupHr());
        container.appendChild(setupTrashButton(index));
        container.appendChild(setupTitleField(index, element.title));
        container.appendChild(setupIdField(index, element.id));

        parentElement.appendChild(container);
    });
}

function removeField(button) {
    let index = button.getAttribute('index');
    let settings = getSettings();
    console.log(`Removing button ${index}`);
    settings.playlists.splice(parseInt(index), 1);
    setSettings(settings, false);
}

function addField() {
    console.log("Adding field");
    let settings = getSettings();
    settings.playlists.push({
        title: '',
        id: ''
    });
    setSettings(settings, false);
}

function applySettings() {
    console.log("Applying settings");
    let settings = getSettings();
    settings.playlists = [];

    // Finds the "list=" part of the URL and extract its value
    const regex = /list=([^&]*)/gm;

    parentElement = document.getElementById('playlists-form');
    parentElement.childNodes.forEach(element => {
        let title = element.childNodes[2].childNodes[1].value;
        let raw_id = element.childNodes[3].childNodes[1].value;
        let id;

        if ((res = regex.exec(raw_id)) !== null) {
            id = res[1];
        }
        else {
            id = raw_id;
        }

        if(title !== '' && id !== '') {
            settings.playlists.push({
                title: title,
                id: id
            })
        }
    });

    setSettings(settings, false);
    
}

function makeDownload(settings, filename) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 4));
    var dlAnchorElem = document.getElementById('hiddenDownload');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${filename}.json`);
    dlAnchorElem.click();
}

function exportSettings() {
    let date = new Date();
    let dateString = `settings-${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;

    makeDownload(getSettings(), dateString);
}

function downloadTemplate() {
    makeDownload(TEMPLATE, 'template');
}

// Override behavior when pressing enter in a settings field, which would
// normally trigger the first trash button. Prevent this behavior and run the
// applySettings function instead
function applyEnter() {
    var element = document.getElementById('settings-menu');
    element.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            applySettings();
        }
    });
}
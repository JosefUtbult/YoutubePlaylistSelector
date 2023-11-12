function closeSettings() {
    document.getElementById("settings-menu").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("settings-menu").style.display = 'none';
    }, 200);
}

function openSettings() {
    document.getElementById("settings-menu").style.display = 'block';
    setTimeout(() => {
        document.getElementById("settings-menu").style.opacity = 1;
    }, 50);
}


{/* <div class="row">
    <div class="two columns trash-button-container">
        <button class="trash-button">
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                    d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
            </svg>
        </button>
    </div>
    <div class="five columns">
        <label for="settings-name-1">Name</label>
        <input type="text" id="settings-name-1">
    </div>
    <div class="five columns">
        <label for="settings-id-1">Youtube URL</label>
        <input type="text" id="settings-id-1">
    </div>
</div> */}

const TRASHBUTTONSVG = `
    <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
        <path
            d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
    </svg>`

function setupTrashButton(index) {
    let trashContainer = document.createElement('div');
    trashContainer.classList.add('two')
    trashContainer.classList.add('columns')
    trashContainer.classList.add('trash-button-container')

    let trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.innerHTML = TRASHBUTTONSVG;
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
    idLabel.innerHTML = "Playlist ID";

    let idInput = document.createElement('input');
    idInput.setAttribute('type', 'text');
    idInput.id = `settings-id-${index}`;
    idInput.value = id;

    idContainer.appendChild(idLabel);
    idContainer.appendChild(idInput);

    return idContainer;
}

function populateSettings(settings) {
    let playlists = settings.playlists;
    parentElement = document.getElementById('playlists-form');
    parentElement.innerHTML = '';

    playlists.forEach(element => {
        index = settings.playlists.indexOf(element);

        let container = document.createElement('div');
        container.classList.add('row');
        
        container.appendChild(setupTrashButton(index));
        container.appendChild(setupTitleField(index, element.title));
        container.appendChild(setupIdField(index, element.id));

        parentElement.appendChild(container);
    });
}

function removeField(button) {
    let index = button.getAttribute('index');
    let settings = getSettings();
    settings.playlists.splice(parseInt(index), 1);
    setSettings(settings);
}

function addField() {
    let settings = getSettings();
    settings.playlists.push({
        title: '',
        id: ''
    });
    setSettings(settings);
}

function applySettings() {
    let settings = getSettings();
    settings.playlists = [];

    parentElement = document.getElementById('playlists-form');
    parentElement.childNodes.forEach(element => {
        title = element.childNodes[1].childNodes[1].value;
        id = element.childNodes[2].childNodes[1].value;
        if(title !== '' && id !== '') {
            settings.playlists.push({
                title: title,
                id: id
            })
        }
    });

    setSettings(settings);
    
}

function makeDownload(settings) {
    let date = new Date();
    let dateString = date.getUTCDate() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear();

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 4));
    var dlAnchorElem = document.getElementById('hiddenDownload');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `settings-${dateString}.json`);
    dlAnchorElem.click();
}

function exportSettings() {
    makeDownload(getSettings());
}

function downloadTemplate() {
    makeDownload(TEMPLATE);
}
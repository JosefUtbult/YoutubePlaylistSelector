function setupTrashButton(onclick) {
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

	trashButton.onclick = function () { onclick(this) };

	trashContainer.appendChild(trashButton);

	return trashContainer;
}

function setupAddButton(addContainer, className, onclick) {

	addContainer.classList.add(`${className}-button-container`)
	addContainer.classList.add('add-button-container')

	let addButton = document.createElement('button');
	addButton.classList.add(`${className}-button`);
	addButton.classList.add('add-button');

	// Copy the trash icon that has the correct URL to the svg file
	let addSvg = document.getElementById('plus-icon').cloneNode(true);
	addSvg.id = '';
	addSvg.style.display = "block";
	addButton.appendChild(addSvg);

	addButton.onclick = function () { onclick(this) };

	addContainer.appendChild(addButton);
}

function setupAddButtonContainer(parent, className, onclick) {
	let addProjectContainer = document.createElement('div');
	addProjectContainer.classList.add('row');

	let left = document.createElement('div');
	left.classList.add('five');
	left.classList.add('columns');
	addProjectContainer.appendChild(left);

	let addButtonContainer = document.createElement('div');
	addButtonContainer.classList.add('two');
	addButtonContainer.classList.add('columns');

	setupAddButton(addButtonContainer, className, onclick);
	addProjectContainer.appendChild(addButtonContainer);

	let right = document.createElement('div');
	right.classList.add('five');
	right.classList.add('columns');
	addProjectContainer.appendChild(right);
	parent.appendChild(addProjectContainer);

}

function setupTitleField(element, category, project, playlist) {
	let titleContainer = document.createElement('div');
	titleContainer.classList.add('five');
	titleContainer.classList.add('columns');

	let titleLabel = document.createElement('label');
	titleLabel.setAttribute('for', `playlist-title-${category}-${project}-${playlist}`);
	titleLabel.innerHTML = "Title";

	let titleInput = document.createElement('input');
	titleInput.setAttribute('type', 'text');
	titleInput.id = `playlist-title-${category}-${project}-${playlist}`;
	titleInput.value = element.title;

	titleContainer.appendChild(titleLabel);
	titleContainer.appendChild(titleInput);

	return titleContainer;
}

function setupIdField(element, category, project, playlist) {
	let idContainer = document.createElement('div');
	idContainer.classList.add('five');
	idContainer.classList.add('columns');

	let idLabel = document.createElement('label');
	idLabel.setAttribute('for', `playlist-title-${category}-${project}-${playlist}`);
	idLabel.innerHTML = "Playlist ID or URL";

	let idInput = document.createElement('input');
	idInput.setAttribute('type', 'text');
	idInput.id = `playlist-title-${category}-${project}-${playlist}`;
	idInput.value = element.id;

	idContainer.appendChild(idLabel);
	idContainer.appendChild(idInput);

	return idContainer;
}

function setupHr(className) {
	let hr = document.createElement('hr');
	if (className) {
		hr.classList.add(className);
	}
	return hr;
}

function setupContainerPair() {
	let outer = document.createElement('div');
	outer.classList.add('row');
	let inner = document.createElement('div');
	inner.classList.add('full-container');
	outer.appendChild(inner);
	
	return { outer: outer, inner: inner };
}

function setupHeaderContainer(headerType, content, alignment) {
	let headerContainer = document.createElement('div');
	headerContainer.classList.add('row');
	let header;
	
	if (alignment === 'center') {
		let left = document.createElement('div');
		left.classList.add('two');
		left.classList.add('columns');
		headerContainer.appendChild(left);

		header = document.createElement(headerType);
		header.innerHTML = content;
		header.classList.add('eight');
		header.classList.add('columns');
		headerContainer.appendChild(header);

		let right = document.createElement('div');
		right.classList.add('two');
		right.classList.add('columns');
		headerContainer.appendChild(right);

		return {
			container: headerContainer,
			header: header,
			left: left,
			right: right
		};
	}
	if (alignment === 'left') {
		header = document.createElement(headerType);
		header.innerHTML = content;
		header.classList.add('six');
		header.classList.add('columns');
		headerContainer.appendChild(header);

		let right = document.createElement('div');
		right.classList.add('six');
		right.classList.add('columns');
		headerContainer.appendChild(right);

		return {
			container: headerContainer,
			header: header,
			right: right
		};
	}

	header = document.createElement(headerType);
	header.innerHTML = content;
	headerContainer.appendChild(header);

	return {
		container: headerContainer,
		header: header
	};
}

// Create the settings menu
function populateSettings(settings) {
	// TODO: Remove
	parentElement = document.getElementById('playlists-form');
	parentElement.innerHTML = '';

	settings.category.forEach(category => {

		let categoryIndex = settings.category.indexOf(category);

		let categoryHeader = setupHeaderContainer('h4', category.name, 'center');
		parentElement.appendChild(categoryHeader.container);

		let categoryContainer = setupContainerPair();
		categoryContainer.inner.classList.add('category');
		categoryContainer.inner.setAttribute('category', categoryIndex);

		category.project.forEach(project => {
			let projectIndex = category.project.indexOf(project);

			let projectHeader = setupHeaderContainer('h5', project.name, 'left');
			setupAddButton(projectHeader.right, 'add-playlist', addPlayistField);
			categoryContainer.inner.appendChild(projectHeader.container);

			let projectContainer = setupContainerPair();
			projectContainer.inner.setAttribute('category', categoryIndex);
			projectContainer.inner.setAttribute('project', projectIndex);

			let playlists = project.playlists;

			playlists.forEach(element => {
				let playlistIndex = playlists.indexOf(element);

				let playlistContainer = setupContainerPair();
				playlistContainer.inner.setAttribute('category', categoryIndex);
				playlistContainer.inner.setAttribute('project', projectIndex);
				playlistContainer.inner.setAttribute('playlist', playlistIndex);

				playlistContainer.inner.appendChild(setupHr('hidden-hr'));
				playlistContainer.inner.appendChild(setupTrashButton(removePlaylistField));
				playlistContainer.inner.appendChild(
					setupTitleField(element, categoryIndex, projectIndex, playlistIndex)
				);
				playlistContainer.inner.appendChild(
					setupIdField(element, categoryIndex, projectIndex, playlistIndex)
				);

				projectContainer.inner.appendChild(playlistContainer.outer);
			});

			categoryContainer.inner.appendChild(projectContainer.outer);
		});

		categoryContainer.inner.appendChild(setupHr());
		setupAddButtonContainer(categoryContainer.inner, 'add-project', addProjectField);
		parentElement.appendChild(categoryContainer.outer);
	});
}

function removeCategoryField(button) {
	console.log(button.parentElement.parentElement);
	// let parent = button.parentElement.parentElement;
	// let categoryIndex = parseInt(parent.getAttribute('category'));
	// let projectIndex  = parseInt(parent.getAttribute('project'));
	// let playlistIndex = parseInt(parent.getAttribute('playlist'));

	// let settings = getSettings();
	// console.log(`Removing button ${categoryIndex}-${projectIndex}-${playlistIndex}`);
	// settings.category[categoryIndex].project[projectIndex].playlists.splice(parseInt(playlistIndex), 1);
	// setSettings(settings, false);
}

function removeProjectField(button) {
	console.log(button.parentElement.parentElement);
	// let parent = button.parentElement.parentElement;
	// let categoryIndex = parseInt(parent.getAttribute('category'));
	// let projectIndex  = parseInt(parent.getAttribute('project'));
	// let playlistIndex = parseInt(parent.getAttribute('playlist'));

	// let settings = getSettings();
	// console.log(`Removing button ${categoryIndex}-${projectIndex}-${playlistIndex}`);
	// settings.category[categoryIndex].project[projectIndex].playlists.splice(parseInt(playlistIndex), 1);
	// setSettings(settings, false);
}

function removePlaylistField(button) {
	let parent = button.parentElement.parentElement;
	let categoryIndex = parseInt(parent.getAttribute('category'));
	let projectIndex  = parseInt(parent.getAttribute('project'));
	let playlistIndex = parseInt(parent.getAttribute('playlist'));

	let settings = getSettings();
	console.log(`Removing button ${categoryIndex}-${projectIndex}-${playlistIndex}`);
	settings.category[categoryIndex].project[projectIndex].playlists.splice(playlistIndex, 1);
	setSettings(settings, false);
}

function addCategoryField() {
	console.log("Adding category field");
	let settings = getSettings();
	settings.category.push({
		name: 'test',
		project: []
	});
	setSettings(settings, false);
}

function addProjectField(element) {
	console.log("Adding project field");
	let parent = element.parentElement.parentElement.parentElement;
	console.log(parent);
	let categoryIndex = parseInt(parent.getAttribute('category'));

	settings.category[categoryIndex].project.push({
		name: '-',
		playlists: []
	});
	console.log(settings.category[categoryIndex]);
	setSettings(settings, false);
}

function addPlayistField(element) {
	console.log("Adding playlist field");
	let parent = element.parentElement.parentElement.parentElement;
	console.log(parent);

	let categoryIndex = parseInt(parent.getAttribute('category'));
	let projectIndex =  parseInt(parent.getAttribute('project'));
	settings.category[categoryIndex].project[projectIndex].playlists.push({
		'title': '',
		'id': ''
	});
	setSettings(settings, false);
}

// Iterate over project divs in the settings menu and extract its data
function iterateProject(projectNodes) {
	// Finds the "list=" part of the URL and extract its value
	const regex = /list=([^&]*)/gm;

	let projects = []

	// Create an undefined project
	let project = undefined;

	// For each element that might be a project or a heading for a project
	projectNodes.forEach(projectElement => {
		if (projectElement.childNodes[0].tagName.toLowerCase() === 'h5') {
			let name = projectElement.childNodes[0].innerHTML;
			console.log(`Project name: ${name}`)
			// Define the project object and undefine it later. Makes sure everything aborts if the HTML is wrong
			project = {
				name: name,
				playlists: []
			}
		}
		// Handle all children that are projectElement containers
		else if (
			projectElement.childNodes[0].classList.contains('full-container') &&
			project != undefined
		) {

			// Extract the div containing all playlist divs
			let playlistContainer = projectElement.childNodes[0];
			playlistContainer.childNodes.forEach(playlistContainer => {
				// Extract the inner container of the playlist
				let playlistElement = playlistContainer.childNodes[0];

				let title = playlistElement.childNodes[2].childNodes[1].value;
				let raw_id = playlistElement.childNodes[3].childNodes[1].value;
				let id;

				if ((res = regex.exec(raw_id)) !== null) {
					id = res[1];
				}
				else {
					id = raw_id;
				}

				console.log(`Id: ${id}, title: ${title}`)

				if(title !== '' && id !== '') {
					project.playlists.push({
						title: title,
						id: id
					})
				}
			});

			projects.push(project);
			project = undefined;
		}
	});
	return projects;
}

function applySettings() {
	console.log("Applying settings");
	let settings = getSettings();
	settings.category = [];
	category = undefined;

	// Find the playlist-form element and extract the div containing all category divs
	parentElement = document.getElementById('playlists-form');
	let categoryContainer = parentElement.childNodes;

	categoryContainer.forEach(categoryElement => {
		if (categoryElement.childNodes[0].tagName.toLowerCase() === 'h4') {
			let name = categoryElement.childNodes[0].innerHTML;
			console.log(`Category name: ${name}`)
			// Define the category object and undefine it later. Makes sure everything aborts if the HTML is wrong
			category = {
				name: name,
				project: []
			};
		}
		// Handle all children that are categoryElement containers
		else if (
			categoryElement.childNodes[0].classList.contains('full-container') &&
			category != undefined
		) {
			category.project = iterateProject(categoryElement.childNodes[0].childNodes);
			settings.category.push(category);
			category = undefined;
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

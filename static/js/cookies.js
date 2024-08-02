import('./player.js');
import('./theme.js');
import('./settings.js');

const TEMPLATE = {
	version: '1.1',
	darkmode: false,
	category: [{
		name: "Category 1",
		project: [{
			name: "Project 1",
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
		},
		{
			name: "Project 2",
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
		}]
	},
	{
		name: "Category 2",
		project: [{
			name: "Project 1",
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
		},
		{
			name: "Project 2",
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
		}]
	}]
}

const VERSION = "1.1"

function log(message) {
	console.log(message);
	let element = document.getElementById('log-window');
	let child = document.createElement('p');
	child.innerHTML = message;
	element.appendChild(child);

	setTimeout(() => {
		child.style.opacity = 1;
	}, 100);

	setTimeout(() => {
		setTimeout(() => {
			element.removeChild(child);
		}, 500);
		child.style.opacity = 0;
	}, 5000);
}

// Take a settings object and store it as a cookie
function setSettings(settings, reload=false) {
	if(settings.version === undefined) {
		log("Version is not specified in settings");
		return
	}
	else if(settings.version !== VERSION) {
		log(`Version ${settings.version} is no longer supported`)
		return
	}
	else if(settings.darkmode === undefined) {
		log("Darkmode flag not specified in settings")
		return
	}
	else if(settings.category === undefined) {
		log("category not specified in settings")
		return
	}
	else if(!Array.isArray(settings.category)) {
		log("Malformated category list")
		return
	}
	settings.category.forEach(category => {
		if(category.name === undefined) {
			log("category name not specified in settings")
			return
		}
		else if(category.project === undefined) {
			log("Project not specified in settings")
			return
		}
		else if(!Array.isArray(category.project)) {
			log("Malformated project list")
			return
		}

		category.project.forEach(project => {
			if(project.name === undefined) {
				log("Project name is not specified in settings")
				return
			}
			if(project.playlists === undefined) {
				log("Project playlists not specified in settings")
				return
			}
			else if(!Array.isArray(project.playlists)) {
				log("Malformed playlist list")
				return
			}
			if(!project.playlists.every(element => {
				index = project.playlists.indexOf(element);
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

		});
	});

	var now = new Date();
	var time = now.getTime();
	var expireTime = time + 365.25*1000*36000;
	now.setTime(expireTime);

	document.cookie = 'Settings='+ JSON.stringify(settings) +';expires='+now.toUTCString()+';path=/;SameSite=Strict'

	setupMenu(settings);
	populateSettings(settings);
	if(reload) {
		setLightDarkMode(settings.darkmode, 200);
		log("Imported settings");
	}
}

// Retrieve the settings cookie
function getSettings() {
	try {
		const regex = /Settings=([^;]*)/gm;
		settings = JSON.parse(regex.exec(document.cookie)[1]);
		if (settings.version === undefined || settings.version !== VERSION) {
			console.log("Older settings stored in cookie. Using template");
			return TEMPLATE;
		}
		return settings;
	} catch (error) {
		console.log("Unable to get settings from cookies. Using default")
		return TEMPLATE; 
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
				setSettings(settings, true);
			} catch (error) {
				log("Unable to parse JSON file")
				return;
			}

		};

		reader.readAsBinaryString(element.files[0]);
	}
}

window.onload = app;
window.onpageshow = function() {
	document.getElementsByTagName('input')[0].value = null;
}

function app() {

	let branding = document.getElementById('branding');
	let results = document.getElementById('results');
	let searchBox = document.getElementsByTagName('input')[0];

	searchBox.oninput = function(e) {
		if (searchBox.value.length != 0 )
		{
			branding.className = 'hidden';
		}
		else {
			clearResults();
			branding.className = '';
		}
	};

	searchBox.onkeyup = function(e) {

		clearTimeout(searchBox.dataset.timer);

		if( e.keyCode == 13) {
			search(true);
		} else {
			if (searchBox.value.length != 0) {
				searchBox.dataset.timer = setTimeout(() => {search(false);}, 500);
			}
		}
	}

	function search(details) {
		
		let categoryMembers = 'https://en.wikipedia.org/w/api.php?action=query&generator=categorymembers&format=json&prop=extracts&exintro=true&explaintext=true&exchars=150&origin=*&gcmtype=page&gcmtitle=Category:';
		let allCategories = 'https://en.wikipedia.org/w/api.php?action=query&generator=allcategories&format=json&origin=*&gacprefix=';
		let text = encodeURIComponent(searchBox.value);
		let endPoint = details ? categoryMembers : allCategories;
		let req = new XMLHttpRequest();

		req.open('get', endPoint + text);
		req.onload = (data) => {loadData(data, details)};
		req.send();
	}

	function loadData(data, details) {
		
		let res = JSON.parse(data.target.responseText);
		let items = res.query && res.query.pages ? res.query.pages : {'empty': {title: 'No results'}};

		clearResults();

		for ( let item in items ) {
			
			let result = items[item];

			if(result.extract && result.extract.length < 10  && details)
				continue;

			appendListItem(result, details);
		}
	}

	function appendListItem(item, details) {

		let newDiv = document.createElement('div');
		let title = item.title;

		if (title.indexOf(':') > 0) {

			if (details) return;
			title = title.split(':')[1];
		}

		let titleText = document.createTextNode(title); 

		newDiv.className = 'listItem';
		newDiv.onclick = details ? () => {window.location ='http://www.wikipedia.com/wiki/' + title;} : () => {
			searchBox.value = title;
			search(true);
		};

		if (title == 'No results') {
			newDiv.className = 'no-results';
			newDiv.onclick = null;
		}

	    newDiv.appendChild(titleText);

		if (item.extract) {
			createExtract(item.extract, newDiv);
		}

	    results.appendChild(newDiv);
	}

	function createExtract(extractText, div) {
		let newPara = document.createElement('p');
		let text = document.createTextNode(extractText);

		newPara.appendChild(text);

		return div.appendChild(newPara);
	}

	function clearResults() {
		
		while (results.firstChild) {
		    results.removeChild(results.firstChild);
		}

	}

}
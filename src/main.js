import {addPlacemark} from './placemark';
import mapCarouselTemplate from '../carousel.html';

require('./styles/map.scss');
let tcomment = require('../comment.hbs');
let reviewWindow = document.querySelector('.review');
let reviewTittle = document.getElementById('location');
let reviewClose = document.querySelector('.review__close');
let reviewList = document.querySelector('.review__list');
let reviewForm = document.querySelector('.form');
let mymap = document.getElementById('map');

let options = {
	day: 'numeric',
	month: 'numeric',
	year: 'numeric',
	timezone: 'UTC',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
};

let map;
let coords;

new Promise(resolve => ymaps.ready(resolve))
	.then(() => {
		map = new ymaps.Map("map", {
			center: [55.751574, 37.573856],
			zoom: [12]
		});

		let customItemContentLayout = ymaps.templateLayoutFactory.createClass(mapCarouselTemplate);

		var clusterer = new ymaps.Clusterer({
			preset: 'islands#invertedVioletClusterIcons',
			clusterBalloonContentLayout: 'cluster#balloonCarousel',
			groupByCoordinates: false,
			clusterHideIconOnBalloonOpen: false,
			clusterBalloonItemContentLayout: customItemContentLayout,
			geoObjectHideIconOnBalloonOpen: false,
			clusterBalloonPanelMaxMapArea: 0,
			clusterDisableClickZoom: true,
			clusterBalloonPagerSize: 5,
			clusterOpenBalloonOnClick: true,
			gridSize: 50
		});


		map.events.add('click', function(e) {
			coords = e.get('coords');
			createMW(e, coords);
		});

		map.geoObjects.add(clusterer);

		reviewForm.addEventListener('submit', function(e) {
			e.preventDefault();

			let comment = {};

			let author = e.target[0].value.trim();
			let coordinate = reviewWindow.dataset.coords;
			let place = e.target[1].value.trim();
			let date = new Date().toLocaleString("ru", options);
			let text = e.target[2].value.trim();

			comment.name = author;
			comment.place = place;
			comment.date = date;
			comment.comment = text;

			var placemark = addPlacemark(coordinate.split(','), comment);

			map.geoObjects.add(placemark);

			// Добавляем метку в кластер
			clusterer.add(placemark);

			reviewList.innerHTML += tcomment({
				comments: [comment]
			});


			e.target[0].value = '';
			e.target[1].value = '';
			e.target[2].value = '';


			let baloon = fromLocalStorage(coords);
			baloon.comments.push(comment);

			//сохраняем координаты балуна
			baloon.coords = coords;
			toLocalSorage(coords, baloon);
		});

		clusterer.events.add('click', function (e) {
			let object = e.get('target');

			if (object.options.getName() === 'geoObject') {
				let coordss = object.geometry.getCoordinates();
				let posY = e.get('domEvent').get('pageY');
				let posX = e.get('domEvent').get('pageX');
				openDialog([posY, posX], coordss);
			}
		});

		init(map, clusterer);
});


function toLocalSorage(coords, baloon) {
	let c = coords.join(',');
	localStorage.setItem(c, JSON.stringify(baloon));
}

function fromLocalStorage(coords) {
	let c = coords.join(',');
	let baloon = localStorage.getItem(c);
	if (!baloon) {
		return undefined;
	}

	return JSON.parse(baloon);
}


function createMW(e, coords) {

	ymaps.geocode(coords, {})
		.then(res => {
			let title = res.geoObjects.get(0).properties.get('text');
			let posY = e.get('domEvent').get('pageY');
			let posX = e.get('domEvent').get('pageX');
			let baloon = {
				comments: [],
				title: title
			};

			toLocalSorage(coords, baloon);
			dialog([posY, posX], coords, baloon);
		})
}


function setPosition(position) {
	if ((innerHeight - position[0]) > reviewWindow.clientHeight) {
		reviewWindow.style.top = `${position[0]}px`;
		reviewWindow.style.bottom = 'auto';
	}

	if ((innerWidth - position[1]) > reviewWindow.clientWidth) {
		reviewWindow.style.left = `${position[1]}px`;
		reviewWindow.style.right = 'auto';
	}
}


function dialog(position, coords, baloon) {
	ymaps.geocode(coords, {})
		.then(res => {

			if (reviewWindow.classList.contains('review_show')) {
				reviewWindow.classList.toggle('review');
			}

			reviewList.textContent = '';
			reviewTittle.textContent = baloon.title;
			reviewWindow.dataset.coords = coords;

			setPosition(position);

			if (baloon.comments.length) {

				reviewList.innerHTML += tcomment({
					comments: baloon.comments
				});

			}
		});

	reviewWindow.classList.add('review_show');
}

function openDialog(position, coo){
	let pos = [position[0], position[1]];
	let coordinate = coo;
	let baloon = fromLocalStorage(coordinate);

	dialog(pos, coordinate, baloon);
}

mymap.addEventListener('click', function(e) {
	let link = e.target;

	if (link.classList.contains('baloon__link')) {
		let coordinate = link.dataset.coords.split(',');
		let posY = e.pageY;
		let posX = e.pageX;
		let baloon = fromLocalStorage(coordinate);
		dialog([posY, posX], coordinate, baloon);
	}
});

reviewClose.addEventListener('click', (e) => reviewWindow.classList.toggle('review'));

function init(map, clusterer) {
	if (localStorage.length) {
		let keys = Object.getOwnPropertyNames(localStorage);
		console.log(keys);
		for (let key in keys) {
			let coord = keys[key];
			let baloon = localStorage.getItem(coord);
			console.log(baloon);

			if (baloon) {
				try {
					baloon = JSON.parse(baloon);
					console.log(baloon);
				}
				catch (err) {
					continue;
				}

				if (!baloon.title) {
					continue;
				}

				for (let comment of baloon.comments) {
					console.log(comment);

					let placemark = addPlacemark(coord, comment);

					map.geoObjects.add(placemark);

					// Добавляем метку в кластер
					clusterer.add(placemark);
				}
			}
		}
	}
}
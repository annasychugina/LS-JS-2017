
import {addPlacemark} from './map';
let tcomment = require('../baloon-map.hbs');

let reviewWindow = document.querySelector('.review');
let reviewTittle = document.getElementById('location');
let reviewBtn = document.querySelector('.review__close');
let reviewList = document.querySelector('.review__list');
let reviewForm = document.querySelector('.form');
let btn = document.querySelector('.review__add');

let nameField = reviewForm.querySelector('.form__input[name=name]');
let placeField = reviewForm.querySelector('.form__input[name=place]');
let messageField = reviewForm.querySelector('.form__review');

var map;
var coords;

require('./styles/map.scss');

new Promise(resolve => ymaps.ready(resolve))
	.then(() => {
		map = new ymaps.Map("map", {
			center: [55.751574, 37.573856],
			zoom: [12]
		});
		map.events.add('click', function(e) {
			coords = e.get('coords');
			console.log(coords);
			createMW(e, coords);
		});
	});


function createMW(e, coords) {
	console.log("hello");
	ymaps.geocode(coords, {})
		.then(res => {
			let title = res.geoObjects.get(0).properties.get('text');
			let posY = e.get('domEvent').get('pageY');
			let posX = e.get('domEvent').get('pageX');
			console.log(title);
			console.log([posY, posX]);
			dialog([posY, posX], coords, title);
		})
}


function dialog(position, coords, title = '') {
	if (reviewWindow.classList.contains('review_show')) {
		reviewWindow.classList.toggle('review');
	}

	reviewTittle.textContent = title;

	if ((innerHeight - position[0]) < reviewWindow.offsetHeight) {
		reviewWindow.style.top = `${0}px`;
	} else {
		reviewWindow.style.top = `${position[0]}px`;
	}

	if ((innerWidth - position[1]) < reviewWindow.offsetWidth) {
		reviewWindow.style.left = `${position[1] - reviewWindow.offsetWidth}px`;
	} else {
		reviewWindow.style.left = `${position[1]}px`;
	}

	reviewWindow.classList.add('review_show');

}

reviewForm.addEventListener('submit', function(e) {
	e.preventDefault();

	var placemark = addPlacemark(coords);
	map.geoObjects.add(placemark);
	nameField.value = '';
});




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

var options = {
	day: 'numeric',
	month: 'numeric',
	year: 'numeric',
	timezone: 'UTC',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
};

var map;
var coords;




new Promise(resolve => ymaps.ready(resolve))
	.then(() => {
		map = new ymaps.Map("map", {
			center: [55.751574, 37.573856],
			zoom: [12]
		});

		map.events.add('click', function(e) {
			coords = e.get('coords');
			createMW(e, coords);
		});

		let customItemContentLayout = ymaps.templateLayoutFactory.createClass(mapCarouselTemplate);

		var clusterer = new ymaps.Clusterer({
			preset: 'islands#invertedVioletClusterIcons',
			clusterBalloonContentLayout: 'cluster#balloonCarousel',
			groupByCoordinates: false,
			clusterHideIconOnBalloonOpen: false,
			clusterBalloonItemContentLayout: customItemContentLayout,
			geoObjectHideIconOnBalloonOpen: false,
			clusterDisableClickZoom: true,
			clusterOpenBalloonOnClick: true,
			gridSize: 50
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

			var placemark = addPlacemark(coordinate.split(','), map, clusterer, comment);

			map.geoObjects.add(placemark );
			clusterer.add(placemark );

			reviewList.innerHTML += tcomment({
				comments: [comment]
			});

			e.target[0].value = '';
			e.target[1].value = '';
			e.target[2].value = '';
		});
});


function createMW(e, coords) {
	ymaps.geocode(coords, {})
		.then(res => {
			let title = res.geoObjects.get(0).properties.get('text');
			let posY = e.get('domEvent').get('pageY');
			let posX = e.get('domEvent').get('pageX');
			dialog([posY, posX], coords, title);
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


function dialog(position, coords, title = '') {
	console.log(position);
	if (reviewWindow.classList.contains('review_show')) {
		reviewWindow.classList.toggle('review');
	}
	reviewList.textContent = '';

	reviewTittle.textContent = title;

	reviewWindow.dataset.coords = coords;


	var pos = position;
	setPosition(pos);

	reviewWindow.classList.add('review_show');


}


mymap.addEventListener('click', function(e) {
	console.log("hello");

});

reviewClose.addEventListener('click', (e) => reviewWindow.classList.toggle('review'));


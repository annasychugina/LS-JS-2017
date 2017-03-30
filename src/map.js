// export default getProvider() {
// 	return {
// 		provider: {
// 			geocode: function(coords, {}) {
// 				return ymaps.geocode(coords, {})
// 					.then(res => {
// 						let title = res.geoObjects.get(0).properties.get('text');
// 						let posY = e.get('domEvent').get('pageY');
// 						let posX = e.get('domEvent').get('pageX');
// 						console.log(title);
// 						console.log([posY, posX]);
// 					})
// 			}
// 		}
// 	}
// }

export function addPlacemark(coords) {

	let place = new ymaps.Placemark(coords, {
		coords: coords
	});

	return place;
}

// function addPlacemark(coords) {
// 	console.log(coords);
//
// 	let place = new ymaps.Placemark(coords, {
// 		coords: coords
// 	});
//
// 	map.geoObjects.add(place);
// }
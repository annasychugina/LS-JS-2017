export function addPlacemark(coords) {
	let place = new ymaps.Placemark(coords, {
		coords: coords
	});

	return place;
}
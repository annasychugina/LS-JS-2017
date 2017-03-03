/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            return resolve();
        }, seconds * 1000)
    })
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */

function loadAndSortTowns() {
    return new Promise((resolve) => {

        fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
            .then(
                response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
            .then(function (data) {
                resolve(data.sort((item1, item2) => {
                    return (item1.name < item2.name) ? -1 : 1;
                }));
            })
    })
}

export {
    delayPromise,
    loadAndSortTowns
};

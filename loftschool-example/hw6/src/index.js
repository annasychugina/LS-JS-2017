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
    let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        // async -false -- запрос сонхронный, true - асинхронный

        xhr.open('GET', url, true);
        xhr.responseType = 'text';

        // открываем соединение, оптравляем запрос
        xhr.send();

        function loadTowns() {
            if (xhr.status == 200) {
                // в объект
                resolve(JSON.parse(xhr.response).sort(sortedTowns));
            } else {
                reject(xhr.status);
            }
        }

        xhr.addEventListener('load', loadTowns);
    });
    /*
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        reject(response.status);
                    } else {
                        resolve(JSON.parse(response).sort(sortedTowns));
                    }
                })
    });
    */
    function sortedTowns(item1, item2) {
        return (item1.name < item2.name) ? -1 : 1;
    }
}

export {
    delayPromise,
    loadAndSortTowns
};

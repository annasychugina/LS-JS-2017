/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching ('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    return Boolean(full.toLowerCase().indexOf(chunk.toLowerCase()) + 1);
}

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */

function createCookie(name, value) {
    document.cookie = `${name}=${value}`;
}

function createCookieTr(name, value) {
    let row = document.createElement('tr');
    let removeButton = document.createElement('button');
    let table = document.getElementById('list-table');

    for (let i = 0; i < table.rows[0].cells.length; i++) {
        let cell = document.createElement('th');

        row.appendChild(cell);
    }
    row.children[0].textContent = name;
    row.children[1].textContent = value;
    row.children[2].appendChild(removeButton);
    removeButton.textContent = 'Удалить';
    removeButton.classList.add('button__remove');
    listTable.appendChild(row);
}

function getCookies() {
    return document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
}

function updateTable(name, value) {
    for (let row of listTable.children) {
        if (row.firstElementChild.innerText === name) {
            let nameCell = row.firstElementChild;

            nameCell.nextElementSibling.textContent = value;
        }
    }
    createCookieTr(name, value);
}

function filterCookies() {
    let value = filterNameInput.value.trim();
    let cookies = getCookies();

    listTable.innerHTML = '';
    for (let key in cookies) {
        if (isMatching(key, value) || isMatching(cookies[key], value)) {
            createCookieTr(key, cookies[key]);
        }
    }
}

function addCookies() {
    let name = addNameInput.value;
    let value = addValueInput.value;
    let cookies = getCookies();

    createCookie(name, value);
    (name in cookies) ? updateTable(name, value) : createCookieTr(name, value);
    filterCookies();
}

function removeCookies(e) {
    if (e.target.className === 'button__remove') {
        let name = e.target.closest('tr').children[0].textContent;
        let row = e.target.closest('tr');

        document.cookie = `${name}=; expires=${new Date(0)}`;
        listTable.removeChild(row);
    }
}

filterNameInput.addEventListener('keyup', filterCookies);
addButton.addEventListener('click', addCookies);
listTable.addEventListener('click', removeCookies);

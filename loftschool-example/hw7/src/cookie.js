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
    if (full.toUpperCase().indexOf(chunk.toUpperCase()) === -1) {

        return false;
    }
    return true;
}

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */

// создание куки
function createCookie(name, value) {
    document.cookie = `${name}=${value}`;
}

// удаление куки
function deleteCookie(name) {
    document.cookie = `${name}=; expires=${new Date(0)}`;
}

// создание куки в таблице
function createCookieTr(name, value) {
    document.cookie = `${name}=${value}`;
    // строка
    let row = document.createElement('tr');
    // кнопка удаления
    let removeButton = document.createElement('button');
    // получаем табличку
    let table = document.getElementById('list-table');

    // от нуля до последнего элемента таблицы
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        // создаем ячейку
        let cell = document.createElement('th');
        // вставляем ячейку в строку
        row.appendChild(cell);
    }
    // name
    row.children[0].textContent = name;
    // value
    row.children[1].textContent = value;
    // removeButton
    row.children[2].appendChild(removeButton);
    removeButton.textContent = 'Удалить';
    removeButton.classList.add("button__remove");
    // вставляем строку в табличу
    listTable.appendChild(row);
}

// получение куки
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


// поиск куки
function findCookie(name) {
    for (let row of listTable.children) {
        if (row.firstElementChild.innerText === name) {
            return row.firstElementChild;
        }
    }

    return null;

}

// фильтрация куки



// добавление в таблицу куки
function updateTable(name, value) {
    let nameCell = findCookie(name);

    if (nameCell) {
        nameCell.nextElementSibling.textContent = value;
    } else {
        createCookieTr(name, value);
    }

}



function deleteCookieTr(nameTd) {
    let tr = nameTd.closest('tr');

    deleteCookie(nameTd.innerText);
    listTable.removeChild(tr);
}




// filterNameInput.addEventListener('keyup');

addButton.addEventListener('click', () => {
    let name = addNameInput.value;
    let value = addValueInput.value;
    let cookies = getCookies();

    createCookie(name, value);

    if (name in cookies) {
        updateTable(name, value)
    } else {
        createCookieTr(name, value);
    }

});

// удаление куки
listTable.addEventListener('click', (e) => {
   if (e.target.className === 'button__remove') {
       let name = e.target.closest('tr').children[0].textContent;
       let row = e.target.closest('tr');

       deleteCookie(name);
       deleteCookieTr(row);
   }
}


);

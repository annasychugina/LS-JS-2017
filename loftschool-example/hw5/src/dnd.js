/* ДЗ 5.2 - Div D&D */

/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом фона и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
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

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    let div = document.createElement('div');

    div.classList.add('draggable-div');
    div.style.position = 'absolute';

    // функция для генерации случайной величины между min и max
    function randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);

        rand = Math.round(rand);

        return rand;
    }

    // ширина и высота экрана
    let width = window.innerWidth;
    let height = window.innerHeight

    // ширина и высота блока
    let widthDiv = randomInteger(15, 0.8 * width);
    let heightDiv = randomInteger(10, 0.8 * height);

    div.style.width = `${widthDiv}px`;
    div.style.height = `${heightDiv}px`;

    // цвет блока
    let colorDiv = [randomInteger(0, 255), randomInteger(0, 255), randomInteger(0, 255)];

    div.style.background = `rgb(${colorDiv})`;

    // позиция блока
    let topDiv = randomInteger(2, 20);
    let leftDiv = randomInteger(2, 20);

    div.style.top = `${topDiv}px`;
    div.style.left = `${leftDiv}px`;
    div.style.position = 'absolute';
    div.style.cursor = 'move';

    div.setAttribute('draggable', 'true');

    return div;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    function dragElement(e) {
        // возвращаем размер элемента и его позицию относительно окна
        let rectObject = e.target.getBoundingClientRect();
        let shiftX = e.pageX - rectObject.left;
        let shiftY = e.pageY - rectObject.top;
        let curDiv = e.target;

        document.onmousedown = function(e) {
            if (e.which != 1) {
                return;
            }
            let elem = e.target.closest('.draggable');

            if (!elem) {
                return;
            }
        };

        document.onmousemove = function(e) {
            let newDivLeft = e.pageX - shiftX;
            let newDivTop = e.pageY - shiftY;

            curDiv.style.left = `${newDivLeft}px`;
            curDiv.style.top = `${newDivTop}px`;
        };

        document.onmouseup = function() {
            // очистить обработчики, т.к перенос закончен
            document.onmousedown = null;
            document.onmousemove = null;
            curDiv.onmouseup = null;
        };
    }
    target.addEventListener('mousedown', dragElement);

}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};

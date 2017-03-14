require('./styles/myfriend.css');

let filterFrom = document.querySelector('#loaded');
let selectedFriends = document.querySelector('#added');


let leftSearch = document.getElementById('leftSearch');
let rightSearch = document.getElementById('rightSearch');

let addedFriends =  document.getElementById('added');
let loadedFriends = document.getElementById('loaded');

let headerBottom = document.querySelector('.friends-container__search');

var friendTemplate = require('../friend-template.hbs');

var friendsArray = [];
var newList = [];
var filteredFriends = [];

let saveButton = document.getElementById('save');


/**
 * Подключение к VK API
 */

function login() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 5918600
        });
        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

/**
 * Обращение к VK API
 */

function callAPI(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, (result) => {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    })
}

/**
 * Создаем новый элемент списка
 *
 * @param  {friend} friends - загруженные друзья
 * @return {templateFn} Шаблон Handlebars
 */

function createFriendsDiv(friends) {
    let templateFn = require('../friend-template.hbs');
    let sortFriends = friends.sort(sortedFriendsById);

    return templateFn({
        friends: sortFriends
    });
}

/**
 * Сортировка друзей по id
 */

function sortedFriendsById(item1, item2) {
    return (item1.id > item2.id) ? 1 : -1;
}



/**
 * Добавление друга в правую колонку по нажатию на кнопку
 */

function loadFriends(event) {
    let friend;

    if (event.target.classList.contains('friend__add')) {
        friend = event.target.closest('.friend');
        friend.remove();
        selectedFriends.insertBefore(friend, selectedFriends.firstElementChild);
    }
}


/**
 * Добавление друга в левую колонку по нажатию на кнопку
 */

function moveBackFriends(event) {
    if (event.target.classList.contains('friend__add')) {
        let friend = event.target.closest('.friend');
        friend.remove();
        filterFrom.insertBefore(friend, filterFrom.firstElementChild);
    }
}



filterFrom.addEventListener('click', loadFriends);
selectedFriends.addEventListener('click', moveBackFriends);



function isMatching(full,chunk) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) != -1) {
        return true;
    }
}


/**
 * Сохранение в localstorage при нажатии на кнопку
 */

function saveList() {
    alert('Сохранено');
    filteredFriends = [];
    newList.forEach(item => {
        filteredFriends.push(item.id);
    });
    // сериализация и запись в localstorage
    localStorage.filteredFriends = JSON.stringify(filteredFriends);
}


saveButton.addEventListener('click', () => {
    saveList();
});






login()
    .then(() => callAPI('friends.get', { v: 5.62, fields: ['photo_100'] }))
    .then(result => filterFrom.innerHTML = createFriendsDiv(result.items))
    .catch( (e) => console.error(e) );







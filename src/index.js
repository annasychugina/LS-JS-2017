'use strict';

require('./styles/main.scss');

let templateLoaded = require('../friend-template.hbs');
let templateAdded = require('../friend-added.hbs');

let loadedFriends = document.getElementById('loaded');
let addedFriends = document.getElementById('added');
let saveButton = document.getElementById('save');
let content = document.getElementById('content');
let searchInputLeft = document.getElementById('leftSearch');
let searchInputRight = document.getElementById('rightSearch');

let filteredFriends = [];
let addedFriendsArray = [];
let loadedFriendsArray = [];


/**
 * @description Подключение к VK API.
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
 * @description Обращение к VK API.
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
 * @description Сохранение данных в localStorage
 */
function saveList() {
    filteredFriends = [];
    addedFriendsArray.forEach(item => {
        filteredFriends.push(item.id);
    });

    if ('localStorage' in window && window['localStorage'] !== null)  {
        localStorage.filteredFriends = JSON.stringify(filteredFriends);
        alert("Сохранено!");
    } else {
        alert("Сохранение невозможно. Браузер не поддерживает localstorage")
    }
}

saveButton.addEventListener('click', saveList);

/** @description Поиск друга по id.
 * @param {number} id пользователя.
 * @return {object} список загруженных из VK пользователей
 */
function findById(id) {
    for (let i = 0; i < loadedFriendsArray.length; i++) {
        for (let prop in loadedFriendsArray[i]) {
            if (loadedFriendsArray[i][prop] === id) {

                return loadedFriendsArray[i];
            }
        }
    }
}

/**
 * @description Меняет местами друзей в списках
 */
function swapFriends(e) {
    if (e.target.className === 'friend__add') {
        loadedFriendsArray.forEach((item, idx)=>{
            if (item['id'] == e.target.parentNode.dataset.id) {
                addedFriendsArray.push(item);
                loadedFriendsArray.splice(idx, 1);
            }
        });
    }

    if (e.target.className === 'friend__close') {
        addedFriendsArray.forEach((item, idx)=>{
            if (item['id'] == e.target.parentNode.dataset.id) {
                loadedFriendsArray.push(item);
                addedFriendsArray.splice(idx, 1);
            }
        });

    }

    loadedFriends.innerHTML = templateLoaded({
        loaded: loadedFriendsArray
    });

    addedFriends.innerHTML = templateAdded({
        added: addedFriendsArray
    });

}

loadedFriends.addEventListener('click', swapFriends);
addedFriends.addEventListener('click', swapFriends);

/**
 * @description Выгрузка данных из localstorage на страницу
 */

function loadFriends() {
    if (localStorage.filteredFriends) {
        filteredFriends = JSON.parse(localStorage.filteredFriends);
        filteredFriends.forEach((id) =>{
            addedFriendsArray.push(findById(id));

            for (let i = 0; i < loadedFriendsArray.length; i++) {
                for (let prop in loadedFriendsArray[i]) {
                    if (loadedFriendsArray[i][prop] === id) {
                        loadedFriendsArray.splice(i, 1);
                    }
                }
            }

        });
    }

    loadedFriends.innerHTML = templateLoaded({
        loaded: loadedFriendsArray
    });

    addedFriends.innerHTML = templateAdded({
        added: addedFriendsArray
    });
}

let dragFriend;
let dropList;

/**
 * @description Реализация drag-n-drop
 */

function friendDragStart(e) {
    if (!(e.target instanceof Element)) {
        return;
    }

    if (e.target.closest('.friend')) {
        e.dataTransfer.setData('text', e.target.closest('.friend').dataset.id);
    }

    e.target.style.cursor = 'move';

    if (e.target.className === 'friend') {
        dragFriend = e.target;
    }

}

function friendDragOver(e) {
    e.preventDefault();
    if (e.target.className === 'friends-container__list') {
        dropList = e.target;
    }
}

function friendDrop(e) {
    e.preventDefault();
    if (dragFriend.parentNode.id === 'loaded') {
        loadedFriendsArray.forEach((item, idx) => {
            if (item['id'] == dragFriend.dataset.id) {
                addedFriendsArray.push(item);
                loadedFriendsArray.splice(idx, 1);

                return;
            }
        });

    } else if (dropList.id === 'loaded') {

        addedFriendsArray.forEach((item, idx) => {
            if (item['id'] == dragFriend.dataset.id) {
                loadedFriendsArray.push(item);
                addedFriendsArray.splice(idx, 1);

                return;
            }
        });
    }

    loadedFriends.innerHTML = templateLoaded({
        loaded: loadedFriendsArray
    });

    addedFriends.innerHTML = templateAdded({
        added: addedFriendsArray
    });

}

content.addEventListener('dragstart', friendDragStart);
content.addEventListener('dragover', friendDragOver);
content.addEventListener('drop', friendDrop);

/** @description Поиск совпадений в строке.
 * @param {string} full - имена друзей
 * @param {string} chunk - введеное значение в поле input
 * @return {boolean}
 */
function isMatching(full, chunk) {
    return Boolean(full.toLowerCase().indexOf(chunk.toLowerCase()) + 1);
}

/** @description Фильтрация.
 * @param {object} search - значение поля input для поиска
 * @param {object} arrayFriends - список друзей
 */
function filterFriend(search, arrayFriends) {
    let value = search.value.trim();

    [...arrayFriends.querySelectorAll('.friend')].forEach(function(friend) {
        let friendName = friend.querySelector('.friend__name').innerText;

        (isMatching(friendName, value)) ? friend.style.display = 'flex' : friend.style.display = 'none';
    })
}

searchInputLeft.addEventListener('keyup', (e) => {
    filterFriend(searchInputLeft, loadedFriends);
});

searchInputRight.addEventListener('keyup', (e) => {
    filterFriend(searchInputRight, addedFriends);
});

function restartList() {
    login()
        .then(() => callAPI('friends.get', {
            v: 5.62, fields: ['photo_100']
        }))
        .then(result => {
            loadedFriendsArray = result.items;
        })
        .then(() => loadFriends())
        .catch(() => {
            throw new Error('connection error');
        });
}

restartList();
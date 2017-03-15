'use strict';
require('./styles/myfriend.css');
let templateLoaded = require('../friend-template.hbs');
let templateAdded = require('../friend-added.hbs');

let loadedFriends = document.getElementById('loaded');
let addedFriends = document.getElementById('added');
let saveButton = document.getElementById('save');
let leftSearch = document.getElementById('leftSearch');
let rightSearch = document.getElementById('rightSearch');

let filteredFriends = [];
let addedFriendsArray = [];
let loadedFriendsArray = [];

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
 * Сохранение данных в localstorage
 */

function saveList() {
    filteredFriends = [];
    addedFriendsArray.forEach(item => {
        filteredFriends.push(item.id);
    });
    localStorage.filteredFriends = JSON.stringify(filteredFriends);
}


saveButton.addEventListener('click', saveList);


function findById(id) {
    for (let i = 0; i < loadedFriendsArray.length; i++){
        for (let prop in loadedFriendsArray[i]) {
            if (loadedFriendsArray[i][prop] === id) {
                return loadedFriendsArray[i];
            }
        }
    }
}


function removeById(id) {
    for (let i = 0; i < loadedFriendsArray.length; i++){
        for (let prop in loadedFriendsArray[i]) {
            if (loadedFriendsArray[i][prop] === id) {
                loadedFriendsArray.splice(i,1);
            }
        }
    }
}

function isMatching(full, chunk) {
        return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1;
}


/**
 * Функция меняет местами друзей в списках
 */

function swapFriends(e) {
    if (e.target.className === 'friend__add') {
        loadedFriendsArray.forEach((item, idx)=>{
            if(item['id'] == e.target.parentNode.dataset.id){
                addedFriendsArray.push(item);
                loadedFriendsArray.splice(idx, 1);
            }
        });
    }

    if (e.target.className === 'friend__close') {
        addedFriendsArray.forEach((item, idx)=>{
            if(item['id'] == e.target.parentNode.dataset.id){
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
 * Выгрузка данных из localstorage на страницу
 */

function loadFriends() {
    if (localStorage.filteredFriends) {
        filteredFriends = JSON.parse(localStorage.filteredFriends);
        filteredFriends.forEach((id) =>{
            addedFriendsArray.push(findById(id));
            removeById(id);
        });
    }


    loadedFriends.innerHTML = templateLoaded({
        loaded: loadedFriendsArray
    });

    addedFriends.innerHTML = templateAdded({
        added: addedFriendsArray
    });
}


/**
 * Загрузка списков при перезагрузке
 */

function restartList() {
    login()
        .then(() => callAPI('friends.get', { v: 5.62, fields: ['photo_100'] }))
        .then(result => {
            loadedFriendsArray = result.items;
        })
        .then(() => loadFriends())
        .catch(() => {
            throw new Error('connection error');
        });
}

restartList();








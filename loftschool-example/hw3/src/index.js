/* ДЗ 3 - объекты и массивы */
/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */

'use strict';

function forEach(array, fn) {

    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    let newArray = [];

    for (let i = 0; i < array.length; i++) {
        newArray.push(fn(array[i], i, array));
    }

    return newArray;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */

function reduce(array, fn, initial) {

    let start = 1;
    let length = array.length;
    let result = array[0];

    if (initial) {
        result = initial;
        start--;
    }
    for (let i = start; i < length; i++) {
        result = fn(result, array[i], i, array);
    }

    return result;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    let arr = Object.keys(obj);
    let length = arr.length;

    for (let i = 0; i < length; i++) {
        if (arr[i] === prop) {
            delete obj[prop];
        }
    }

}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    let arr = Object.keys(obj);
    let length = arr.length;

    for (let i = 0; i < length; i++) {
        if (arr[i] === prop) {
            return true;
        }
    }

    return false;
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    let array = [];

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            array.push(prop);
        }
    }

    return array;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    let arr = Object.keys(obj);
    let length = arr.length;

    for (let i = 0; i < length; i++) {
        arr[i] = arr[i].toUpperCase();
    }

    return arr;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to = array.length) {
    var result = [];

    // from = (typeof from === 'undefined' || from < -array.length) ? 0 : from;
    // from = (from < 0) ? array.length + from : from;

    if (!from || from < -array.length) {
        from = 0;
    }

    if (from < 0) {
        from = array.length + from;
    }

    if (to > array.length) {
        to = array.length;
    }

    if (to < 0) {
        to = to + array.length;
    }

    for (let i = from; i < to; i++) {
        result.push(array[i]);
    }

    return result;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    let proxy = new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value * value;
            // Метод set должен вернуть true, если присвоение успешно обработано и false в случае ошибки

            return true;
        }
    });

    return proxy;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};

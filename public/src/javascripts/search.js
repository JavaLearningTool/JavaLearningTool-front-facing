'use strict';

import axios from 'axios';
import categories from './categoryHandler';

window.runSearch = function() {
    let name = document.getElementById('name').value;
    let difficulty = document.getElementById('difficulty').value;

    let empty = true;
    let queryString = "?criteria=anything";

    if (name !== "") {
        empty = false;
        queryString = '?name=' + name;
    }

    if (difficulty !== '0') {
        if (empty === false) {
            queryString += '&';
        } else {
            queryString = '?';
            empty = false;
        }

        queryString += 'difficulty=' + difficulty;
    }

    if (categories.length !== 0) {
        if (empty === false) {
            queryString += '&';
        } else {
            empty = false;
            queryString = '?';
        }

        queryString += 'categories=' + JSON.stringify(categories);
    }

    window.location.href = encodeURI('/search' + queryString);
}
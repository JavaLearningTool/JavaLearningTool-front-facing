'use strict';

import axios from 'axios';

window.addCategory = function() {
    window.location.href = '/admin/new_category';
}

window.putCategory = function() {
    let catName = document.getElementById('name').value;
    console.log(catName);
    axios.put('/admin/category', {category: catName})
    .then(function (res) {
        window.location.href = "/admin";
    }).catch(function (err) {
        console.log(err);
    });
}

window.addChallenge = function() {
    window.location.href = '/admin/new_challenge';
}

let categories = [];
if (window.categories) {
    categories = window.categories.split(" ");
    console.log(categories);
}

window.putChallenge = function() {
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let difficulty = document.getElementById('difficulty').value;
    let defaultText = document.codeMirror.getValue();
    let testFile = document.getElementById('test_file').value;

    console.log(name, description, difficulty, defaultText, testFile);

    axios.put('/admin/challenge', {name, description, categories, difficulty,
        defaultText, testFile})
    .then(function (res) {
        window.location.href = "/admin";
    }).catch(function (err) {
        console.log(err);
    });
}

window.categoryClick = function(id, butt) {
    console.log(id);

    if (categories.includes(id)) { // button already clicked
        categories.splice(categories.indexOf(id), 1);
        butt.className = butt.className.replace(/pure-button-active/, '');
        console.log("Kill");
    } else { // button not already clicked
        categories.push(id);
        butt.className += ' pure-button-active';
    }
}

window.removeCategory = function(id) {
    console.log(id);
    axios.delete('/admin/category/' + id)
    .then(function (res) {
        window.location.reload();
    }).catch(function (err) {
        console.log(err);
    });
}
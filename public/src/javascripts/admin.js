'use strict';

import axios from 'axios';

window.addCategory = function() {
    axios.put('/admin/category', {category: 'Flow control'})
    .then(function (res) {
        location.reload();
    }).catch(function (err) {
        console.log(err);
    });
}

window.removeCategory = function(id) {
    console.log(id);
    /*axios.delete('/admin/category', {category: 'Flow control'})
    .then(function (res) {
        location.reload();
    }).catch(function (err) {
        console.log(err);
    });*/
}
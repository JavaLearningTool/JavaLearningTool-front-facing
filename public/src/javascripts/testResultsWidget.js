'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import TestResults from './Components/TestResults';

let component = ReactDOM.render(
    <TestResults display={false}/>
    ,
    document.getElementById('test_results')
);

function compileCode() {
    let code = document.codeMirror.getValue();
    console.log("SRC Code: " + code);
    component.componentWillReceiveProps({display: true, resultState: {compiling: true, error: false}});
    console.log(window.challengePath);
    axios.post('/compile', {code, challenge: window.challengePath})
    .then(function (res) {
        if (res.data.error) {
            console.log("Received error from compiler"); 
            component.componentWillReceiveProps({display: true, resultState: {error: res.data.error}});  
        } else {
            console.log("Received result from compiler");
            component.componentWillReceiveProps({display: true, resultState: {compiling: false, error: false, data: res.data}});            
        }
    }).catch(function (err) {
        component.componentWillReceiveProps({display: true, resultState: {compiling: false, error: "The request failed. Try again later."}});
        console.log(err);
    });
}

window.compileCode = compileCode;
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

    if (window.codeCompilationStarted) {
        window.codeCompilationStarted();
    }
 
    let code = document.codeMirror.getValue();
    component.componentWillReceiveProps({display: true, resultState: {compiling: true, error: false}});
    axios.post('/compile', {code, challenge: window.challengePath, className: window.className})
    .then(function (res) {
        if (res.data.error) {
            component.componentWillReceiveProps({display: true, resultState: {error: res.data.error}});
        } else {
            component.componentWillReceiveProps({display: true, resultState: {compiling: false, error: false, data: res.data}});            
        }
        if (window.codeCompilationEnded) {
          window.codeCompilationEnded();
        }
    }).catch(function (err) {
        if (window.codeCompilationEnded) {
          window.codeCompilationEnded();
        }
        component.componentWillReceiveProps({display: true, resultState: {compiling: false, error: "The request failed. Try again later."}});
    });
}

window.compileCode = compileCode;
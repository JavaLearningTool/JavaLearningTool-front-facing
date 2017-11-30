import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import TestResults from './Components/TestResults';

ReactDOM.render(
    <TestResults />
    ,
    document.getElementById('test_results')
);

function compileCode() {
    let code = document.getElementById("code_area").value;
    console.log(code);
    axios.post('/compile', {
        params: {
            code
        }
    }).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        console.log(err);
    });
}

window.compileCode = compileCode;
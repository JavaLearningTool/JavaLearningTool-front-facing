'use strict';

import * as Cookies from 'js-cookie';
import { setInterval } from 'timers';

let shouldSave = false;
let codeMirror;
let changeSpan;

window.onload = function() {
    changeSpan = document.getElementsByClassName('saving')[0];

    setInterval(() => {
        if (shouldSave) {
            Cookies.set(window.challengePath + "_save", codeMirror.getValue());
            shouldSave = false;
            changeSpan.innerHTML = 'Changes saved';
        }
    }, 1500);

    if (window.readOnlyLines) {

        // listen for the beforeChange event, test the changed line number, and cancel
        document.codeMirror.on('beforeChange',function(cm, change) {
            if (window.readOnlyLines.indexOf(change.from.line) >= 0) {
                change.cancel();
            }
        });

    }

    document.codeMirror.on('change', (cm) => {
        codeMirror = cm;
        shouldSave = true;
    
        changeSpan.innerHTML = 'Saving ...';
    });
}

window.onCodeMirrorLoad = (cm) => {
    let savedText = Cookies.get(window.challengePath + '_save', {expires: 100});
    if (savedText) {
        cm.getDoc().setValue(savedText);
    }
}

let compileButton;

window.codeCompilationStarted = () => {
    console.log("Compile started");
    if (compileButton === undefined) {
        compileButton = document.getElementById("compile-button");
    }

    compileButton.className += " pure-button-disabled";
};

window.window.codeCompilationEnded = () => {
    console.log("Compile ended");

    compileButton.className = compileButton.className
        .replace(/(?:^|\s)pure-button-disabled(?!\S)/g, "");
};

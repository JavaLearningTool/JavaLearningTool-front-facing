"use strict";

import { setInterval } from "timers";

let shouldSave = false;
let changeSpan;

function store(path, value) {
    if (window.localStorage) {
        window.localStorage.setItem(path, value);
        return true;
    } else {
        return false;
    }
}

function load(path) {
    if (window.localStorage) {
        return window.localStorage.getItem(path);
    }
}

window.onload = function() {
    changeSpan = document.getElementsByClassName("saving")[0];
};

window.onCodeMirrorLoad = () => {
    // Loads saved code into CodeMirror
    let savedText = load(window.challengePath + "_save");
    if (savedText) {
        document.codeMirror.getDoc().setValue(savedText);
    }

    // Periodically saves code in CodeMirror
    setInterval(() => {
        if (shouldSave) {
            if (!store(window.challengePath + "_save", document.codeMirror.getValue())) {
                changeSpan.innerHTML = "Saving not supported in this browser.";
            } else {
                shouldSave = false;
                changeSpan.innerHTML = "Changes saved";
            }
        }
    }, 1500);

    if (window.readOnlyLines) {
        // listen for the beforeChange event, test the changed line number, and cancel
        document.codeMirror.on("beforeChange", function(cm, change) {
            if (window.readOnlyLines.indexOf(change.from.line) >= 0) {
                change.cancel();
            }
        });
    }

    // Take note when a change has happened
    document.codeMirror.on("change", cm => {
        shouldSave = true;
        changeSpan.innerHTML = "Saving ...";
    });
};

let compileButton;

window.codeCompilationStarted = () => {
    if (compileButton === undefined) {
        compileButton = document.getElementById("compile-button");
    }

    compileButton.className += " pure-button-disabled";
};

window.window.codeCompilationEnded = () => {
    compileButton.className = compileButton.className.replace(
        /(?:^|\s)pure-button-disabled(?!\S)/g,
        ""
    );
};

window.resetText = () => {
    document.codeMirror.getDoc().setValue(window.challengeDefaultText);
};

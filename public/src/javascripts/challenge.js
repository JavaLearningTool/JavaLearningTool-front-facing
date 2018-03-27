"use strict";

import { setInterval } from "timers";

let shouldSave = false;
let codeMirror;
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

    setInterval(() => {
        if (shouldSave) {
            if (!store(window.challengePath + "_save", codeMirror.getValue())) {
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

    document.codeMirror.on("change", cm => {
        codeMirror = cm;
        shouldSave = true;

        changeSpan.innerHTML = "Saving ...";
    });
};

window.onCodeMirrorLoad = cm => {
    let savedText = load(window.challengePath + "_save");
    if (savedText) {
        cm.getDoc().setValue(savedText);
    }
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

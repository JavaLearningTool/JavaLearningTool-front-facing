"use strict";
import React from "react";
import ReactDOM from "react-dom";

import CodeEditor from "./Components/CodeEditor";

// If we need an editor, render it here
const editorDiv = document.getElementsByClassName("codeEditor")[0];

if (editorDiv) {
    let component = ReactDOM.render(
        <CodeEditor allowNewFiles={true} classes={window.classes} />,
        editorDiv
    );
    component.setupCodeMirror();
}

let compileButton;

// Called when compilation has started. Hide compile button
window.codeCompilationStarted = () => {
    if (compileButton === undefined) {
        compileButton = document.getElementById("compile-button");
    }

    compileButton.className += " pure-button-disabled";
};

// Called when compilation is done. Show compile button
window.codeCompilationEnded = () => {
    compileButton.className = compileButton.className.replace(
        /(?:^|\s)pure-button-disabled(?!\S)/g,
        ""
    );
};

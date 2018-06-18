"use strict";
import React from "react";
import ReactDOM from "react-dom";

import CodeEditor from "./Components/CodeEditor";
import TestResults from "./Components/TestResults";

import axios from "axios";

// If we need an editor, render it here
const editorDiv = document.getElementsByClassName("codeEditor")[0];
let editor;
let resultsComponent;

if (editorDiv) {
    // Creates editor component
    editor = ReactDOM.render(
        <CodeEditor
            challengePath={window.challengePath}
            classes={window.classes}
            handleSaving={true}
        />,
        editorDiv
    );
    // After creating the component tell it to setup the codeMirror
    editor.setupCodeMirror();

    // Sets up the test results component
    resultsComponent = ReactDOM.render(
        <TestResults display={false} />,
        document.getElementById("test_results")
    );
}

let compileButton;

/**
 * When the compile button is pressed
 */
function compileCode() {
    // Disables the compile button
    disableCompileButton();

    // Get the classes from the editor
    let classes = [];
    editor.getClasses().forEach(element => {
        classes.push({ name: element.name, code: element.doc.getValue() });
    });

    resultsComponent.componentWillReceiveProps({
        display: true,
        resultState: { compiling: true, error: false }
    });
    axios
        .post("/compile", {
            challenge: editor.getChallengePath(),
            classes
        })
        .then(function(res) {
            if (res.data.error) {
                resultsComponent.componentWillReceiveProps({
                    display: true,
                    resultState: { error: res.data.error }
                });
            } else {
                resultsComponent.componentWillReceiveProps({
                    display: true,
                    resultState: {
                        compiling: false,
                        error: false,
                        data: res.data
                    }
                });
            }
            enableCompileButton();
        })
        .catch(function(err) {
            enableCompileButton();
            resultsComponent.componentWillReceiveProps({
                display: true,
                resultState: {
                    compiling: false,
                    error: "The request failed. Try again later."
                }
            });
        });
}

window.compileCode = compileCode;

// Called when compilation has started. Hide compile button
function disableCompileButton() {
    if (compileButton === undefined) {
        compileButton = document.getElementById("compile-button");
    }

    compileButton.className += " pure-button-disabled";
}

// Called when compilation is done. Show compile button
function enableCompileButton() {
    compileButton.className = compileButton.className.replace(
        /(?:^|\s)pure-button-disabled(?!\S)/g,
        ""
    );
}

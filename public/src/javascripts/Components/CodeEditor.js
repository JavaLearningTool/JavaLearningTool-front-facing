"use strict";

import React from "react";
import CodeEditorController from "../codeEditorController";

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.editor = new CodeEditorController(this.props.challengePath, this.props.classes, {
            handleSaving: props.handleSaving
        });
    }

    /**
     * React calls this to render the element
     */
    render() {
        // Holds all of the contents of the file nav
        let fileNavContents = [];

        // Add all of the classes to the file nav
        this.state.editor.classes.forEach((cls, index) => {
            fileNavContents.push(this.renderClassTab(cls, index));
        });

        // Only if we allow creating new classes
        if (this.props.allowNewClasses) {
            if (this.state.namingNewClass) {
                // Adds input for name of class if naming a new class
                fileNavContents.push(
                    <div key="name-class" className="new-class-namer">
                        <input type="text" id="classNameDiv" placeholder="class name" />
                        <div
                            className="pure-button pure-button-primary create-class-button"
                            onClick={this.createClass.bind(this)}
                        >
                            Create
                        </div>
                    </div>
                );
            } else {
                // Puts an add button in the file nav to add new classes
                fileNavContents.push(
                    <div
                        className="pure-button pure-button-primary plus-button"
                        key="add-class"
                        onClick={this.promptClassName.bind(this)}
                    >
                        +
                    </div>
                );
            }
        }

        // Create a label for broadcasting that changes are saved
        let savedLabel;
        if (this.state.editor.handleSaving) {
            savedLabel = <span className="saving">"No changes made"</span>;
        }

        return (
            <div>
                <div className="codeEditorHeader flex-container">
                    <div className="leftSide">
                        <div className="fileNav">{fileNavContents}</div>
                        {savedLabel}
                    </div>
                    <div
                        id="resetTextButton"
                        className="pure-button button-success"
                        onClick={this.state.editor.resetText.bind(this.state.editor)}
                    >
                        "Reset to default"
                    </div>
                </div>
                <textarea id="code_area" name="code" col="30" rows="10" />
            </div>
        );
    }

    /**
     * Tells the CodeMirrorController to setup the CodeMirror
     */
    setupCodeMirror() {
        this.state.editor.loadCodeMirror();
    }

    /**
     * Adds a new class
     */
    createClass() {
        let name = document.getElementById("classNameDiv").value;
        this.state.editor.createNewClass(name);
        this.setState({
            editor: this.state.editor,
            namingNewClass: false
        });
    }

    /**
     * Deletes a class
     *
     * @param {Number} index index of the class to delete
     * @param {object} event The click event
     */
    deleteClass(index, event) {
        event.stopPropagation();
        this.state.editor.deleteClass(index);

        this.setState({
            editor: this.state.editor
        });
    }

    /**
     * Changes the file nav to show an input to for the name of the new class
     */
    promptClassName() {
        this.setState({ namingNewClass: true });
    }

    /**
     * Switches which class is currently being edited and shown
     *
     * @param {Number} index the index of the class to show
     */
    selectClass(index) {
        this.state.editor.showClass(index);
        this.setState({ editor: this.state.editor });
    }

    /**
     * Returns all of the classes this CodeEditor has
     */
    getClasses() {
        return this.state.editor.classes;
    }

    /**
     * Returns the challenge path
     */
    getChallengePath() {
        return this.state.editor.challengePath;
    }

    // ========================================================================
    // Renderers
    // ========================================================================

    /**
     * Renders the tab for a class in the file nav
     *
     * @param {object} cls the class to render
     * @param {Number} index which index this class is
     */
    renderClassTab(cls, index) {
        let destroyButton;
        if (this.props.allowNewClasses) {
            destroyButton = (
                <span className="destroy-class" onClick={this.deleteClass.bind(this, index)}>
                    x
                </span>
            );
        }

        let selectedClass = this.state.editor.classIndex === index ? "selected" : "";

        return (
            <div
                className={"classTab " + selectedClass}
                key={index}
                onClick={this.selectClass.bind(this, index)}
            >
                {cls.name}
                {destroyButton}
            </div>
        );
    }
}

export default CodeEditor;

"use strict";

import React from "react";
import CodeEditorController from "../codeEditorController";

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.editor = new CodeEditorController("", this.props.classes, {
            handleSaving: props.handleSaving
        });
    }

    render() {
        let fileNavContents = [];

        // Add all of the classes to the file nav
        this.state.editor.classes.forEach((cls, index) => {
            fileNavContents.push(this.renderClassTab(cls, index));
        });

        // Only if we allow creating new classes
        if (this.props.allowNewClasses) {
            // Naming the new class after pressing add
            if (this.state.namingNewClass) {
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
                // Add button
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

    setupCodeMirror() {
        this.state.editor.loadCodeMirror();
    }

    createClass() {
        let name = document.getElementById("classNameDiv").value;
        this.state.editor.createNewClass(name);
        this.setState({
            editor: this.state.editor,
            namingNewClass: false
        });
    }

    deleteClass(index, event) {
        event.stopPropagation();
        this.state.editor.deleteClass(index);

        this.setState({
            editor: this.state.editor
        });
    }

    promptClassName() {
        this.setState({ namingNewClass: true });
    }

    selectClass(index) {
        this.state.editor.showClass(index);
        this.setState({ editor: this.state.editor });
    }

    getClasses() {
        return this.state.editor.classes;
    }

    // ========================================================================
    // Renderers
    // ========================================================================

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

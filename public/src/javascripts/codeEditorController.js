"use strict";
import { setInterval } from "timers";

export class CodeEditorController {
    /**
     * Constructs the CodeEditorController
     *
     * @param {object} codeMirror The instance of CodeMirror
     *  {
     *      name: String
     *      defaultText: String
     *  }
     * @param {object} classes The classes being edited
     * @param {object} options Options for the controller
     * {
     *     handleSaving: String defaults true
     * }
     */
    constructor(challengePath, classes, options) {
        this.classes = classes;
        this.classIndex = 0;

        this.challengePath = challengePath;

        this.handleSaving = options.handleSaving === undefined ? true : false;
        if (this.handleSaving) {
            this.shouldSave = false;
            this.changeSpan = document.getElementsByClassName("saving")[0];
        }
    }

    loadCodeMirror() {
        this.codeMirror = CodeMirror.fromTextArea(document.getElementById("code_area"), {
            lineNumbers: true,
            mode: "text/x-java",
            matchBrackets: true,
            indentWithTabs: false,
            indentUnit: 4,
            tabSize: 4,
            tabMode: "spaces",
            smartIndent: true,
            autofocus: true,
            matchBrackets: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        if (window.codeMirrorLoad) {
            window.onCodeMirrorLoad();
        }

        // Take note when a change has happened
        if (this.handleSaving) {
            this.codeMirror.on("change", cm => {
                this.shouldSave = true;
                this.changeSpan.innerHTML = "Saving ...";
            });

            // Periodically saves code in CodeMirror
            setInterval(() => {
                if (this.shouldSave) {
                    if (!this.store()) {
                        this.changeSpan.innerHTML = "Saving not supported in this browser.";
                    } else {
                        this.shouldSave = false;
                        this.changeSpan.innerHTML = "Changes saved";
                    }
                }
            }, 1500);
        }

        // Handle read only lines
        if (window.readOnlyLines) {
            // listen for the beforeChange event, test the changed line number, and cancel
            this.codeMirror.on("beforeChange", function(cm, change) {
                if (window.readOnlyLines.indexOf(change.from.line) >= 0) {
                    change.cancel();
                }
            });
        }

        if (this.classes && this.classes[0]) {
            // Initialize docs
            this.classes[0].doc = this.codeMirror.getDoc();
            this.classes[0].doc.setValue(this.classes[0].defaultText);
            for (let i = 1; i < this.classes.length; i++) {
                this.createNewClassDoc(classes[i]);
            }

            console.log("Beg");
            // Show the initial class
            this.showClass(0);
        }
    }

    createNewClass(name) {
        let newClass = { name, defaultText: "" };
        this.classes.push(newClass);

        this.createNewClassDoc(newClass);
        console.log("new");
        this.showClass(this.classes.length - 1);
    }

    createNewClassDoc(cls) {
        if (this.classes.length === 1) {
            // First class to be made, use doc that's there
            cls.doc = this.codeMirror.getDoc();
        } else {
            // Must make new doc
            cls.doc = CodeMirror.Doc(cls.defaultText || "", "text/x-java");
        }
    }

    showClass(index) {
        console.log(this.classes, this.classIndex);
        // All classes are deleted
        if (index < 0) {
            // Put a new empty doc there
            this.codeMirror.swapDoc(CodeMirror.Doc("", "text/x-java"));
            return;
        }

        this.classIndex = index;
        let cls = this.classes[this.classIndex];
        if (!cls.hasLoaded && this.handleSaving) {
            // If we haven't loaded the saved version yet, load it
            let savedText = this.load();
            if (savedText) {
                cls.doc.setValue(savedText);
                cls.hasLoaded = true;
            }
        }

        this.codeMirror.swapDoc(cls.doc);
    }

    deleteClass(index) {
        this.classes.splice(index, 1);
        if (this.classIndex >= this.classes.length) {
            this.showClass(this.classes.length - 1);
        } else {
            this.showClass(this.classIndex);
        }
    }

    /**
     * Stores value at path in local storage
     *
     * @param {String} path
     * @param {String} value
     */
    store() {
        if (window.localStorage) {
            let path = this.getClassStorePath();
            let value = this.codeMirror.getValue();
            window.localStorage.setItem(path, value);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Loads value from path in local storage
     *
     * @param {String} path
     */
    load() {
        if (window.localStorage) {
            let path = this.getClassStorePath();
            return window.localStorage.getItem(path);
        }
    }

    getClassStorePath() {
        let cls = this.classes[this.classIndex];

        // Backwards compatibility for when there weren't multiple classes allowed
        if (this.classes.length === 1) {
            return this.challengePath + "_save";
        } else {
            return this.challengePath + "_" + cls.className + "_save";
        }
    }

    /**
     * Resets the text of this codeMirror to its default
     */
    resetText(index) {
        this.codeMirror.getDoc().setValue(this.classes[index].defaultText);
    }
}

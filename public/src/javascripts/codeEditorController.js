"use strict";
import { setInterval } from "timers";

export default class CodeEditorController {
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
        this.handleSaving = options.handleSaving === undefined ? true : options.handleSaving;
    }

    /**
     * Captures all of the necessary html elements and does other general setup
     * for the CodeEditor. Call this after the TextArea is already rendered
     */
    loadCodeMirror() {
        // Create the code mirror
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

        // Signal to the window that the code mirror is loaded
        if (window.codeMirrorLoad) {
            window.onCodeMirrorLoad();
        }

        // If we have the classes, loop through each one and set up their
        // CodeMirror docs
        if (this.classes && this.classes[0]) {
            // First class should use existing doc, no need to create another one
            this.classes[0].doc = this.codeMirror.getDoc();
            let savedText = this.load(0);
            this.classes[0].doc.setValue(savedText || cls.defaultText || "", "text/x-java");

            // All of the other classes will need to create new docs
            for (let i = 1; i < this.classes.length; i++) {
                this.createNewClassDoc(i);
            }

            // Show the initial class
            this.showClass(0);
        }

        if (this.handleSaving) {
            this.shouldSave = false;
            // Capture the save label
            this.changeSpan = document.getElementsByClassName("saving")[0];
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
    }

    /**
     * Creates and tracks a new class for the editor.
     * Also shows the new class.
     *
     * @param {String} name name of the class
     */
    createNewClass(name) {
        let newClass = { name, defaultText: "" };
        this.classes.push(newClass);

        // Get a doc for the class
        this.createNewClassDoc(this.classes.length - 1);

        // Go ahead and show the class
        this.showClass(this.classes.length - 1);
    }

    /**
     * Creates a new CodeMirror Doc for this class to use
     *
     * @param {Number} index which class to create a doc for
     */
    createNewClassDoc(index) {
        let cls = this.classes[index];
        if (this.classes.length === 1) {
            // First class to be made, use doc that's there
            cls.doc = this.codeMirror.getDoc();
        } else {
            // Must make new doc
            let savedText = this.load(index);
            cls.doc = CodeMirror.Doc(savedText || cls.defaultText || "", "text/x-java");
        }
    }

    /**
     * Switches the CodeMirrors doc to the doc of the class to show.
     *
     * If there are no classes left, pass in an index < 0. This will create a
     * new Doc and leave it there for the next class created to use
     * @param {Number} index which class to show
     */
    showClass(index) {
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
            }
        }

        this.codeMirror.swapDoc(cls.doc);
    }

    /**
     * Removes the class at index from the editor
     *
     * @param {Number} index
     */
    deleteClass(index) {
        this.classes.splice(index, 1);
        if (this.classIndex >= this.classes.length) {
            this.showClass(this.classes.length - 1);
        } else {
            this.showClass(this.classIndex);
        }
    }

    /**
     * Stores all classes in windows local storage
     */
    store() {
        if (window.localStorage) {
            for (let i = 0; i < this.classes.length; i++) {
                let path = this.getClassStorePath(i);
                let value = this.classes[i].doc.getValue();
                window.localStorage.setItem(path, value);
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Loads value from path in local storage
     *
     * @param {Number} index index class to load. Defaults to currently shown class
     */
    load(index) {
        index = index !== undefined ? index : this.classIndex;
        this.classes[index].hasLoaded = true;

        if (window.localStorage) {
            let path = this.getClassStorePath(index);
            return window.localStorage.getItem(path);
        }
    }

    /**
     * What name to use for local storage
     *
     * @param {Number} index which class to get the path of
     */
    getClassStorePath(index) {
        let cls = this.classes[index];

        // Backwards compatibility for when there weren't multiple classes allowed
        if (this.classes.length === 1) {
            return this.challengePath + "_save";
        } else {
            return this.challengePath + "_" + cls.name + "_save";
        }
    }

    /**
     * Resets the text of this codeMirror to its default
     */
    resetText() {
        this.codeMirror.getDoc().setValue(this.classes[this.classIndex].defaultText);
    }
}

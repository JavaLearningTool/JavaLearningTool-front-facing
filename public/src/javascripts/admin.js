"use strict";

import axios from "axios";
import categories from "./categoryHandler";
import Admin from "./Components/AdminMain";

import CodeEditor from "./Components/CodeEditor";

import React from "react";
import ReactDOM from "react-dom";

const adminDiv = document.getElementById("admin");

// Run this only if on main admin page
if (adminDiv) {
    let findTab = () => {
        const hrefParts = window.location.href.split("/");
        const selected = hrefParts[hrefParts.length - 1];
        let selectedNum = 1;

        if (selected === "Challenges") {
            selectedNum = 2;
        } else if (selected === "Messages") {
            selectedNum = 3;
        } else if (selected === "Attempts") {
            selectedNum = 4;
        }

        return selectedNum;
    };

    let component;

    let pickTab = () => {
        let selectedNum = findTab();
        component.changeTabState(findTab());
    };

    component = ReactDOM.render(
        <Admin
            messages={window.adminMessages}
            categories={window.adminCategories}
            challenges={window.adminChallenges}
            attempts={window.adminAttempts}
            selected={findTab()}
            changeTab={pickTab}
        />,
        adminDiv
    );

    window.onpopstate = pickTab;
}

// If there is codeEditor handle rendering it here
const editorDiv = document.getElementsByClassName("codeEditor")[0];
let codeEditor;

if (editorDiv) {
    let classes = [];

    if (window.classes && window.classes.length > 0) {
        // If this challenge already has classes associated with it
        classes = window.classes;
    } else {
        // Default class if none exist already
        classes = [
            {
                name: "Test",
                defaultText:
                    "public class Test {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}"
            }
        ];
    }

    codeEditor = ReactDOM.render(
        <CodeEditor allowNewClasses={true} classes={classes} handleSaving={false} />,
        editorDiv
    );
    codeEditor.setupCodeMirror();
}

// Setup functions for various buttons to call
window.pull = function() {
    axios
        .post("/admin/pull")
        .then(function(res) {
            console.log("Pulled");
        })
        .catch(function(err) {
            console.log("Error Pulling.");
            console.log(err);
        });
};

// When you click on add category button in main admin route
window.addCategory = function() {
    window.location.href = "/admin/new_category";
};

// When you create the category
window.putCategory = function() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let featured = document.getElementById("featured").checked;
    axios
        .put("/admin/category", { title, description, featured })
        .then(function(res) {
            window.location.href = "/admin";
        })
        .catch(function(err) {
            console.log("Error putting category.");
            console.log(err);
        });
};

// When you remove a category
window.removeCategory = function(id) {
    axios
        .delete("/admin/category/" + id)
        .then(function(res) {
            window.location.href = "/admin";
        })
        .catch(function(err) {
            console.log("Error removing category.");
            console.log(err);
        });
};

// When you update a category
window.patchCategory = function(id) {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let featured = document.getElementById("featured").checked;

    axios
        .patch("/admin/category/" + id, { title, description, featured })
        .then(function(res) {
            window.location.href = "/admin";
        })
        .catch(function(err) {
            console.log("Error patching category.");
            console.log(err);
        });
};

// When you click on the new challenge button in main admin route
window.addChallenge = function() {
    window.location.href = "/admin/new_challenge";
};

// When you create a new challenge
window.putChallenge = function() {
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let difficulty = document.getElementById("difficulty").value;
    let testFile = document.getElementById("test_file").value;
    let classes = [];
    codeEditor.getClasses().forEach(element => {
        classes.push({ name: element.name, defaultText: element.doc.getValue() });
    });

    axios
        .post("/admin/challenge", {
            name,
            description,
            categories,
            difficulty,
            testFile,
            classes
        })
        .then(function(res) {
            window.location.href = "/admin/tab/Challenges";
        })
        .catch(function(err) {
            console.log("Error putting challenge.");
            console.log(err);
        });
};

// When you update a challenge
window.patchChallenge = function(id) {
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let difficulty = document.getElementById("difficulty").value;
    let testFile = document.getElementById("test_file").value;

    let classes = [];
    codeEditor.getClasses().forEach(element => {
        classes.push({ name: element.name, defaultText: element.doc.getValue() });
    });

    axios
        .patch("/admin/challenge/" + id, {
            name,
            description,
            categories,
            difficulty,
            testFile,
            classes
        })
        .then(function(res) {
            window.location.href = "/admin/tab/Challenges";
        })
        .catch(function(err) {
            console.log("Error patching challenge.");
            console.log(err);
        });
};

// When you delete a challenge
window.deleteChallenge = function(id) {
    axios
        .delete("/admin/challenge/" + id)
        .then(function(res) {
            window.location.href = "/admin/tab/Challenges";
        })
        .catch(function(err) {
            console.log("Error deleting challenge.");
            console.log(err);
        });
};

// When you click on the add Message button in main admin route
window.addMessage = function() {
    window.location.href = "/admin/new_message";
};

// Converts the links in a message from a String to a list of links
function convertLinks(links) {
    let retLinks = [];
    links = links.split(";");
    links.forEach(link => {
        let temp = link.split(":");
        if (temp.length != 2) {
            console.log("Error parsing links.");
            return [];
        }
        retLinks.push({
            href: temp[1],
            name: temp[0]
        });
    });

    return retLinks;
}

// When you create a new message
window.putMessage = function() {
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    let links = document.getElementById("links").value;
    let visible = document.getElementById("visible").checked;

    links = convertLinks(links);

    axios
        .put("/admin/message", {
            title,
            body,
            links,
            visible
        })
        .then(function(res) {
            window.location.href = "/admin/tab/Messages";
        })
        .catch(function(err) {
            console.log("Error putting message.");
            console.log(err);
        });
};

// When you update a message
window.patchMessage = function(id) {
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    let links = document.getElementById("links").value;
    let visible = document.getElementById("visible").checked;

    links = convertLinks(links);

    axios
        .patch("/admin/message/" + id, {
            title,
            body,
            links,
            visible
        })
        .then(function(res) {
            window.location.href = "/admin/tab/Messages";
        })
        .catch(function(err) {
            console.log("Error patching message.");
            console.log(err);
        });
};

// When you remove a message
window.removeMessage = function(id) {
    axios
        .delete("/admin/message/" + id)
        .then(function(res) {
            window.location.href = "/admin/tab/Messages";
        })
        .catch(function(err) {
            console.log("Error deleting message.");
            console.log(err);
        });
};

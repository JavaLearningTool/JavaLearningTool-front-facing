"use strict";

import axios from "axios";
import categories from "./categoryHandler";

window.onload = function() {
    // Get the name input field
    let nameField = document.getElementById("name");

    // We are in search results page so name field doesn't exist
    if (nameField === undefined || nameField === null) {
        return;
    }

    // Call runSearch() whenever enter is pressed instead of default action.
    nameField.addEventListener("keypress", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            window.runSearch();
        }
    });
};

window.runSearch = function() {
    let name = document.getElementById("name").value;
    let difficulty = document.getElementById("difficulty").value;
    let showPassed = document.getElementById("showPassed").checked;

    let empty = true;
    let queryString = "?criteria=anything";

    if (name !== "") {
        empty = false;
        queryString = "?name=" + name;
    }

    if (difficulty !== "0") {
        if (empty === false) {
            queryString += "&";
        } else {
            queryString = "?";
            empty = false;
        }

        queryString += "difficulty=" + difficulty;
    }

    if (categories.length !== 0) {
        if (empty === false) {
            queryString += "&";
        } else {
            empty = false;
            queryString = "?";
        }

        queryString += "categories=" + JSON.stringify(categories);
    }

    if (showPassed) {
        if (empty === false) {
            queryString += "&";
        } else {
            empty = false;
            queryString = "?";
        }

        queryString += "showPassed=true";
    }

    window.location.href = "/search" + queryString;
};

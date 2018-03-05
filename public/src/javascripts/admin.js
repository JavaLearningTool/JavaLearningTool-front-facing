'use strict';

import axios from 'axios';
import categories from './categoryHandler';
import Admin from './Components/AdminMain';
import React from "react";
import ReactDOM from 'react-dom';

const adminDiv = document.getElementById("admin");
if (adminDiv) {
    let component = ReactDOM.render(
      <Admin messages={window.adminMessages} categories={window.adminCategories} challenges={window.adminChallenges} />,
      adminDiv
    );
}


window.addCategory = function() {
    window.location.href = '/admin/new_category';
}

window.putCategory = function() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let featured = document.getElementById("featured").checked;
    axios.put('/admin/category', {title, description, featured})
    .then(function (res) {
        window.location.href = "/admin";
    }).catch(function (err) {
        console.log("Error putting category.")
        console.log(err);
    });
}

window.removeCategory = function(id) {
    axios.delete('/admin/category/' + id)
    .then(function (res) {
        window.location.href = '/admin';
    }).catch(function (err) {
        console.log("Error removing category.")
        console.log(err);
    });
}

window.patchCategory = function(id) {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let featured = document.getElementById("featured").checked;
    
    axios.patch('/admin/category/' + id, {title, description, featured})
    .then(function (res) {
        window.location.href = "/admin";
    }).catch(function (err) {
        console.log("Error patching category.")
        console.log(err);
    });
}

window.addChallenge = function() {
    window.location.href = "/admin/new_challenge";
}

window.putChallenge = function() {
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let difficulty = document.getElementById('difficulty').value;
    let testFile = document.getElementById('test_file').value;
    let className = document.getElementById("className").value;
    let defaultText = document.codeMirror.getValue();
    
    axios.post('/admin/challenge', {name, description, categories, difficulty,
        defaultText, testFile, className})
        .then(function (res) {
            window.location.href = "/admin";
        }).catch(function (err) {
            console.log("Error putting challenge.")
            console.log(err);
        });
        
    }
    
    window.patchChallenge = function(id) {
        let name = document.getElementById('name').value;
        let description = document.getElementById('description').value;
        let difficulty = document.getElementById('difficulty').value;
        let defaultText = document.codeMirror.getValue();
        let className = document.getElementById("className").value;    
        let testFile = document.getElementById('test_file').value;
        
        axios.patch('/admin/challenge/' + id, {name, description, categories, difficulty,
            defaultText, testFile, className})
            .then(function (res) {
                window.location.href = "/admin";
            }).catch(function (err) {
                console.log("Error patching challenge.");
                console.log(err);
            });
        }
        
        
        window.deleteChallenge = function(id) {
            axios.delete('/admin/challenge/' + id)
            .then(function (res) {
                window.location.href = '/admin';
            }).catch(function (err) {
                console.log("Error deleting challenge.");
                console.log(err);
            });
        }
        
        window.addMessage = function() {
            window.location.href = "/admin/new_message";
        };
        
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
                window.location.href = "/admin";
              })
              .catch(function(err) {
                console.log("Error putting message.");
                console.log(err);
              });
        };
        
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
                window.location.href = "/admin";
              })
              .catch(function(err) {
                console.log("Error patching message.");
                console.log(err);
              });
        };
        
        window.removeMessage = function(id) {
            axios
            .delete("/admin/message/" + id)
            .then(function(res) {
                window.location.href = "/admin";
            })
            .catch(function(err) {
                console.log("Error deleting message.");
                console.log(err);
            });
        };
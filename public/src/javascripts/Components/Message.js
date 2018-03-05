import React from "react";

const diff = ['Very easy', 'Easy', 'Intermediate', 'Advanced', 'Challenging'];

function Message(props) {

    let messages = [];

    props.messages.forEach( (message, index) => {
        messages.push(
            <li className="categoryLI" key={index}>
                <a href={ "/admin/message/" + message._id }>
                    <div className="flat card admin-row admin-message"> 
                        <div className="message-title">
                            {message.title}
                        </div>
                        <div className="admin-hidden">
                            { "Hidden: " + (message.visible ? "No" : "Yes")}
                        </div>
                        <br/>
                        <div className="message">
                            {message.body}
                        </div>
                    </div>
                </a>
            </li> 
        );
    });

    return (
        <div className="category-list" style={props.shown ? {} : {display: "none"}}>
            <h1>Message</h1>
            <a href="/admin/new_message">
                <div className="card new-admin-card">
                    <h2>Add Message</h2>
                </div>
            </a>
            <ul className="admin-categories admin-table">
                { messages }
            </ul>
        </div>
    );
}

export default Message;
"use strict";

import React from "react";
import Category from "./Category";
import Challenge from "./Challenge";
import Message from "./Message";
import Attempt from "./Attempt";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: props.categories,
            challenges: props.challenges,
            messages: props.messages,
            attempts: props.attempts,
            stateShown: props.selected,
            changeTab: props.changeTab
        };
    }

    changeTabState(nextSelected) {
        this.setState({ stateShown: nextSelected });
    }

    render() {
        return (
            <div className="flex-container admin-container">
                <div className="sideBar">
                    <h1 className="header-title">Nova</h1>
                    <ul>
                        <li
                            className={this.state.stateShown === 1 ? "active" : ""}
                            onClick={() => this.onClick("Category")}
                        >
                            <h3>Categories</h3>
                        </li>
                        <li
                            className={this.state.stateShown === 2 ? "active" : ""}
                            onClick={() => this.onClick("Challenges")}
                        >
                            <h3>Challenges</h3>
                        </li>
                        <li
                            className={this.state.stateShown === 3 ? "active" : ""}
                            onClick={() => this.onClick("Messages")}
                        >
                            <h3>Messages</h3>
                        </li>
                        <li
                            className={this.state.stateShown === 4 ? "active" : ""}
                            onClick={() => this.onClick("Attempts")}
                        >
                            <h3>Attempts</h3>
                        </li>
                        {/* <li
                            onClick={() => {
                                window.pull();
                            }}
                        >
                            <h3>Pull</h3>
                        </li> */}
                    </ul>
                </div>
                <div className="main">
                    <Category
                        categories={this.state.categories}
                        shown={this.state.stateShown === 1}
                    />
                    <Challenge
                        challenges={this.state.challenges}
                        categories={this.state.categories}
                        shown={this.state.stateShown === 2}
                    />
                    <Message messages={this.state.messages} shown={this.state.stateShown === 3} />
                    <Attempt attempts={this.state.attempts} shown={this.state.stateShown === 4} />
                </div>
            </div>
        );
    }

    onClick(which) {
        history.pushState(null, "", "/admin/tab/" + which);
        this.state.changeTab();
    }

    componentWillReceiveProps(nextProps) {}
}

export default Admin;

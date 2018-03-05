"use strict";

import React from "react";
import Category from "./Category";
import Challenge from "./Challenge";
import Message from "./Message";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: props.categories,
            challenges: props.challenges,
            messages: props.messages,
            stateShown: 1
        };
    }

    render() {

        return <div className="flex-container admin-container">
            <div className="sideBar">
              <h1 className="header-title">Nova</h1>
              <ul>
                <li onClick={() => this.onClick("Category")}>
                  <h3>Categories</h3>
                </li>
                <li onClick={() => this.onClick("Challenges")}>
                  <h3>Challenges</h3>
                </li>
                <li onClick={() => this.onClick("Messages")}>
                  <h3>Messages</h3>
                </li>
              </ul>
            </div>
            <div className="main">
              <Category categories={this.state.categories} shown={this.state.stateShown === 1} />
              <Challenge challenges={this.state.challenges} shown={this.state.stateShown === 2} />
              <Message messages={this.state.messages} shown={this.state.stateShown === 3} />
            </div>
          </div>;
    }

    onClick(which) {
        if (which === "Category" && this.statestateShown !== 1) {
            this.setState({stateShown: 1});
        } else if (which === "Challenges" && this.statestateShown !== 2) {
            this.setState({ stateShown: 2 });
        } else if (which === "Messages" && this.statestateShown !==3) {
            this.setState({ stateShown: 3 });
        }
    }

    componentWillReceiveProps(nextProps) {
    
    }

}

export default Admin;

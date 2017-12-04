'use strict';

import React from 'react';

class TestResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: this.props.display,
            resultState: {compiling: false, error: false, data: {compiling: false, error: false, data: "No data"}}
        };
    }

    render() {
        if (!this.state.display) {
            return (<h1></h1>);
        } else if (this.state.resultState.compiling) {
            return (<h1>Compiling ...</h1>);
        } else if (this.state.resultState.error) {
            return (<pre><h1>{this.state.resultState.error}</h1></pre>);
        } else {
            let items = [];
            this.state.resultState.data.forEach((element, index) => {
                items.push(this.renderTestResult(element, index));
            });
            return (
                <div>
                { items }
                </div>
            );
        }
    }

    renderTestResult(item, index) {
        let passString = (item.passed === 'true' ? "Passed" : "Failed");
        return (
            <div key={index}>
                <h1>{(passString)}</h1>
                <h1> Expected: {item.expected} </h1>
                <h1> Actual: {item.actual} </h1>
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }
}

export default TestResults;
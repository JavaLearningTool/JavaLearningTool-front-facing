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
        let passed = (item.passed === 'true');
        let timeout = (item.timeout === 'true');
        return <div className={"testResult " + (passed ? "success" : "failure")} key={index}>
            <p className="passedLabel">
              {passed ? "passed" : "failed"}
            </p>
            <p className="resultLabel">
              {" "}
              Expected: {this.replaceNewLines(item.expected)}{" "}
            </p>
            <p className="resultLabel">
              {" "}
              Actual: {this.replaceNewLines(item.actual)}{" "}
            </p>
            <p className="resultLabel"> time: {item.time} ms</p>
            <p className="resultLabel">
              timed out: {timeout ? "true" : "false"}
            </p>
          </div>;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    replaceNewLines(str) {
        return str.replace(/(\n)|(\\n)/g, "↩");
    }
}

export default TestResults;
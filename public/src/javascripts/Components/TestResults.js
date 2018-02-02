'use strict';

import React from 'react';

class TestResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: this.props.display,
            resultState: {compiling: false, error: false, data: {compiling: false, error: false, data: "No data"}}
        };

        // This binding is necessary to make `this` work in the callback
        this.dropDownClicked = this.dropDownClicked.bind(this);
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
        let passed = item.passed === 'true';
        let timeout = item.timeout === 'true';
        let runtimeException = item.runtimeException === 'true';

        let passFailLabel = "You passed!";
        if (timeout) {
            passFailLabel = "You timed out."
        } else if (runtimeException) {
            passFailLabel = "A runtime exception occurred."
        } else if (!passed) {
            passFailLabel = "You failed.";            
        }

        let inputLabel;
        if (item.input === "") {
            inputLabel = <p className="resultLabel"> Input: None </p>
        } else {
            inputLabel = <p className="resultLabel"> Input: {item.input} </p>;            
        }

        let body;
        if (!timeout && !runtimeException) { // Passed or failed normally
            body = <div className="drop-down-body ">
                <div className="resultArea">
                    <p className="resultLabel">Expected: </p>
                    <p className="resultField">
                        {this.replaceNewLines(item.expected)}
                    </p>
                </div>
                <div className="resultArea">
                    <p className="resultLabel">Actual: </p>
                    <p className="resultField">
                        {this.replaceNewLines(item.actual)}
                    </p>
                </div>
                <p className="resultLabel"> time: {item.time} ms</p>
              </div>;
        } else if (timeout) { // Timeout occurred
            body = <div className="drop-down-body ">
                <div className="resultArea">
                    <p className="resultLabel"> Timeout! after {item.time} ms.</p>
                </div>
                <br/>
                <div className="resultArea">
                    <p className="resultLabel">Expected: </p>
                    <p className="resultField">
                        {this.replaceNewLines(item.expected)}
                    </p>
                </div>
              </div>;
        } else { // Runtime exception
            body = <div className="drop-down-body ">
                <div className="resultArea">
                    <p className="resultLabel">Compiler Message: </p>
                    <pre className="resultField">
                        {item.exceptionMessage}
                    </pre>
                </div>
                <div className="resultArea">
                    <p className="resultLabel">Expected: </p>
                    <p className="resultField">
                        {this.replaceNewLines(item.expected)}
                    </p>
                </div>
                <p className="resultLabel"> time: {item.time} ms</p>
              </div>;
        }

        return <div className={"testResult drop-down-container " + (item.dropped ? "dropped" : "")} key={index} onClick={e => {
              this.dropDownClicked(index);
            }}>
            <div className="drop-down-header">
              <div className="headerResultArea">
                <p
                  className={
                    "passedLabel " + (passed ? "success" : "failure")
                  }
                >
                  {passFailLabel}
                </p>
                {inputLabel}
              </div>
            </div>
            {body}
          </div>;
    }

    dropDownClicked(index) {
        console.log(this.state.resultState.data[index]);
        let copy = JSON.parse(JSON.stringify(this.state));
        for (let i = 0; i < copy.resultState.data.length; i++) {
            if (i != index) {
                copy.resultState.data[i].dropped = false;
            } else if (copy.resultState.data[i].dropped) {
                copy.resultState.data[i].dropped = false;
            } else {
                copy.resultState.data[i].dropped = true;
            }
        }
        this.setState(copy);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    replaceNewLines(str) {
        return str.replace(/(\n)|(\\n)/g, "↩");
    }
}

export default TestResults;
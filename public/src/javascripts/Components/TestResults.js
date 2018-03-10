"use strict";

import React from "react";

const MESSAGE_RESULT_TYPE = "message";
const COMPARATIVE_RESULT_TYPE = "comparative";
const COMPARATIVE_MESSAGE_RESULT_TYPE = "comparative-message";

class TestResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: this.props.display,
            resultState: { compiling: false, error: false, data: {} }
        };

        // This binding is necessary to make `this` work in the callback
        this.dropDownClicked = this.dropDownClicked.bind(this);
    }

    render() {
        if (!this.state.display) {
            return <h1 />;
        } else if (this.state.resultState.compiling) {
            return <h1>Compiling ...</h1>;
        } else if (this.state.resultState.error) {
            return <pre>{this.state.resultState.error}</pre>;
        } else {
            let items = [];
            this.state.resultState.data.forEach((element, index) => {
                items.push(this.renderTestResult(element, index));
            });
            return <div>{items}</div>;
        }
    }

    renderTestResult(item, index) {
        let parts = [];

        if (item.parts !== undefined) {
            item.parts.forEach((part, partIndex) => {
                let label = this.replaceQuotes(
                    this.replaceNewLines(part.label)
                );
                let message = this.replaceQuotes(part.message);
                if (part.multiLine === "false") {
                    message = this.replaceNewLines(message);
                }

                parts.push(
                    <div className="resultArea" key={"resultArea" + partIndex}>
                        <p className="resultLabel"> {label} </p>
                        <pre className="resultField">{message}</pre>
                    </div>
                );
            });
        }

        let passed = item.passed === "true";
        let timeout = item.timeout === "true";
        let runtimeException = item.runtimeException === "true";
        let passFailLabel = "You passed!";
        if (timeout) {
            passFailLabel = "You timed out.";
        } else if (runtimeException) {
            passFailLabel = "A runtime exception occurred.";
        } else if (!passed) {
            passFailLabel = "You failed.";
        }

        let infoLabel = (
            <p className="resultLabel">
                {" "}
                {this.replaceNewLines(this.replaceQuotes(item.info))}{" "}
            </p>
        );

        let body = (
            <div className="drop-down-body">
                {parts}
                <p className="resultLabel"> time: {item.time} ms</p>
            </div>
        );

        return (
            <div
                className={
                    "testResult drop-down-container " +
                    (item.dropped ? "dropped" : "")
                }
                key={"result" + index}
                onClick={e => {
                    this.dropDownClicked(index);
                }}
            >
                <div className="drop-down-header">
                    <div className="headerResultArea">
                        <p
                            className={
                                "passedLabel " +
                                (passed ? "success" : "failure")
                            }
                        >
                            {passFailLabel}
                        </p>
                        {infoLabel}
                    </div>
                </div>
                {body}
            </div>
        );
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
        console.log(nextProps.resultState.data);
        if (nextProps.resultState.data) {
            nextProps.resultState.data.sort((a, b) => {
                if (a.passed == b.passed) {
                    return 0;
                } else if (a.passed === "true") {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        this.setState(nextProps);
    }

    replaceNewLines(str) {
        return str.replace(/(\n)|(\\n)/g, "↩");
    }

    replaceQuotes(str) {
        return str.replace(/&quot;/g, "'");
    }
}

export default TestResults;

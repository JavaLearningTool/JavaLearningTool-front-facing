import React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";

function Attempt(props) {
    // Set up the columns of the table
    const columns = [
        // User column
        { id: "user", Header: "User", filterAll: true, accessor: "user" },
        // Challenge column
        { id: "challenge", Header: "Challenge", filterAll: true, accessor: "challenge" },
        // Passed column
        {
            id: "passed",
            Header: "Passed",
            accessor: attempt => {
                return attempt.passed ? "Passed" : "Failed";
            },
            // Setup filtering to work based on Passed or Failed
            filterMethod: (filter, row) => {
                console.log(row);
                if (filter.value === "all") {
                    return true;
                }
                if (filter.value === "passed") {
                    return row.passed === "Passed";
                }
                return row.passed === "Failed";
            },
            // Setup filter html
            Filter: ({ filter, onChange }) => (
                <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : "all"}
                >
                    <option value="all">Show All</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                </select>
            )
        },
        // Time column
        {
            id: "timestamp",
            Header: "Time",
            filterAll: true,
            accessor: "timestamp",
            // Change how the cells in this column are rendered
            Cell: props => {
                const date = new Date(props.value);
                return <span>{date.toLocaleTimeString() + " " + date.toLocaleDateString()}</span>;
            }
        }
    ];

    return (
        <div className="attempt-list" style={props.shown ? {} : { display: "none" }}>
            <ReactTable
                // Make the table filterable
                filterable
                // When filtering, by default use fuzzy match
                defaultFilterMethod={(filter, rows) => {
                    console.log(rows, filter);
                    return matchSorter(rows, filter.value, { keys: [filter.id] });
                }}
                data={props.attempts}
                columns={columns}
                // Sort time column by default
                defaultSorted={[
                    {
                        id: "timestamp",
                        desc: true
                    }
                ]}
            />
        </div>
    );
}

export default Attempt;

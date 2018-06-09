import React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";

function Attempt(props) {
    const columns = [
        { id: "user", Header: "User", filterAll: true, accessor: "user" },
        { id: "challenge", Header: "Challenge", filterAll: true, accessor: "challenge" },
        {
            id: "passed",
            Header: "Passed",
            accessor: attempt => {
                return attempt.passed ? "Passed" : "Failed";
            },
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
        {
            id: "timestamp",
            Header: "Time",
            filterAll: true,
            accessor: attempt => {
                let date = new Date(attempt.timestamp);
                return date.toLocaleDateString() + " " + date.toLocaleTimeString();
            }
        }
    ];

    return (
        <div className="attempt-list" style={props.shown ? {} : { display: "none" }}>
            <ReactTable
                filterable
                defaultFilterMethod={(filter, rows) => {
                    console.log(rows, filter);
                    return matchSorter(rows, filter.value, { keys: [filter.id] });
                }}
                data={props.attempts}
                columns={columns}
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

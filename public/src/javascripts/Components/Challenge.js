import React from "react";

const diff = ['Very easy', 'Easy', 'Intermediate', 'Advanced', 'Challenging'];

function Challenge(props) {

    let challenges = [];

    props.challenges.forEach( (challenge, index) => {
        challenges.push(
            <li className="categoryLI" key={index}>
                <a href={ "/admin/challenge/" + challenge._id }>
                    <div className="admin-row flat card"> 
                        <div className="title">
                            {challenge.name}
                        </div>
                        <div className="description">
                            {challenge.description}
                        </div>
                        <div className="difficulty">
                            Difficulty: {diff[challenge.difficulty - 1]}
                        </div>
                    </div>
                </a>
            </li> 
        );
    });

    return (
        <div className="category-list" style={props.shown ? {} : {display: "none"}}>
            <h1>Challenges</h1>
            <a href="/admin/new_challenge">
                <div className="card new-admin-card">
                    <h2>Add Challenge</h2>
                </div>
            </a>
            <ul className="admin-categories admin-table">
                { challenges }
            </ul>
        </div>
    );
}

export default Challenge;
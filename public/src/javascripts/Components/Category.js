import React from "react";

function Category(props) {
    let categories = [];

    // Create category list contents
    props.categories.forEach((category, index) => {
        categories.push(
            <li className="categoryLI" key={index}>
                <a href={"/admin/category/" + category._id}>
                    <div className="admin-row flat card">
                        <div className="title">{category.title}</div>
                        <div className="description">{category.description}</div>
                        <div className="featured">Featured: {category.featured ? "Yes" : "No"}</div>
                    </div>
                </a>
            </li>
        );
    });

    return (
        <div className="category-list" style={props.shown ? {} : { display: "none" }}>
            <h1>Categories</h1>
            <a href="/admin/new_category">
                <div className="card new-admin-card">
                    <h2>Add Category</h2>
                </div>
            </a>
            <ul className="admin-categories admin-table">{categories}</ul>
        </div>
    );
}

export default Category;

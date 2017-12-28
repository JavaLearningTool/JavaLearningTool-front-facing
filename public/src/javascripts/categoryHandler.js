let categories = [];
if (window.categories) {
    categories = window.categories.split(",");
    console.log(categories);
}

window.categoryClick = function(id, butt) {
    console.log(id);

    if (categories.includes(id)) { // button already clicked
        categories.splice(categories.indexOf(id), 1);
        butt.className = butt.className.replace(/pure-button-active/, '');
        console.log("Kill");
    } else { // button not already clicked
        categories.push(id);
        butt.className += ' pure-button-active';
    }
    console.log(categories);
}

export default categories;
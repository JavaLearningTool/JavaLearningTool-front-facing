let categories = [];
if (window.categories) {
    categories = window.categories.split(",");
}

window.categoryClick = function(id, butt) {

    if (categories.includes(id)) { // button already clicked
        categories.splice(categories.indexOf(id), 1);
        butt.className = butt.className.replace(/pure-button-active/, '');
    } else { // button not already clicked
        categories.push(id);
        butt.className += ' pure-button-active';
    }
}

export default categories;
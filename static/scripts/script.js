var currentID = 1;

var trackedCombos = {}

var comboContainer;

// FUNCTION THAT RETURNS AN OBJECT WITH DATA FOR AN ELEMENT AND ITS CHILDREN -- CHILDREN ARE ALSO SAVED AS AN OBJECT
function saveElement(element) {
    return {
        tagName:element.tagName.toLowerCase(),

        attributes: (() => {
            let attributeObject = {};

            // LOOP THROUGH ELEMENT'S ATTRIBUTES AND SAVE IT INTO A KEY-VALUE OBJECT
            for (let i = 0; i < element.attributes.length; i++) {
                attributeObject[element.attributes[i].name] = element.attributes[i].value
            }

            return attributeObject;
        })(),

        id:element.id,

        textContent: element.children.length === 0 ? element.textContent : null,

        children: (() => {
            let childrenArray = [];

            // RECURSIVE FUNCTION WHICH SAVES CHILDREN AS AN OBJECT AND THEN ADDS IT TO AN ARRAY
            for (let i = 0; i < element.children.length; i++) {
                childrenArray.push(saveElement(element.children[i]));
            }
            return childrenArray;
        })()
    }
}

// RUNS WHEN PAGE FIRST LOADS
document.addEventListener('DOMContentLoaded', function() {
    // SAVE THE COMBO TEMPLATE INTO A VARIABLE
    comboContainer = saveElement(document.getElementById("1"));
});

// FUNCTION THAT IMPLEMENTS A COMBO BASED ON ID PASSED
function implement(id) {

    // COMBO DATA TO SEND THROUGH TO FLASK APP
    let data = {
        id: id,

        implemented:!trackedCombos[id],
        
        leftControl: document.getElementById(`leftControl${id}`).checked,
        leftShift: document.getElementById(`leftShift${id}`).checked,
        leftAlt: document.getElementById(`leftAlt${id}`).checked,

        inputText:document.getElementById(`inputText${id}`).value,
        outputText:document.getElementById(`outputText${id}`).value,

        rightControl: document.getElementById(`rightControl${id}`).checked,
        rightShift: document.getElementById(`rightShift${id}`).checked,
        rightAlt: document.getElementById(`rightAlt${id}`).checked,
    }

    // SEND DATA THROUGH
    $.ajax({
        url: "/processImplementation",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({"data":data}),
        
        success: function(response) {

            // CHECK IF COMBO IS CURRENTLY IMPLEMENTED AND UPDATES THE TRACKER
            if (trackedCombos.hasOwnProperty(`${id}`)) {
                trackedCombos[id] = !trackedCombos[id];
            } else {
                trackedCombos[id] = true;
            }

            // UPDATE THE HTML/CSS
            document.getElementById(`${id}`).setAttribute("comboImplemented",trackedCombos[id] ? "true" : "false");
        },
        error: function(error) {
            console.log(error);
        }
    })
}

// FUNCTION THAT CREATES NEW COMBO
function newCombo() {

    // FUNCTION THAT RECEIVES AN OBJECT CONTAINING ELEMENT DATA AND CREATES A NEW ELEMENT INCLUDING CHILDREN
    let createElement = function(tagName,attributes,id,children,textContent) {
        // CREATE ELEMENT
        let element = document.createElement(tagName);

        // SET ATTRIBUTES
        if (attributes != null) {
            for (let i = 0; i < Object.keys(attributes).length; i++) {
                element.setAttribute(Object.keys(attributes)[i],attributes[Object.keys(attributes)[i]].replace("1",`${currentID}`));
            }
        }

        // ADD ID
        if (id != null) {
            element.id = id.replace("1",`${currentID}`);
        }

        // ADD CONTENT
        if (textContent && (!children || children.length === 0)) {
            element.textContent = textContent;
        }

        // ADD CHILDREN
        if (children != null) {
            for (let i = 0; i < children.length; i++) {
                // CHECK IF VARIABLE EXISTS
                let childTagName = (children[i].tagName) ? children[i].tagName : null;
                let childAttributes = (children[i].attributes) ? children[i].attributes : null;
                let childId = (children[i].id) ? children[i].id : null;
                let childChildren = (children[i].children) ? children[i].children : null;
                let childContent = (children[i].textContent) ? children[i].textContent : null;
                // RECURSIVE FUNCTION CREATES CHILDREN ELEMENTS AND ADDS TO PARENT ELEMENT
                element.appendChild(createElement(childTagName,childAttributes,childId,childChildren,childContent));
            }
        }

        return element;
    }

    // INCREMENT ID BY ONE TO ENSURE EVERY COMBO IS UNIQUE
    currentID++;

    // CREATE A NEW COMBO WITH CURRENT ID
    let newCombo = createElement(
        comboContainer.tagName,
        comboContainer.attributes,
        `${currentID}`,
        comboContainer.children
    );
    
    // ADD THE NEW COMBO TO THE PAGE
    document.getElementById("comboRow").appendChild(newCombo);
}
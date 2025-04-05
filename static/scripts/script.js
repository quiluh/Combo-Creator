var currentID = 1;

var trackedCombos = {}

var comboContainer;

function saveElement(element) {
    console.log(element)
    return {
        tagName:element.tagName.toLowerCase(),
        attributes: (() => {
            let attributeObject = {};

            for (let i = 0; i < element.attributes.length; i++) {
                attributeObject[element.attributes[i].name] = element.attributes[i].value
            }

            return attributeObject;
        })(),

        id:element.id,

        children: (() => {
            let childrenArray = [];

            for (let i = 0; i < element.children.length; i++) {
                childrenArray.push(saveElement(element.children[i]));
            }
            return childrenArray;
        })()
    }
}

document.addEventListener('DOMContentLoaded', function() {
    comboContainer = saveElement(document.getElementById("1"));
});

function implement(id) {

    let data = {
        leftControl: document.getElementById(`leftControl${id}`).checked,
        leftShift: document.getElementById(`leftShift${id}`).checked,
        leftAlt: document.getElementById(`leftAlt${id}`).checked,

        inputText:document.getElementById(`inputText${id}`).value,
        outputText:document.getElementById(`outputText${id}`).value,

        rightControl: document.getElementById(`rightControl${id}`).checked,
        rightShift: document.getElementById(`rightShift${id}`).checked,
        rightAlt: document.getElementById(`rightAlt${id}`).checked,
    }

    $.ajax({
        url: "/processImplementation",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({"data":data}),
        success: function(response) {

            if (trackedCombos.hasOwnProperty(`${id}`)) {
                trackedCombos[id] = !trackedCombos[id];
            } else {
                trackedCombos[id] = true;
            }

            document.getElementById(`${id}`).setAttribute("comboImplemented",trackedCombos[id] ? "true" : "false");
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function newCombo() {

    let createElement = function(tagName,attributes,id,children) {
        // CREATE ELEMENT
        let element = document.createElement(tagName);

        // SET ATTRIBUTES
        if (attributes != null) {
            for (let i = 0; i < Object.keys(attributes).length; i++) {
                element.setAttribute(Object.keys(attributes)[i],attributes[Object.keys(attributes)[i]]);
            }
        }

        // ADD ID
        if (id != null) {
            element.id = id;
        }

        // ADD CHILDREN
        if (children != null) {
            for (let i = 0; i < children.length; i++) {
                let childTagName = (children[i].tagName) ? children[i].tagName : null;
                let childAttributes = (children[i].attributes) ? children[i].attributes : null;
                let childClassList = (children[i].classList) ? children[i].classList : null;
                let childId = (children[i].id) ? children[i].id : null;
                let childChildren = (children[i].children) ? children[i].children : null;
                element.appendChild(createElement(childTagName,childAttributes,childClassList,childId,childChildren));
            }
        }

        return element;
    }

    currentID++;

    let newCombo = createElement(
        comboContainer.tagName,
        comboContainer.attributes,
        `${currentID}`,
        comboContainer.children
    );

    document.getElementById("comboRow").appendChild(newCombo);
}
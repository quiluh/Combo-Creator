var currentID = 1;

var trackedCombos = {}

function saveElement(element) {
    return {
        tagName:element.tagName.toLowerCase(),
        classList:element.classList,
        id:element.id,
        attributes: ((element) => {
            let attributeObject = {};

            for (let i of element.attributes) {
                attributeObject[i.name] = i.value;
            }

            return attributeObject;
        })(),

        children: ((element) => {
            childrenArray = [];

            for (let i = 0; i < element.children.length; i++) {
                childrenArray.push(saveElement(element.children[i]));
            }

            return childrenArray;
        })()
    }
}

var comboContainer = saveElement(document.getElementById("1"));

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

    let createElement = function(tagName,attributes,classList,id) {
        // CREATE ELEMENT
        let element = document.createElement(tagName);

        // SET ATTRIBUTES
        if (Object.keys(attributes) != null) {
            for (let i = 0; i < Object.keys(attributes).length; i++) {
                element.setAttribute(Object.keys(attributes)[i],attributes[Object.keys(attributes)[i]]);
            }
        }

        // ADD CLASSES
        if (classList != null) {
            for (let i = 0; i < classList.length; i++) {
                element.classList.add(classList[i]);
            }
        }

        // ADD ID
        if (element.id != null) {
            element.id = id;
        }

        return element;
    }

    currentID++;
}
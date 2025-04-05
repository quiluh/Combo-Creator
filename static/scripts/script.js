var currentID = 1;

var trackedCombos = {}

var comboContainer;

document.addEventListener('DOMContentLoaded', function() {
    var saveElement = function(element) {
        return {
            tagName:element.tagName.toLowerCase(),
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

    let createElement = function(tagName,attributes) {
        // CREATE ELEMENT
        let element = document.createElement(tagName);

        // SET ATTRIBUTES
        if (Object.keys(attributes) != null) {
            for (let i = 0; i < Object.keys(attributes).length; i++) {
                element.setAttribute(Object.keys(attributes)[i],attributes[Object.keys(attributes)[i]]);
            }
        }

        return element;
    }

    currentID++;

    console.log(comboContainer)

    // let newCombo = createElement(
    //     comboContainer.tagName,
    //     comboContainer.attributes,
    //     comboContainer.classList,
    //     `${currentID}`
    // );

    // for (let i = 0; i < comboContainer["children"].length; i++) {
    //     console.log(comboContainer["children"][i])
    //     newCombo.appendChild(
    //         createElement(
    //             comboContainer["children"][i].tagName,
    //             comboContainer["children"][i].attributes,
    //             comboContainer["children"][i].classList,
    //             comboContainer["children"][i].id
    //         )
    //     );
    // }

    // document.getElementById("comboRow").appendChild(newCombo);
}
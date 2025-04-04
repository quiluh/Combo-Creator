var currentID = 1;

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
}
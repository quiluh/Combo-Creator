var currentID = 1;

var trackedCombos = {}

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
            alert("Implemented!");

            if (trackedCombos.hasOwnProperty(`${id}`)) {
                trackedCombos.id = !trackedCombos.id;
            } else {
                trackedCombos.id = true;
            }

            document.getElementById(`${id}`).setAttribute("comboImplemented",trackedCombos.id ? "true" : "false");
        },
        error: function(error) {
            console.log(error);
        }
    })
}
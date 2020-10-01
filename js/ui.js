const partySelectionDivId = "partySelection";
const partyCheckboxClass = "partyCheckbox";
const selectAllCheckboxId = "selectAll";
const selectNothingCheckboxId = "selectNothing";

function initPartySelection(elemId) {
    elem = document.getElementById(elemId);

    elem.innerHTML = "<button onclick=\"selectParties(true)\">Vše</button><br>";
    elem.innerHTML += "<button onclick=\"selectParties(false)\">Nic</button><br>";

    const sortedParties = Object.keys(partyColours).sort();
    for (var i = 0; i < sortedParties.length; i++) {
        const party = sortedParties[i];
        const id = party+"Select";
        const checked = allowedParties.includes(party) ? "checked" : "";
        elem.innerHTML += "<input type=\"checkbox\" id=\""+id+"\" value=\""+party+"\" class=\""+partyCheckboxClass+"\" onchange=\"handleCheckboxChange(this)\" "+checked+"> <label for=\""+id+"\">"+party+"</label><br>";
    }
}

/**
 * Handles change in the state of a party selection checkbox.
 * 
 * @param {*} checkbox Checkbox element, its value is the name of party it selects.
 */
function handleCheckboxChange(checkbox) {
    const party = checkbox.value;

    updateFilter(party, checkbox.checked)

    reloadVectorLayer();
}

function updateFilter(party, allow) {
    if (allow) {
        if (!allowedParties.includes(party)) {
            allowedParties.push(party);
        }  
    } else {
        const index = allowedParties.indexOf(party);
        if (index > -1) {
            allowedParties.splice(index, 1);
        }   
    }
}

function selectParties(selectState) {
    elems = document.getElementsByClassName(partyCheckboxClass);
    for (var i = 0; i < elems.length; i++) {
        elems[i].checked = selectState;
        updateFilter(elems[i].value, selectState)
    }

    reloadVectorLayer();
}

initPartySelection(partySelectionDivId);
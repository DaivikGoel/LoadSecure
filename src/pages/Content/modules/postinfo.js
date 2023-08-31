import { vetMC, CommentPhoneNumber } from "./vetting";

export const postinfo = (document, node, parseData) => {
    console.log("PARSE DATA", parseData)

    const extractedDivElement = document.createElement("div");

    // Create the first row with a checkmark and text
    const MCResponse = vetMC(parseData['mcNumber'])
    console.log("HERE IS THE CORRELATION", parseData['mcNumber'], MCResponse['status'])
    const MCStatus = MCResponse['status']
    const firstRow = createRow(MCStatus, "MC Number " + MCResponse.message);
    extractedDivElement.appendChild(firstRow);

    // Create the second row with a checkmark and text
    const secondRow = createRow("✓", "Another Text");
    extractedDivElement.appendChild(secondRow);

    // Insert the <div> element as a sibling of the current container
    node.parentNode.insertBefore(extractedDivElement, node.nextSibling);
}


function createRow(icon, text) {
    const row = document.createElement("div");
    row.classList.add("custom-row");

    const iconSpan = document.createElement("span");
    iconSpan.textContent = icon;
    row.appendChild(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    row.appendChild(textSpan);

    return row;
}


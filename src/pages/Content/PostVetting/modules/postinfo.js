import { vetMC, CommentPhoneNumber, vetEmail, vetDriverInspections, vetTruckInspections, vetPOBox, DriverAndTruckers } from "./vetting";

export const postinfo = (document, node, parseData, Comments, CarrierInfo) => {

    const extractedDivElement = document.createElement("div");
    extractedDivElement.classList.add("LoadSecureContainer");

    // Create the first row with a checkmark and text
    const MCResponse = vetMC(parseData['mcNumber']);
    if (MCResponse) {
        const MCResponseRow = createRow(MCResponse.status, MCResponse.message);
        extractedDivElement.appendChild(MCResponseRow);
    }

    // Create the second row with a checkmark and text
    const CommentResponse = CommentPhoneNumber(parseData.phoneNumber, Comments);
    if (CommentResponse) {
        const CommentResponseRow = createRow(CommentResponse.status, CommentResponse.message);
        extractedDivElement.appendChild(CommentResponseRow);
    }

    const EmailResponse = vetEmail(parseData.emailAddress, Comments);
    if (EmailResponse) {
        const EmailResponseRow = createRow(EmailResponse.status, EmailResponse.message);
        extractedDivElement.appendChild(EmailResponseRow);
    }
    const DriversandTruckersResponse = DriverAndTruckers(CarrierInfo);
    if (DriversandTruckersResponse) {
        const DriversAndTruckersRow = createRow(DriversandTruckersResponse.status, DriversandTruckersResponse.message);
        extractedDivElement.appendChild(DriversAndTruckersRow);
    }

    const DriverInspectionResponse = vetDriverInspections(CarrierInfo);
    if (DriverInspectionResponse) {
        const DriverInspectionResponseRow = createRow(DriverInspectionResponse.status, DriverInspectionResponse.message);
        extractedDivElement.appendChild(DriverInspectionResponseRow);
    }

    const TruckInspectionResponse = vetTruckInspections(CarrierInfo);
    if (TruckInspectionResponse) {
        const TruckInspectionResponseRow = createRow(TruckInspectionResponse.status, TruckInspectionResponse.message);
        extractedDivElement.appendChild(TruckInspectionResponseRow);
    }

    const POBoxResponse = vetPOBox(CarrierInfo);
    if (POBoxResponse) {
        const POBoxResponseRow = createRow(POBoxResponse.status, POBoxResponse.message);
        extractedDivElement.appendChild(POBoxResponseRow);
    }




    // Insert the <div> element as a sibling of the current container
    //node.parentNode.insertBefore(extractedDivElement, node.nextSibling);
    AddRow(node, extractedDivElement)
    return extractedDivElement
}

export const AddRow = (node, extractedDivElement) => {
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

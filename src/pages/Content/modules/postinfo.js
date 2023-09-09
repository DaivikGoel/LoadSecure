import { vetMC, CommentPhoneNumber, vetEmail, vetDriverInspections, vetTruckInspections, vetPOBox } from "./vetting";

export const postinfo = (document, node, parseData, Comments, CarrierInfo) => {

    const extractedDivElement = document.createElement("div");
    extractedDivElement.classList.add("LoadSecureContainer");

    // Create the first row with a checkmark and text
    const MCResponse = vetMC(parseData['mcNumber']);
    if (MCResponse) {
        const firstRow = createRow(MCResponse.status, "MC Number " + MCResponse.message);
        extractedDivElement.appendChild(firstRow);
    }

    // Create the second row with a checkmark and text
    const CommentResponse = CommentPhoneNumber(parseData.phoneNumber, Comments);
    if (CommentResponse) {
        const secondRow = createRow(CommentResponse.status, CommentResponse.message);
        extractedDivElement.appendChild(secondRow);
    }

    const EmailResponse = vetEmail(parseData.emailAddress, Comments);
    if (EmailResponse) {
        const ThirdRow = createRow(EmailResponse.status, EmailResponse.message);
        extractedDivElement.appendChild(ThirdRow);
    }

    const DriverInspectionResponse = vetDriverInspections(CarrierInfo);
    if (DriverInspectionResponse) {
        const FourthRow = createRow(DriverInspectionResponse.status, DriverInspectionResponse.message);
        extractedDivElement.appendChild(FourthRow);
    }

    const TruckInspectionResponse = vetTruckInspections(CarrierInfo);
    if (TruckInspectionResponse) {
        const FifthRow = createRow(TruckInspectionResponse.status, TruckInspectionResponse.message);
        extractedDivElement.appendChild(FifthRow);
    }

    const POBoxResponse = vetPOBox(CarrierInfo);
    if (POBoxResponse) {
        const FifthRow = createRow(POBoxResponse.status, POBoxResponse.message);
        extractedDivElement.appendChild(FifthRow);
    }



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

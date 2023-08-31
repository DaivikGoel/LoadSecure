import { StatusEnum } from "./status";

const fetchCarrierInfo = async () => {
    const response = await fetch('https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number/807590/?webKey='); // add webkey to end
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson)
    // do something with myJson

    //make this in node or flask as an API to call

}

const newOrOldMC = (mcNumber) => {
    console.log("HERE")

    //look at the number and how new it is. If it is new thats a red flag
    if (mcNumber) {

        parseInt(mcNumber)

        // Check if MC number is greater than 1200000
        if (mcNumber > 1500000) {
            return {
                status: StatusEnum.NO,
                message: "The Carrier is new, can be extremely risky"
            }
            //show X stop with circle
        } else if (mcNumber > 1200000) {
            return {
                status: StatusEnum.WARNING,
                message: "The carrier is not that old, but still exercise caution "
            }
            //show triangle with exclamation mark
        }
        else {
            return {
                status: StatusEnum.OK,
                message: "The carrier is not new"
            }
            //show checkmark
        }
    } else {
        return {
            status: StatusEnum.NO,
            message: "Could not find the MC Number"
        }
    }
}

export const vetMC = (mcNumber) => {
    return newOrOldMC(mcNumber)
}


export const CommentPhoneNumber = (phonenumber, comment) => {

    // Sample text

    // Regular expression to capture phone numbers with or without extensions


    // Function to extract phone numbers and extensions


    // Extract phone numbers from the text
    const extractedPhoneNumberFromComment = extractPhoneNumbers(comment);
    const extractedPhoneNumberFromPost = extractPhoneNumbers(phonenumber);

    // Display extracted phone numbers
    console.log(extractedPhoneNumberFromComment, extractedPhoneNumberFromPost);
}

export function extractPhoneNumbers(phonenumber) {
    const phoneNumbers = [];
    let match;
    const phoneRegex = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})(?:\s*(?:ext|x)\s*(\d+))?/g;

    while ((match = phoneRegex.exec(text)) !== null) {
        const phoneNumber = match[1].replace(/[-.\s]/g, ''); // Remove separators
        const extension = match[2] || null; // Extension if present
        phoneNumbers.push({ phoneNumber, extension });
    }

    return phoneNumbers;
}
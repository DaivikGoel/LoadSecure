export function collectTextContent(node) {
    let content = '';
    if (node.nodeType === Node.TEXT_NODE) {
        content += node.textContent.trim() + ' ';
    }
    for (const childNode of node.childNodes) {
        content += collectTextContent(childNode);
    }
    return content;
}

export function makeKeyStringMatch(extractedText) {


    const pattern = /\d+[a-z\s–-]+([\s\S]+)/;
    const match = extractedText.match(pattern);

    if (match) {
        const extractedInfo = match[1].trim();
        return extractedInfo
    } else {
        console.log("String does not match the expected format.");
        return match
    }

}
export function extractPhoneNumbers(text) {

    const phoneNumberPattern = /\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/g;
    const matches = text.match(phoneNumberPattern);

    if (matches) {
        return matches[0].replace(/\D/g, '');
    }

    return null;
}


export function extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);

    if (match) {
        return match[0];
    }

    return null;
}


export function hasPOBox(address) {
    // Regular expression to match common PO Box formats
    const poBoxRegex = /P\.?\s?O\.?\s?Box|Post\s?Office\s?Box|PO\s?B\.?\s?|P\s?\.?\s?O\s?B\s?/i;

    // Test if the input address contains the PO Box pattern
    return poBoxRegex.test(address);
}
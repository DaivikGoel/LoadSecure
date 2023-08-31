function collectTextContent(node) {
    let content = '';
    if (node.nodeType === Node.TEXT_NODE) {
        content += node.textContent.trim() + ' ';
    }
    for (const childNode of node.childNodes) {
        content += collectTextContent(childNode);
    }
    return content;
}

module.exports = { collectTextContent };
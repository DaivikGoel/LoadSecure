import { parse } from './modules/parse';
import { vetMC } from './modules/vetting';

// Create a Mutation Observer instance
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            const addedNodes = mutation.addedNodes;
            for (const node of addedNodes) {
                if (node instanceof HTMLScriptElement && node.src === "https://maps.googleapis.com/maps-api-v3/api/js/54/2/common.js") {
                    // The specific script has been added to the DOM
                    observer.disconnect(); // Stop observing once the script is found
                    return;
                }
                if (node instanceof HTMLElement && node.classList.contains("row-cells")) {
                    console.log("Simulating click on the row...");
                    node.click();

                    console.log("Waiting for expanded content...");

                    // Add a timeout to wait for expanded content to fully load
                    setTimeout(() => {
                        const expandedContent = document.querySelector(".expanded-detail-row-tall");
                        if (expandedContent) {
                            console.log("Expanded content found:", expandedContent.textContent);

                            // Function to recursively collect text content from a node and its descendants
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

                            // Collect text content from the expanded section
                            const extractedText = collectTextContent(expandedContent);

                            // Log the extracted text to the console
                            console.log('Extracted Text:', extractedText);

                            // Split sections by keywords
                            const sections = splitSectionsByKeywords(extractedText);
                            const parsedtext = parse(sections)
                            console.log('Sections:', sections);


                        } else {
                            console.log("Expanded content not found.");
                        }
                    }, 1000); // Adjust the timeout duration as needed

                    break; // Exit the loop since we found the target element
                }
            }
        }
    }
});
vetMC()
// Start observing changes in the entire document's subtree
observer.observe(document, { childList: true, subtree: true });

function splitSectionsByKeywords(text) {
    const keywords = [
        'TRIP',
        'EQUIPMENT',
        'COMMENTS',
        'MINIMUM RATE',
        'MARKET RATES',
        'COMPANY VIEW IN DIRECTORY'
    ];

    const pattern = new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'i');
    const sections = text.split(pattern).map(section => section.trim());

    const result = {};
    for (let i = 1; i < sections.length; i++) {
        if (i - 1 < keywords.length) {
            result[keywords[i - 1]] = sections[i];
        } else {
            result.undefined = result.undefined ? result.undefined + sections[i] : sections[i];
        }
    }

    return result;
}

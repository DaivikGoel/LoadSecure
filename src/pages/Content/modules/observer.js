import { parse, splitSectionsByKeywords } from './parse';
import { collectTextContent } from './extractor';
import { postinfo } from './postinfo';

// Create a Mutation Observer instance
export const NodeObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            const addedNodes = mutation.addedNodes;
            for (const node of addedNodes) {
                if (node instanceof HTMLScriptElement && node.src === "https://maps.googleapis.com/maps-api-v3/api/js/54/2/common.js") {
                    // The specific script has been added to the DOM
                    NodeObserver.disconnect(); // Stop observing once the script is found
                    return;
                }
                if (node instanceof HTMLElement && node.classList.contains("row-cells")) {
                    console.log("Simulating click on the row...");
                    node.click();
                }
            }
        }
    }
});

// Observe changes in the document
NodeObserver.observe(document, { childList: true, subtree: true });

// Function to start the process
function startProcess() {

    const rowContainers = document.querySelectorAll(".row-cells");
    console.log("ROW CONTAINERS", rowContainers)
    if (rowContainers.length > 0) {
        processRow(rowContainers, 0);
    } else {
        console.log("No row containers found.");
    }
}

// Function to process each row container
function processRow(rowContainers, index) {
    if (index < rowContainers.length) {
        const rowContainer = rowContainers[index];
        console.log("Simulating click on the row...");
        rowContainer.click();
        console.log("ROW CONTAINER 1", rowContainer)
        // Add a timeout to wait for expanded content to fully load
        setTimeout(() => {
            const expandedContent = document.querySelector(".table-row-detail");
            if (expandedContent) {
                // Collect text content from the expanded section
                const extractedText = collectTextContent(expandedContent);

                // Log the extracted text to the console
                console.log('Extracted Text:', extractedText);

                // Split sections by keywords
                const sections = splitSectionsByKeywords(extractedText);
                const parsedData = parse(sections);

                // Post information for this row
                postinfo(document, rowContainer, parsedData);

                // Move to the next row container
                processRow(rowContainers, index + 1);
            } else {
                console.log("Expanded content not found.");
                // Move to the next row container
                processRow(rowContainers, index + 1);
            }
        }, 100); // Adjust the timeout duration as needed
    } else {
        console.log("All rows processed.");
    }
}

// Start the process
setTimeout(() => { startProcess() }, 10000)

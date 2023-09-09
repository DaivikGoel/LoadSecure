// Import your helper functions and libraries as needed
import { parse, splitSectionsByKeywords, getMCData } from './parse';
import { collectTextContent } from './extractor';
import { postinfo } from './postinfo';

// Create a Set to keep track of processed row containers
const processedRowContainers = new Set();

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
                    // New row-cells element added, process it if not processed
                    if (!processedRowContainers.has(node)) {
                        node.click();
                    }
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

    if (rowContainers.length > 0) {
        // Filter out the unprocessed row containers
        const unprocessedContainers = Array.from(rowContainers).filter((container) => !processedRowContainers.has(container));
        processRow(unprocessedContainers, 0);
    } else {
        console.log("No row containers found.");
    }
}

// Function to process each row container
async function processRow(rowContainers, index) {
    if (index < rowContainers.length) {
        const rowContainer = rowContainers[index];

        // Add the row container to the set of processed containers
        processedRowContainers.add(rowContainer);

        rowContainer.click();

        // Add a timeout to wait for expanded content to fully load
        setTimeout(async () => { // Make the function asynchronous
            const expandedContent = document.querySelector(".table-row-detail");
            if (expandedContent) {
                // Collect text content from the expanded section
                const extractedText = collectTextContent(expandedContent);

                // Log the extracted text to the console

                // Split sections by keywords
                const sections = splitSectionsByKeywords(extractedText);
                const parsedData = parse(sections);

                // Get CarrierInfo asynchronously
                const CarrierInfo = await getMCData(parsedData['mcNumber']);
                console.log("CARRIER INFO", CarrierInfo);

                // Post information for this row
                postinfo(document, rowContainer, parsedData, sections['COMMENTS'], CarrierInfo);

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

// Start the process initially
//startProcess();

// Run startProcess every 10 seconds
setInterval(startProcess, 10000);

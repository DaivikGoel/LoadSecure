// Import your helper functions and libraries as needed
import { parse, splitSectionsByKeywords, getMCData } from './parse';
import { collectTextContent, makeKeyStringMatch } from './extractor';
import { postinfo, AddRow } from './postinfo';

// Create a Set to keep track of processed row containers
const processedRowContainers = {}

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
        // Remove div elements with class "LoadSecureContainer"
        const filteredRowContainers = Array.from(rowContainers).filter((container) =>
            !container.classList.contains("LoadSecureContainer")
        );

        processRow(filteredRowContainers, 0);
    } else {
        console.log("No row containers found.");
    }
}

// Function to process each row container
async function processRow(rowContainers, index) {
    if (index < rowContainers.length) {
        const rowContainer = rowContainers[index];
        const extractText = collectTextContent(rowContainer)
        const ContainerKeyString = makeKeyStringMatch(extractText)

        // Check if the row container is already processed
        if (ContainerKeyString in processedRowContainers) {
            // Move to the next row container
            const extractedDivElement = processedRowContainers[ContainerKeyString]
            if (extractedDivElement != null) {
                AddRow(rowContainer, extractedDivElement)
            }
            processRow(rowContainers, index + 1);
            return;
        }
        // Add the row container to the set of processed containers
        processedRowContainers[ContainerKeyString] = null

        rowContainer.click();

        // Add a timeout to wait for expanded content to fully load
        setTimeout(async () => { // Make the function asynchronous
            // Wait until a div with class "city-spacing" containing "MC#" appears
            const waitForMCNumber = async () => {
                const expandedContent = document.querySelector(".table-row-detail");
                if (expandedContent) {
                    const mcNumberElement = expandedContent.querySelector(".city-spacing");
                    if (mcNumberElement && mcNumberElement.textContent.includes("MC#")) {
                        // MC number found, proceed with processing
                        const extractedText = collectTextContent(expandedContent);
                        const sections = splitSectionsByKeywords(extractedText);
                        const parsedData = parse(sections);
                        const CarrierInfo = await getMCData(parsedData['mcNumber']);
                        const newLoadContainer = postinfo(document, rowContainer, parsedData, sections['COMMENTS'], CarrierInfo);
                        processedRowContainers[ContainerKeyString] = newLoadContainer
                        processRow(rowContainers, index + 1);
                    } else {
                        // MC number not found, wait and check again
                        setTimeout(waitForMCNumber, 100); // Adjust the polling interval as needed
                    }
                } else {
                    console.log("Expanded content not found.");
                    // Move to the next row container
                    processRow(rowContainers, index + 1);
                }
            };

            // Start waiting for the MC number within this row
            waitForMCNumber();
        }, 100); // Adjust the timeout duration as needed
    } else {
        console.log("All rows processed.");
    }
}

// Create a refresh button element
const refreshButton = document.createElement('button');
refreshButton.innerHTML = '🔄'; // Refresh emoji
refreshButton.style.position = 'fixed'; // Set the position to fixed for floating
refreshButton.style.bottom = '20px'; // Adjust the button's position as needed
refreshButton.style.right = '20px'; // Adjust the button's position as needed
refreshButton.style.zIndex = '9999'; // Ensure it's above other elements
refreshButton.style.cursor = 'pointer'; // Set the cursor style

// Apply styles to make it a blue circle with animation
refreshButton.style.width = '50px'; // Adjust the size as needed
refreshButton.style.height = '50px'; // Adjust the size as needed
refreshButton.style.backgroundColor = 'blue'; // Set the background color to blue
refreshButton.style.borderRadius = '50%'; // Make it a circle
refreshButton.style.transition = 'transform 0.3s ease-in-out'; // Smooth transform animation

// Add a click event listener to the refresh button
refreshButton.addEventListener('click', () => {
    // Add a simple rotation animation on click
    refreshButton.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        refreshButton.style.transform = 'rotate(0deg)';
        // Call the startProcess function to refresh the content here
        startProcess();
    }, 300); // Adjust the animation duration as needed
});

// Append the button to the document body
document.body.appendChild(refreshButton);

// Start the process initially
//startProcess();

// Run startProcess every 10 seconds
//setInterval(startProcess, 10000);

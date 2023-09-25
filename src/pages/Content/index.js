// contentScript.js
import { NodeObserver } from './PostVetting/modules/observer';
import { loadcreator } from './BidCreation/loadcreator';
// Check the URL of the current page
const currentUrl = window.location.href;

if (currentUrl.startsWith("https://one.dat.com/search-trucks-ow")) {
    // Perform behavior for the first URL
    // Import any necessary modules here


    // Start observing changes in the entire document's subtree
    NodeObserver.observe(document, { childList: true, subtree: true });

    // Your specific behavior for the first URL goes here
} else if (currentUrl === "https://one.dat.com/my-shipments/forms/new-shipment") {

    console.log("HERE")
    loadcreator()

    // Perform behavior for the second URL
    // Your specific behavior for the second URL goes here
}

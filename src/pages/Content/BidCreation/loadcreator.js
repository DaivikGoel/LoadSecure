import { createShipment } from "./helper/shipmentcreator";

export const loadcreator = () => {
    const userid = 1; // Replace with the actual user ID if needed

    // Flag to track if the click event listener has been added
    var clickEventListenerAdded = false;

    // Flag to track if the default behavior should be executed
    var executeDefaultBehavior = true;

    // Variable to store the shipment ID
    var shipmentid = null;

    // content.js
    function addClickListenerToButton() {
        var button = document.getElementById("shipment-submit-button");

        if (button && !clickEventListenerAdded) {
            button.addEventListener("click", async function (event) {
                event.preventDefault();

                var inputData = getLoadDetails();
                console.log('INPUT DATA', inputData);

                try {
                    // Fetch the shipment ID only if it's not already retrieved
                    if (shipmentid === null) {
                        shipmentid = await createShipment(userid);
                        console.log('Shipment ID:', shipmentid);
                    }

                    // Once you have the shipment ID, you can proceed with your logic here
                    // For example, send the API call to the database with the shipment ID

                    if (executeDefaultBehavior) {
                        var initialPageUrl = window.location.href;
                        console.log('DEFAULT');
                        button.click();

                        setTimeout(function () {
                            var finalPageUrl = window.location.href;
                            if (finalPageUrl === initialPageUrl) {
                                console.log('Unsuccessful submission. Page URL did not change.');
                                // Handle unsuccessful submission here
                            } else {
                                console.log('Successful submission. Redirected to:', finalPageUrl);
                                // Handle successful submission here
                            }
                        }, 5000);
                    }
                } catch (error) {
                    // Handle any errors that occurred during shipment creation
                    console.error('Error creating shipment:', error);
                }
            });

            // Set the flag to true to indicate that the event listener has been added
            clickEventListenerAdded = true;
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === "childList") {
                // Check if the button with the specified ID has been added to the DOM
                if (mutation.addedNodes.length > 0) {
                    console.log("The button has been added");
                    addClickListenerToButton();
                }
            }
        }
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Call the function once in case the button is already present
    addClickListenerToButton();
}

function getLoadDetails() {
    // Assuming you have a reference to the <mat-expansion-panel> element
    var expansionPanel = document.getElementById('accordion-load-details');

    // Initialize an empty object to store the input data
    var inputData = {};

    // Check if the expansionPanel is not null
    if (expansionPanel) {
        // Get all the input elements within the expansion panel
        var inputElements = expansionPanel.querySelectorAll('input[formcontrolname]');

        // Loop through the input elements and retrieve their information and names
        inputElements.forEach(function (inputElement) {
            var inputName = inputElement.getAttribute('formcontrolname');
            var inputValue = inputElement.value;

            if (inputName == 'locationInput') {
                if (!inputData.hasOwnProperty("Origin")) {
                    inputData["origin"] = inputValue;
                }
                else {
                    inputData["destination"] = inputValue;
                }
            }
            else {
                inputData[inputName] = inputValue;
            }
        });
    } else {
        console.log('Expansion Panel not found.');
    }

    return inputData;

    // If you want to return the JSON data instead of logging it, you can do this:
    // return jsonData;
}

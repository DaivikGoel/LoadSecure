import { apiurl } from "../../../../environment/config";

export const updateShipment = (userid, inputData) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentid: shipmentid, ...inputData }) // Spread inputData into the JSON object
    };

    return fetch(apiurl + 'createload', requestOptions)
        .then(async (response) => {
            if (response.status == 404) {
                console.log('There has been an internal database updating the Shipment')
                return false;
            } else if (response.status == 200) {
                console.log('Successfully updated Shipment');
            }
        });
}

export const createShipment = (userid) => {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid: userid })
        };

        fetch(apiurl + 'createshipment', requestOptions)
            .then(async (response) => {
                if (response.status === 500) {
                    console.error('There has been an error creating the shipment');
                    reject('Error creating shipment');
                } else if (response.status === 200) {
                    // Assuming the server returns the new shipment ID as a JSON response
                    return response.json();
                } else {
                    reject('Unexpected response status: ' + response.status);
                }
            })
            .then(data => {
                if (data && data.newId) {
                    console.log('Successfully created shipment with ID: ' + data.newId);
                    resolve(data.newId); // Resolve the Promise with the new shipment ID
                } else {
                    console.error('Failed to retrieve the new shipment ID from the response');
                    reject('Error creating shipment');
                }
            })
            .catch(error => {
                console.error(error);
                reject('Error creating shipment');
            });
    });
}


const fetchCarrierInfo = async () => {
    const response = await fetch('https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number/807590/?webKey='); // add webkey to end
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson)
    // do something with myJson

    //make this in node or flask as an API to call

}

const newOrOldMC = (mcNumber) => {

    console.log("LOL")
}

function vetMC(mcNumber) {
    console.log("LOL")
}

module.exports = { vetMC };
const { extractPhoneNumbers } = require("./extractor");
import { apiurl } from "../../../environment/config";

export function parse(list) {
  const text = list['undefined'];

  // Regular expressions for matching company name, phone number, email address, and MC number
  const companyNameRegex = /^(.*?)\s+\(/;
  const phoneNumberRegex = /\((\d{3})\) (\d{3}-\d{4})/;
  const mcNumberRegex = /MC#(\d+)/;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

  // Extract company name
  const companyNameMatches = text.match(companyNameRegex);
  const companyName = companyNameMatches ? companyNameMatches[1] : '';

  // Extract phone number
  const phoneNumberMatches = text.match(phoneNumberRegex);
  const areaCode = phoneNumberMatches ? phoneNumberMatches[1] : '';
  const phoneNumber = phoneNumberMatches ? phoneNumberMatches[2].replace(/\D/g, '') : '';

  // Extract email address
  const emailMatches = text.match(emailRegex);
  const emailAddress = emailMatches ? emailMatches[0] : '';

  // Extract MC number and remove spaces
  const mcNumberMatches = text.match(mcNumberRegex);
  const mcNumber = mcNumberMatches ? parseInt(mcNumberMatches[1].replace(/\s/g, '')) : 0;

  console.log("Company Name:", companyName);
  console.log("Phone Number:", areaCode && phoneNumber ? `${areaCode}${phoneNumber}` : '');
  console.log("Email Address:", emailAddress);
  console.log("MC Number:", mcNumber);

  const parsedData = {
    companyName: companyName,
    phoneNumber: areaCode && phoneNumber ? `${areaCode}${phoneNumber}` : '',
    emailAddress: emailAddress,
    mcNumber: mcNumber
  };

  return parsedData;
}



export function splitSectionsByKeywords(text) {
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

export async function getMCData(mcNumber) {

  if (!mcNumber || mcNumber === 0) {
    // Handle the case where MC number is missing or blank
    return null; // You can return an appropriate value, like null or an empty object
  }

  const apiUrl = apiurl + 'fetchcarrierinfo' + `/${mcNumber}`; // Modify the URL to match your API endpoint

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch data from the API');
    }

    const responseData = await response.json();
    console.log("CARRIER INFO", responseData.content[0].carrier)
    return responseData.content[0].carrier;

  } catch (error) {
    console.error('Error fetching MC data:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

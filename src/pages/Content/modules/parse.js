

function parse(list) {
  const text = list['undefined']

  // Regular expressions for matching company name, phone number, and MC number
  const companyNameRegex = /^(.*?)\s+\(/;
  const phoneNumberRegex = /\((\d{3})\) (\d{3}-\d{4})/;
  const mcNumberRegex = /MC#(\d+)/;

  // Extract company name
  const companyNameMatches = text.match(companyNameRegex);
  const companyName = companyNameMatches ? companyNameMatches[1] : '';

  // Extract phone number
  const phoneNumberMatches = text.match(phoneNumberRegex);
  const areaCode = phoneNumberMatches ? phoneNumberMatches[1] : '';
  const phoneNumber = phoneNumberMatches ? phoneNumberMatches[2] : '';

  // Extract MC number
  const mcNumberMatches = text.match(mcNumberRegex);
  const mcNumber = mcNumberMatches ? mcNumberMatches[1] : '';

  console.log("Company Name:", companyName);
  console.log("Phone Number:", areaCode && phoneNumber ? `(${areaCode}) ${phoneNumber}` : '');
  console.log("MC Number:", mcNumber);

}

module.exports = { parse };
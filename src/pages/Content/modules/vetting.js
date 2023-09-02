import { StatusEnum } from "./status";
import { extractPhoneNumbers, extractEmail, hasPOBox } from "./extractor";


const newOrOldMC = (mcNumber) => {
    //look at the number and how new it is. If it is new thats a red flag
    if (mcNumber) {

        parseInt(mcNumber)

        // Check if MC number is greater than 1200000
        if (mcNumber > 1500000) {
            return {
                status: StatusEnum.NO,
                message: "The Carrier is new, can be extremely risky"
            }
            //show X stop with circle
        } else if (mcNumber > 1200000) {
            return {
                status: StatusEnum.WARNING,
                message: "The carrier is not that old, but still exercise caution "
            }
            //show triangle with exclamation mark
        }
        else {
            return {
                status: StatusEnum.OK,
                message: "The carrier is not new"
            }
            //show checkmark
        }
    } else {
        return {
            status: StatusEnum.NO,
            message: "Could not find the MC Number"
        }
    }
}

export const vetMC = (mcNumber) => {
    return newOrOldMC(mcNumber)
}


export const CommentPhoneNumber = (phonenumber, comment) => {

    // Extract phone numbers from the text
    const extractedPhoneNumberFromComment = extractPhoneNumbers(comment);


    if (extractedPhoneNumberFromComment == null || extractedPhoneNumberFromComment == "") {
        return {
            status: StatusEnum.OK,
            message: "There is no number in the comments"
        }
    }
    else if (extractedPhoneNumberFromComment == phonenumber) {
        return {
            status: StatusEnum.OK,
            message: "The number in the comment matches the number in the comment"
        }
    }
    else if (extractedPhoneNumberFromComment && (phonenumber == null || phonenumber == "")) {
        return {
            status: StatusEnum.WARNING,
            message: "There is no official number from DOT, but a number is given in the comments"
        }
    }
    else if (extractedPhoneNumberFromComment != phonenumber) {
        return {
            status: StatusEnum.NO,
            message: "The number in the comment does not match the official number!"
        }
    }

}


export const vetEmail = (email, comment) => {
    const freeDomains = [
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
        "aol.com", "icloud.com", "live.com", "msn.com",
        "mail.com", "zoho.com", "protonmail.com", "yandex.com",
        "gmx.com", "inbox.com", "rocketmail.com", "aim.com",
        "me.com", "fastmail.com", "tutanota.com", "mailinator.com",
        "rediffmail.com", "cox.net", "verizon.net", "bellsouth.net"
        // Add more domains as needed
    ];

    const emailincomment = extractEmail(comment)


    if ((email == "" || email == null) && emailincomment == null) {
        return {
            status: StatusEnum.NOINFO,
            message: "No email was provided"
        }
    }

    const domain = email.split("@")[1];

    if ((email == "" || email == null) && emailincomment != null) {
        const domainofcomment = emailincomment.split("@")[1];

        if (freeDomains.includes(domainofcomment)) {
            return {
                status: StatusEnum.NO,
                message: "There is no official email. The email in the comment is a free domain"
            }
        }
        else {
            return {
                status: StatusEnum.WARNING,
                message: "The email in the comment is likely a company email, but there is no official email."
            }
        }


    }

    if (emailincomment != null && email != emailincomment) {
        return {
            status: StatusEnum.NO,
            message: "Email in comment does not match official email! "
        }
    }

    if (emailincomment != null && email != emailincomment) {
        return {
            status: StatusEnum.NO,
            message: "Email in comment does not match official email! "
        }
    }

    if (freeDomains.includes(domain)) {
        return {
            status: StatusEnum.WARNING,
            message: "The email is not a company email. Proceed with Caution"
        }
    }
    else {
        return {
            status: StatusEnum.OK,
            message: "The email is likely a company email"
        }
    }

}




export const vetDriverInspections = (CarrierInfo) => {
    if (!CarrierInfo) {
        return {
            status: StatusEnum.NO,
            message: "No carrier information available"
        };
    }

    const DriverToInspectionRatio = CarrierInfo.driverInsp / CarrierInfo.totalDrivers;
    const DriverOosRatetoNationalAverage = CarrierInfo.driverOosRateNationalAverage / CarrierInfo.driverOosRate;

    if (DriverOosRatetoNationalAverage < 1.5) {
        return {
            status: StatusEnum.NO,
            message: "The driver out of service rate is very high and almost above the national average"
        };
    }

    if (DriverToInspectionRatio < 0.4) {
        return {
            status: StatusEnum.NO,
            message: "There have significantly fewer inspections per year compared to the drivers operating"
        };
    }

    if (DriverToInspectionRatio > 0.4 && DriverToInspectionRatio < 0.5) {
        return {
            status: StatusEnum.WARNING,
            message: "The Driver to Inspection Ratio is almost equal but be careful"
        };
    }

    if (DriverToInspectionRatio >= 0.5) {
        return {
            status: StatusEnum.OK,
            message: "The Driver to Inspections Ratio is higher than 1 to 1"
        };
    }
    return {
        status: StatusEnum.NO,
        message: "No evaluation possible"
    };
};

export const vetTruckInspections = (CarrierInfo) => {
    if (!CarrierInfo) {
        return {
            status: StatusEnum.NO,
            message: "No carrier information available"
        };
    }

    const TruckToInspectionRatio = CarrierInfo.vehicleInsp / CarrierInfo.totalPowerUnits;
    const TruckOosRatetoNationalAverage = CarrierInfo.vehicleOosRateNationalAverage / CarrierInfo.vehicleOosRate;

    if (TruckOosRatetoNationalAverage < 1.5) {
        return {
            status: StatusEnum.NO,
            message: "The truck out of service rate is very high and almost above the national average"
        };
    }

    if (TruckToInspectionRatio < 0.4) {
        return {
            status: StatusEnum.NO,
            message: "There have significantly fewer inspections per year compared to the trucks operating"
        };
    }

    if (TruckToInspectionRatio > 0.4 && TruckToInspectionRatio < 0.5) {
        return {
            status: StatusEnum.WARNING,
            message: "The Truck to Inspection Ratio is almost equal but be careful"
        };
    }

    if (TruckToInspectionRatio >= 0.5) {
        return {
            status: StatusEnum.OK,
            message: "The Truck to Inspections Ratio is higher than 1 to 1"
        };
    }
    return {
        status: StatusEnum.NO,
        message: "No evaluation possible"
    };
};


export const vetPOBox = (CarrierInfo) => {

    if (!CarrierInfo) {
        return {
            status: StatusEnum.NO,
            message: "No carrier information available"
        };
    }

    if (hasPOBox(CarrierInfo.phyStreet)) {
        return {
            status: StatusEnum.WARNING,
            message: "The address has a PO Box. This can be risky"
        };
    }
    else {
        return null
    }
};
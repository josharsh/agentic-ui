import { CaseStage } from "@/constants";
import { BadgeColors } from "@/constants/config";
import moment from "moment-timezone";


export const toLocalTime = (date: string) => {
  return moment.utc(date).tz("Asia/Jakarta").format("HH:mm:ss, DD MMM YYYY");
};

export const preprocessSearchTerm = (term: string) => {
    return term.replace(/\s+/g, "").toLowerCase();
};

export const getStageBadgeColor = (stage: string) => {
    switch(stage){
        case CaseStage.DRAFT:
            return BadgeColors["amber"];
        case CaseStage.UNDER_REVIEW_WITH_BROKER:
            return BadgeColors["yellow"];
        case CaseStage.UNDER_REVIEW_WITH_INSURER:
            return BadgeColors["orange"];
        case CaseStage.ENQUIRY_BY_BROKER:  
            return BadgeColors["pink"];
        case CaseStage.ENQUIRY_BY_INSURER:
            return BadgeColors["pink"];
        case CaseStage.APPROVED:
            return BadgeColors["green"];
        case CaseStage.REJECTED:
            return BadgeColors["red"];
        default:
            return BadgeColors["gray"]
    }
}

export const getSessionRemarkBadgeColor  = (stage: string) => {
    switch(stage){
        case "VALID": return BadgeColors["green"];
        case "INVALID": return BadgeColors["red"];
        default: return BadgeColors["gray"];
    }
}
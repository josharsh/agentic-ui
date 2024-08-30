export const MIN_GREEN_SCORE = 0.8;
export const MIN_YELLOW_SCORE = 0.4;

export const FILES_ALWAYS_REQUIRED = ["front", "left", "back", "right"];

export const CaseStage = Object.freeze({
    DRAFT: "DRAFT",
    UNDER_REVIEW_WITH_BROKER: "UNDER_REVIEW_WITH_BROKER",
    UNDER_REVIEW_WITH_INSURER: "UNDER_REVIEW_WITH_INSURER",
    ENQUIRY_BY_BROKER: "ENQUIRY_BY_BROKER",
    ENQUIRY_BY_INSURER: "ENQUIRY_BY_INSURER",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
  });
  
export const INSURER_STAGES = [
    CaseStage.UNDER_REVIEW_WITH_INSURER.toString(),
    CaseStage.APPROVED.toString(),
    CaseStage.REJECTED.toString(),
    // CaseStage.ENQUIRY_BY_INSURER.toString()
  ];
  
export const formatSessionStage = (stage)=>{
    switch(stage){ 
        case SessionStage.DRAFT:
            return "Draft";
        case SessionStage.VALID:
            return "Valid";
        case SessionStage.INVALID:
            return "Invalid";
        case SessionStage.DOCUMENTS_SUBMITTED:
            return "Documents Submitted";
        default:
            return "Unknown";
}
}
export const formatCaseStage = (stage)=>{
    switch(stage){
        case CaseStage.DRAFT:
            return "Draft";
        case CaseStage.UNDER_REVIEW_WITH_BROKER:
            return "Under Review with Broker";
        case CaseStage.UNDER_REVIEW_WITH_INSURER:
            return "Under Review with Insurer";
        case CaseStage.ENQUIRY_BY_BROKER:  
            return "Enquiry by Broker";
        case CaseStage.ENQUIRY_BY_INSURER:
            return "Enquiry by Insurer";
        case CaseStage.APPROVED:
            return "Approved";
        case CaseStage.REJECTED:
            return "Rejected";
        default:
            return "Unknown";
    }
  }
  
  export const SessionStage = Object.freeze({
    DRAFT: "DRAFT",
    VALID: "VALID",
    INVALID: "INVALID",
    DOCUMENTS_SUBMITTED: "DOCUMENTS_SUBMITTED"
  })

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import th from "../locales/th.json"
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Toggle Theme": "Toggle Theme",
      Continue: "Continue",
      Dashboard: "Dashboard",
      Home: "Home",
      "Log Out": "Log Out",
      "Plate Number": "Plate Number",
      Status: "Status",
      All: "All",
      "insurer enquiry": "Insurer Enquiry",
      "your enquiry": "Enquired by You",
      "enquired by you": "Enquiry by Broker",
      "under review with insurer": "Under review with insurer",
      "under review with broker": "Under review with broker",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      approve: "Approve",
      reject: "Reject",
      "Search Case": "Search Case",
      "Last 7 Days": "Last 7 Days",
      "Last 30 days": "Last 30 Days",
      "Vehicle Details": "Vehicle Details",
      "Customer Name": "Customer Name",
      "Agent Name": "Agent Name",
      "Capturing Date": "Capturing Date",
      Actions: "Actions",
      Next: "Next",
      Previous: "Previous",
      Cancel: "Cancel",
      Loading: "Loading",
      "Inspection Details": "Inspection Details",
      Email: "Email",
      Password: "Password",
      "Sign In": "Sign In",
      Remarks: "Remarks",
      Make: "Make",
      Model: "Model",
      Series: "Series",
      CC: "CC",
      Year: "Year",
      "Welcome Back": "Welcome Back",
      "Sign in to Agentic UI": "Sign in to Agentic UI",
      "Incorrect email or password": "Incorrect email or password",
      "No case according to the filters ": "No case according to the filters ",
      "Please try to change or reset the current filter":
        "Please try to change or reset the current filter",
      "Reset Filter": "Reset Filter",
      "Search Results not found": "Search Results not found",
      "Try to search with another keyword. For now the system accepts the following parameters: plate number, vehicle details, customer name, and agent name.":
        "Try to search with another keyword. For now the system accepts the following parameters: plate number, vehicle details, customer name, and agent name.",
      "Clear Search": "Clear Search",
      "Session ID": "Session ID",
      "Inspection Photos": "Inspection Photos",
      Inspected: "Inspected",
      Verdict: "Verdict",
      Passed: "Passed",
      Failed: "Failed",
      "Yes, Approve": "Yes, Approve",
      "Approve Session ?": "Approve Session ?",
      'The status of this session will be updated to "Approved", you will not be able to undo this action.':
        'The status of this session will be updated to "Approved", you will not be able to undo this action.',
      "Reject Session ?": "Reject Session ?",
      '\'The status of this session will be updated to "Rejected", you will not be able to undo this action.':
        '\'The status of this session will be updated to "Rejected", you will not be able to undo this action.',
      "Approve Inspection ?": "Approve Inspection ?",
      'The status of this inspection will be updated to "Approved", you will not be able to undo this action.':
        'The status of this inspection will be updated to "Approved", you will not be able to undo this action.',
      "Reject Inspection ?": "Reject Inspection ?",
      '\'The status of this inspection will be updated to "Rejected", you will not be able to undo this action.':
        '\'The status of this inspection will be updated to "Rejected", you will not be able to undo this action.',
      "Load More": "Load More",
      "See More": "See More",
      "Inspection Copilot Recommendation": "Inspection Copilot Recommendation",
      Result: "Result",
      Reason: "Reason",
      Score: "Score",
      Close: "Close",
      Configure: "Configure",
      "Add User": "Add User",
      Configuration: "Configuration",
      Image: "Image",
      "Inspection Requirements": "Inspection Requirements",
      Save: "Save",
      Description: "Description",
      Required: "Required",
      Mandatory: "Mandatory",
      accepted: "Accepted",
      "Documents Requirements": "Documents Requirements",
      Document: "Document",
      "Documents Requirements(for guidelines)":
        "Documents Requirements(for guidelines)",
      "AI Auto Inspector": "AI Auto Inspector",
      "Invalid Link": "Invalid Link",
      "All Time": "All Time",
    },
  },
  th: {
    translation: th,
  },
  fr: {
    translation: {
      "Toggle Theme": "Basculer le thème",
      Continue: "Continuer",
      Dashboard: "Dashboard",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

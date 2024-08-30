import { API_URL } from "../constants/config";

const apiEndpoints = {
  sessionStatus: API_URL + "api/authenticated-session-info",
  taggedFile: API_URL + "api/tagged_file",
  getToken: API_URL + "api/token",
  caseInfo: API_URL + "api/cases",
  session: API_URL + "api/session",
  case: API_URL + "api/cases",
  prompt: API_URL + "api/prompt",
  promptOrganizationMapping: API_URL + "api/link-prompt-to-organization",
  user: API_URL + "api/user",
  inviteUser: API_URL + "api/users",
  document: API_URL + "api/document",
  documentOrganizationMapping: API_URL + "api/link-document-to-organization",
  organizationUsers: API_URL + "api/organization/users",
  sessionStage: API_URL + "api/session/stage",
  fileRemark: API_URL + "api/tagged_file"
};

export default apiEndpoints;

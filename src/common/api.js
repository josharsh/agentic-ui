import axios from "axios";
import Qs from "qs";
import apiEndpoints from "./apiEndpoints";

/**
 * Safely retrieves the access token from localStorage.
 * @returns {string|null} The access token, or null if not found.
 */
export function getAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    const userData = localStorage.getItem("user_data");
    if (!userData) return null;
    const parsed = JSON.parse(userData);
    return parsed?.access_token || null;
  } catch {
    return null;
  }
}

const api = {
  session: {
    sessionStatus: (id) =>
      axios.get(`${apiEndpoints.sessionStatus}/${id}`).then((res) => res.data),

    updateFileRemark: (fileId, params) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios
        .patch(`${apiEndpoints.fileRemark}/${fileId}/remark`, params, config);
    },

    deleteTaggedFile: (id) =>
      axios
        .patch(`${apiEndpoints.taggedFile}/${id}/delete`)
        .then((res) => res.data),

    getToken: (params) =>
      axios
        .post(
          apiEndpoints.getToken,
          { ...params },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => res.data),

    getReportsData: (params) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        params,
        paramsSerializer: function (params) {
          return Qs.stringify(params, { indices: false });
        },
      };
      return axios.get(apiEndpoints.caseInfo, config).then((res) => res.data);
    },

    getSessions: (params) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        params,
        paramsSerializer: function (params) {
          return Qs.stringify(params, { indices: false });
        },
      };
      return axios.get(apiEndpoints.caseInfo, config).then((res) => res.data);
    },
    getSession: (id) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios
        .get(`${apiEndpoints.sessionStatus}/${id}`, config)
        .then((res) => res.data);
    },

    patchFile: (params, id) =>
      axios
        .patch(`${apiEndpoints.taggedFile}/${id}`, params)
        .then((res) => res.data),

    patchSessionStatus: (params, id) =>
      axios
        .patch(`${apiEndpoints.session}/${id}`, params)
        .then((res) => res.data),

    patchCase: (params, id) =>
      axios.patch(`${apiEndpoints.case}/${id}`, params).then((res) => res.data),

    getPromptDetails: () => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios.get(apiEndpoints.prompt, config).then((res) => res.data);
    },
    getOrganizationUsers: () => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios.get(apiEndpoints.organizationUsers, config).then((res) => res.data);
    },
    inviteUser: (params) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios.post(apiEndpoints.inviteUser, params, config).then((res) => res.data);
    },
    getUserDetails: () => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios.get(apiEndpoints.user, config).then((res) => res.data)
        .catch((err) => { console.error(err); return err; });
    },
    getDocumentsDetails: () => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios.get(apiEndpoints.document, config).then((res) => res.data);
    },

    linkPromptsToOrg: (params, id) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios
        .post(`${apiEndpoints.promptOrganizationMapping}`, params, config)
        .then((res) => res.data);
    },

    linkDocumentsToOrg: (params) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios
        .post(`${apiEndpoints.documentOrganizationMapping}`, params, config)
        .then((res) => res.data);
    },
    updateSessionStatus: (id, params) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios
        .post(`${apiEndpoints.sessionStage}?session_id=${id}`, params, config)
        .then((res) => res.data);
    },

    updateCaseStage: (id, params) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      };
      return axios
        .post(`${apiEndpoints.case}/stage?case_id=${id}`, params, config)
        .then((res) => res.data);
    },
  },
};

export default api;

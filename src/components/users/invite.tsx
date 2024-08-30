import React, { useState } from "react";
import api from "@/common/api";
import { useTranslation } from "react-i18next";
import { Mail, User, Lock, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";

interface InviteUserProps {
  onSuccess?: () => void;
}

function InviteUser({ onSuccess }: InviteUserProps) {
  const [formData, setFormData] = useState({
    email: "",
    role: "user",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [inviting, setInviting] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await api.session.inviteUser(formData);
      toast.success(t("User invited successfully!"));
      setFormData({
        email: "",
        role: "user",
        first_name: "",
        last_name: "",
        password: "",
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to invite user. Please try again."));
    } finally {
      setInviting(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            {t("First Name")}
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="first_name"
              id="first_name"
              className="focus:ring-rose-500 focus:border-rose-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
              placeholder={t("Enter first name")}
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            {t("Last Name")}
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="focus:ring-rose-500 focus:border-rose-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
              placeholder={t("Enter last name")}
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t("Email")}
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            className="focus:ring-rose-500 focus:border-rose-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
            placeholder={t("Enter email address")}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t("Password")}
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="password"
            name="password"
            id="password"
            className="focus:ring-rose-500 focus:border-rose-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
            placeholder={t("Enter password")}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          {t("Role")}
        </label>
        <select
          id="role"
          name="role"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md h-10"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">{t("User")}</option>
          <option value="admin">{t("Admin")}</option>
        </select>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={inviting}
          className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 w-40 h-10"
        >
          {inviting ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <UserPlus className="h-5 w-5 mr-2" aria-hidden="true" />
          )}
          {inviting ? t("Inviting...") : t("Invite User")}
        </button>
      </div>
    </form>
  );
}

export default InviteUser;
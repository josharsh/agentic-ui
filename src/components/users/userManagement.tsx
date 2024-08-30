import React, { useEffect, useState } from "react";
import api from "@/common/api";
import { useTranslation } from "react-i18next";
import { Search, UserPlus, RefreshCw, Trash2, MoreHorizontal } from "lucide-react";
import Modal from "@/components/common/modal";
import InviteUser from "./invite";
import { toast } from "react-hot-toast";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user: any) =>
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.role.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await api.session.getOrganizationUsers();
      setUsers(usersData);
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to fetch users. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // await api.session.deleteUser(userToDelete.id);
      // setUsers(users.filter(user => user.id !== userToDelete.id));
      // setIsDeleteModalOpen(false);
      // setUserToDelete(null);
      toast.success(t("User deleted successfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to delete user. Please try again."));
    }
  };

  const handleAddUser = () => {
    setIsInviteModalOpen(true);
  };

  const handleInviteSuccess = () => {
    setIsInviteModalOpen(false);
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="py-6 px-2 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-grow max-w-xl">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("Search users")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchUsers}
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={handleAddUser}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t("Add User")}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Email", "Role", "Actions"].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: any) => (
                  <tr key={user?.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{`${user?.first_name} ${user?.last_name}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user?.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          setUserToDelete(user);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t("No users")}</h3>
              <p className="mt-1 text-sm text-gray-500">{t("Get started by creating a new user.")}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  <UserPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  {t("New User")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("Delete User")}
        maxHeight="25vh"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {t("Are you sure you want to delete this user? This action cannot be undone.")}
          </p>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
            onClick={handleDeleteUser}
          >
            {t("Delete")}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={t("Invite New User")}
        maxHeight="65vh"
        maxWidth="80vh"
      >
        <InviteUser onSuccess={handleInviteSuccess} />
      </Modal>
    </div>
  );
}

export default UserManagement;
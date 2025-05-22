import { useState } from "react";
import { getAccessToken } from '@/common/api';
import axios from "axios";
import Loader from "@/components/common/loader";
import Modal from "@/components/common/modal";
import { PlusIcon } from '@radix-ui/react-icons';

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    name: "",
    system_message: "",
    agent_type: 'AssistantAgent', // Hardcoded agent_type
    trigger: `Agent-Trigger`,
    data_reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:9033/api/agents",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );
      setResponse(res.data);
    } catch (error) {
      console.error("Error creating agent:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
      >
        <PlusIcon className="mr-2" />
        Create New Agent
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Employee Assistant">
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Responsibilities</label>
              <textarea
                name="system_message"
                value={formData.system_message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Trigger</label>
              <input
                type="text"
                name="trigger"
                value={formData.trigger}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Data Reference</label>
              <input
                type="text"
                name="data_reference"
                value={formData.data_reference}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
            >
              {loading ? (
                <Loader />
              ) : (
                "Create Agent"
              )}
            </button>
          </form>
        )}
        {response && (
          <div className="mt-4 p-4 bg-green-100 rounded-md">
            <h3 className="text-lg font-bold">Agent Created Successfully</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import Loader from "@/components/common/loader";

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    name: "",
    system_message: "",
    agent_type: "assistant",
    trigger: "",
    data_reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:9033/api/agents",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhcnNoQHFvYWxhLmlkIiwiZXhwIjoxNzI1NjQzNzYwfQ.9FtL9MSSFzDq054j6xQI9dkkP2m9Zsn7YgZHapGzFWw",
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
    <div className="p-4 width-1000 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">System Message</label>
            <textarea
              name="system_message"
              value={formData.system_message}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Trigger</label>
            <input
              type="text"
              name="trigger"
              value={formData.trigger}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Data Reference</label>
            <input
              type="text"
              name="data_reference"
              value={formData.data_reference}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Create Agent
          </button>
        </form>
      )}
      {response && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <h3 className="text-lg font-bold">Agent Created Successfully</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
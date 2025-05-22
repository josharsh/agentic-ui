import React, { useState } from 'react';
import { getAccessToken } from '@/common/api';
import axios from 'axios';
import Modal from '@/components/common/modal';
import Loader from '@/components/common/loader';

export default function UploadKnowledge({ onClose }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      const res = await axios.post(
        'http://localhost:9033/api/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResponse(res.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Upload Knowledge">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Loader size="small" /> : 'Upload'}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <h3 className="text-lg font-bold">File Uploaded Successfully</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </Modal>
  );
}

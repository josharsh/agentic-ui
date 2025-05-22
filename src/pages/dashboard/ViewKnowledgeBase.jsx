import React, { useState, useEffect } from 'react';
import { getAccessToken } from '@/common/api';
import axios from 'axios';
import Modal from '@/components/common/modal';
import Loader from '@/components/common/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewKnowledgeBase({ onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:9033/api/files', {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      setFiles(res.data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const res = await axios.delete(`http://localhost:9033/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      toast.success(res.data.message);
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Knowledge Base">
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">File ID: {file.id}</h3>
                <p>{file.description}</p>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

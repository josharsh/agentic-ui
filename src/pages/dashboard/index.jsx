import React, { useState, useEffect } from 'react';
import { getAccessToken } from '@/common/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Loader from '@/components/common/loader';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import CreateAgent from './CreateAgent';
import FlowBuilder from './FlowBuilder';
import Modal from '@/components/common/modal';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { toast } from "react-hot-toast";
import { InfoCircledIcon, IdCardIcon, PersonIcon, GearIcon, LightningBoltIcon, ChatBubbleIcon } from "@radix-ui/react-icons";

import { useUser } from '@/user-context';
import ToggleSwitch from '@/components/common/Toggle';
import { CheckIcon } from 'lucide-react';
import UploadKnowledge from './UploadKnowledge';
import ViewKnowledgeBase from './ViewKnowledgeBase';

export default function DashboardLayout() {
  const { user, loading: userLoading } = useUser();
  const [agents, setAgents] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFlowBuilderOpen, setIsFlowBuilderOpen] = useState(false);
  const [isViewKnowledgeBaseOpen, setIsViewKnowledgeBaseOpen] = useState(false);
  const [isUploadKnowledgeOpen, setIsUploadKnowledgeOpen] = useState(false);
  const [view, setView] = useState('agents'); // 'agents' or 'agencies'
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get('http://localhost:9033/api/agents', {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
        setAgents(res.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

   

    const fetchAgencies = async () => {
      try {
        const res = await axios.get('http://localhost:9033/api/agency', {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
        setAgencies(res.data);
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
    fetchAgencies();
  }, []);

  const renderAgentsTable = () => (
    <div className="mt-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Agents</h1>
      <div className="table-container">
        <table className="table divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Name', 'Type', 'Trigger', 'System Message', 'Actions'].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {agents.map((agent) => (
              <tr key={agent.id} className="transition-colors duration-200 hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{agent.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{agent.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{agent.agent_type}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{agent.trigger}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <div className="tooltip">
                    {agent.system_message.length > 50
                      ? `${agent.system_message.substring(0, 50)}...`
                      : agent.system_message}
                    <span className="tooltiptext">{agent.system_message}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => setSelectedAgent(agent)} // Set the selected agent
                    className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white"
                  >
                    <EyeOpenIcon className="mr-2" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleExecuteAgency = async (agencyId) => {
    setExecuting(true);
    try {
      const res = await axios.post(
        `http://localhost:9033/api/agency/${agencyId}/execute`,
        {
          tasks: [
            "Create a personalized whatsapp message for a cross-sell campaign based on the user's policy and user data.",
            "Ensure the blog post aligns with the company's brand identity and messaging, and suggest strategies to engage the target audience.",
            "Send whatsapp message using the webhook tool"
          ],
          initial_message: "Initial message for the first agent"
        },
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          }
        }
      );
      setExecutionResult(res.data);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error executing agency:", error);
      toast.error('Error executing agency');
    } finally {
      setExecuting(false);
    }
  };


  const handleExecuteAgent = async (agentId) => {
    setExecuting(true);
    try {
      const res = await axios.post(
        `http://localhost:9033/api/agents/${agentId}/execute`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          }
        }
      );
      setExecutionResult(res.data);
    } catch (error) {
      console.error("Error executing agent:", error);
    } finally {
      setExecuting(false);
    }
  };

  const renderAgenciesTable = () => (
    <div className="mt-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Agencies</h1>
      <div className="table-container">
        <table className="table divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Name', 'Agents', 'Actions'].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {agencies.map((agency) => (
              <tr key={agency.id} className="transition-colors duration-200 hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{agency.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{agency.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {agency.agents.map((agent) => agent.name).join(', ')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => setSelectedAgency(agency)}
                    className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white"
                  >
                    <EyeOpenIcon className="mr-2" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {userLoading || loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className="flex grow pr-3">
            <NavBar />
            <div className="flex grow flex-col gap-2 pl-12 pt-6">
              <div className="toolbar">
                <CreateAgent />
                <button
                  onClick={() => setIsFlowBuilderOpen(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Create New Team
                </button>
                <button
                  onClick={() => setIsUploadKnowledgeOpen(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md ml-2"
                >
                  Add Knowledge
                </button>
                <button
                  onClick={() => setIsViewKnowledgeBaseOpen(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md ml-2"
                >
                  View Knowledge Base
                </button>
                <div className="flex items-center ml-auto">
                  <span className="mt-4 mr-2">Show Agents</span>
                  <ToggleSwitch
                    isOn={view === 'agencies'}
                    handleToggle={() => setView(view === 'agents' ? 'agencies' : 'agents')}
                    onLabel="Agencies"
                    offLabel="Agents"
                  />
                  <span className="mt-4 ml-2">Show Agencies</span>
                </div>
              </div>
              {view === 'agents' ? renderAgentsTable() : renderAgenciesTable()}
            </div>
          </div>
        </>
      )}
      {isFlowBuilderOpen && (
        <DndProvider backend={HTML5Backend}>
          <FlowBuilder agents={agents} onClose={() => setIsFlowBuilderOpen(false)} />
        </DndProvider>
      )}
       {isUploadKnowledgeOpen && (
        <UploadKnowledge onClose={() => setIsUploadKnowledgeOpen(false)} />
      )}
       {isViewKnowledgeBaseOpen && (
        <ViewKnowledgeBase onClose={() => setIsViewKnowledgeBaseOpen(false)} />
      )}
      {selectedAgent && (
  <Modal
    isOpen={!!selectedAgent}
    onClose={() => setSelectedAgent(null)}
    title="Agent Details"
  >
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <PersonIcon className="text-blue-500" height={28} width={28} />
          Agent Information
        </h2>
        <div className="flex items-center gap-2">
          <IdCardIcon className="text-gray-500" />
          <span className="font-semibold">ID:</span>
          <span>{selectedAgent.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <PersonIcon className="text-gray-500" />
          <span className="font-semibold">Name:</span>
          <span>{selectedAgent.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <GearIcon className="text-gray-500" />
          <span className="font-semibold">Type:</span>
          <span>{selectedAgent.agent_type}</span>
        </div>
        <div className="flex items-center gap-2">
          <LightningBoltIcon className="text-gray-500" />
          <span className="font-semibold">Trigger:</span>
          <span>{selectedAgent.trigger}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChatBubbleIcon className="text-gray-500" />
          <span className="font-semibold">System Message:</span>
          <span>{selectedAgent.system_message}</span>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GearIcon className="text-blue-500" height={28} width={28} />
          Available Tools
        </h2>
        <ul className="list-disc pl-5 mt-2">
          {/* <li className="flex items-center gap-2 p-3">
            <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/1024px-LINE_logo.svg.png"} alt="Line Integration" className="h-6 w-6" />
            Line Integration
          </li> */}
          <li className="flex items-center gap-2 p-3">
            <img src={"https://media.licdn.com/dms/image/D4D12AQG3AIgldn2YGw/article-cover_image-shrink_720_1280/0/1695232157979?e=2147483647&v=beta&t=BvrROmyp6fTI0c_ppCDIpldIoFPKSqi_ZdmwlWldDHk"} alt="Chatwoot" className="h-6 w-6" />
            Chatwoot
          </li>
          <li className="flex items-center gap-2 p-3">
            <img src={"https://store-images.s-microsoft.com/image/apps.8453.13655054093851568.4a371b72-2ce8-4bdb-9d83-be49894d3fa0.7f3687b9-847d-4f86-bb5c-c73259e2b38e?h=210"} alt="Whatsapp Notifications" className="h-6 w-6" />
            Whatsapp Notifications
          </li>
          <li className="flex items-center gap-2 p-3">
            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQd4BnPQdrgsYHH2TaQwnh8Tk-gAcks4qHJA&s"} alt="Content Analysis and Generation" className="h-6 w-6" />
            Content Analysis and Generation
          </li>
          <li className="flex items-center gap-2 p-3">
            <img src={"https://cdn-icons-png.flaticon.com/512/2278/2278931.png"} alt="Content Analysis and Generation" className="h-6 w-6" />
            Fetch User Profile, and Policy Details
          </li>
        </ul>
      </div>
      <button
        onClick={() => handleExecuteAgent(selectedAgent.id)}
        className="flex items-center justify-center w-full rounded-md bg-blue-500 px-4 py-2 text-white"
        disabled={executing}
      >
        {executing ? (
          <>
            <Loader size="small" />
            <span className="ml-2">Executing...</span>
          </>
        ) : (
          <>
            <CheckIcon className="mr-2" />
            Execute Agent
          </>
        )}
      </button>
      {executionResult && (
        <div className="mt-4 rounded-md bg-green-100 p-4">
          <h3 className="text-lg font-bold">Execution Result</h3>
          <pre>{JSON.stringify(executionResult, null, 2)}</pre>
        </div>
      )}
    </div>
  </Modal>
)}
    {selectedAgency && (
        <Modal isOpen={true} onClose={() => setSelectedAgency(null)} title={selectedAgency.name}>
          <div className="p-6 space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">Agents Timeline</h2>
            <div className="timeline">
              {selectedAgency.flow.map((agentId, index) => {
                const agent = selectedAgency.agents.find((agent) => agent.id === agentId);
                return (
                  <div key={agent.id} className="timeline-item">
                    <div className="timeline-content">
                      <h3 className="text-lg font-semibold text-gray-700">{agent.name}</h3>
                      <p className="text-gray-600">{agent.system_message}</p>
                      <span className="timeline-index">{index + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => handleExecuteAgency(selectedAgency.id)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
              disabled={executing}
            >
              {executing ? (
                <>
                  <Loader size="small" />
                  <span className="ml-2">Executing...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="mr-2" />
                  Execute Agency
                </>
              )}
            </button>
            {executionResult && (
              <div className="mt-4 rounded-md bg-green-100 p-4">
                <h3 className="text-lg font-bold">Execution Result</h3>
                <pre>{JSON.stringify(executionResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

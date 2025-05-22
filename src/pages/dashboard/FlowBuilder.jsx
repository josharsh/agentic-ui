import React, { useState } from 'react';
import { getAccessToken } from '@/common/api';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Modal from '@/components/common/modal';
import Loader from '@/components/common/loader';

const ItemType = {
  AGENT: 'agent',
};

const DraggableAgent = ({ agent, index, moveAgent }) => {
  const [, ref] = useDrag({
    type: ItemType.AGENT,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.AGENT,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveAgent(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="draggable-agent">
      {agent.name}
    </div>
  );
};

const FlowBuilder = ({ agents, onClose }) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agencyName, setAgencyName] = useState('');

  const moveAgent = (fromIndex, toIndex) => {
    const updatedAgents = [...selectedAgents];
    const [movedAgent] = updatedAgents.splice(fromIndex, 1);
    updatedAgents.splice(toIndex, 0, movedAgent);
    setSelectedAgents(updatedAgents);
  };

  const handleCreateAgency = async () => {
    setLoading(true);
    try {
      const agentIds = selectedAgents.map((agent) => agent.id);
      await axios.post(
        'http://localhost:9033/api/agency',
        { name: agencyName, agent_ids: agentIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );
      onClose();
    } catch (error) {
      console.error('Error creating agency:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Agency">
      <div className="flow-builder">
        <div className="agents-list">
          <h3>Available Assistants</h3>
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="agent-item"
              onClick={() => setSelectedAgents([...selectedAgents, agent])}
            >
              {agent.name}
            </div>
          ))}
        </div>
        <div className="selected-agents">
          <h3>Agency Sequence</h3>
          {selectedAgents.map((agent, index) => (
            <DraggableAgent
              key={index}
              index={index}
              agent={agent}
              moveAgent={moveAgent}
            />
          ))}
        </div>
      </div>
      <div className="agency-name">
        <input
          type="text"
          placeholder="Agency Name"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          className="agency-name-input"
        />
      </div>
      <button onClick={handleCreateAgency} disabled={loading} className="create-agency-button">
        {loading ? <Loader size="small" /> : 'Create Agency'}
      </button>
    </Modal>
  );
};

export default FlowBuilder;

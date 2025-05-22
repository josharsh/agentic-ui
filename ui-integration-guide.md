# UI Integration Guide

This guide documents all backend API endpoints, request/response formats, authentication, and integration nuances for building a UI with Agentic.

---

## Authentication

### Obtain Access Token

**POST** `/api/token`

- **Content-Type:** `application/x-www-form-urlencoded`
- **Body:**
  ```
  username=<email>
  password=<password>
  ```
- **Response:**
  ```json
  {
    "access_token": "<JWT_TOKEN>",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "harsh@postman.com",
      "username": "harshpostman",
      ...
    }
  }
  ```
- **Notes:**  
  Use the `access_token` as a Bearer token in the `Authorization` header for all subsequent requests.

---

## User

### Get Current User

**GET** `/api/user`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**
  ```json
  {
    "id": 1,
    "email": "harsh@postman.com",
    "username": "harshpostman",
    ...
  }
  ```

---

## Agents

### Create Agent

**POST** `/api/agents`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Body:** (JSON)
  ```json
  {
    "name": "Agent Name",
    "system_message": "System prompt",
    "agent_type": "type",
    "trigger": "trigger",
    "data_reference": "ref"
  }
  ```
- **Response:**  
  Agent object (JSON)

---

### List Agents

**GET** `/api/agents`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  Array of agent objects

---

### Get Agent by ID

**GET** `/api/agents/{id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  Agent object

---

### Execute Agent

**POST** `/api/agents/{id}/execute`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**
  ```json
  {
    "message": "Agent executed",
    "result": { ... }
  }
  ```

---

## Agencies

### Create Agency

**POST** `/api/agency`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Body:** (JSON)
  ```json
  {
    "name": "Agency Name",
    "agent_ids": [1, 2, 3]
  }
  ```
- **Response:**  
  Agency object

---

### List Agencies

**GET** `/api/agency`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  Array of agencies, each with agent list and flow

---

### Execute Agency

**POST** `/api/agency/{id}/execute`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Body:** (JSON)
  ```json
  {
    "initial_message": "Start message",
    "tasks": ["task1", "task2"]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Agency executed",
    "results": { ... }
  }
  ```

---

## File Management (Knowledge Base)

### Upload File

**POST** `/api/upload`

- **Headers:**  
  `Authorization: Bearer <access_token>`
  `Content-Type: multipart/form-data`
- **Body:**  
  - `file`: File to upload
  - `description`: (optional) string
- **Response:**
  ```json
  {
    "message": "File uploaded successfully",
    "file_id": 1,
    "data_store_id": 1,
    "s3_key": "...",
    "description": "..."
  }
  ```
- **Notes:**  
  Max file size: 10MB. Files are stored in S3.

---

### List Files

**GET** `/api/files`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**
  ```json
  {
    "files": [
      {
        "id": 1,
        "description": "...",
        ...
      }
    ]
  }
  ```

---

### Delete File

**DELETE** `/api/files/{file_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**
  ```json
  {
    "message": "File deleted successfully"
  }
  ```

---

## SOPs (Standard Operating Procedures)

### Create SOP

**POST** `/sops`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Body:** (JSON)
  ```json
  {
    "title": "SOP Title",
    "content": "SOP Content"
  }
  ```
- **Response:**  
  SOP object

---

### List SOPs

**GET** `/sops`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  Array of SOP objects

---

### Get SOP by ID

**GET** `/sops/{sop_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  SOP object

---

### Update SOP

**PUT** `/sops/{sop_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Body:** (JSON)  
  Partial or full SOP fields to update
- **Response:**  
  Updated SOP object

---

### Delete SOP

**DELETE** `/sops/{sop_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  `{ "detail": "SOP deleted successfully" }`

---

### Link SOP to Agent

**POST** `/sops/{sop_id}/link-agent/{agent_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  `{ "detail": "SOP linked to Agent successfully" }`

---

### Link SOP to Agency

**POST** `/sops/{sop_id}/link-agency/{agency_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  `{ "detail": "SOP linked to Agency successfully" }`

---

## Chatwood & Messaging

### Process Insurance Message

**POST** `/process-message`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Body:** (JSON)
  ```json
  {
    "message": "Message text",
    "conversation_id": "conv123"
  }
  ```
- **Response:**
  ```json
  {
    "result": { ... }
  }
  ```

---

### Chatwood Webhook

**POST** `/webhook/chatwood`

- **Body:** (JSON)
  ```json
  {
    "conversation_id": "conv123",
    "type": "line",
    "message": { ... },
    "sender": "user",
    "is_private": false
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Message processed successfully",
    "conversation": { ... }
  }
  ```

---

## Conversations

### Get Conversation

**GET** `/conversations/{conversation_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  Conversation object/history

---

### Delete Conversation

**DELETE** `/conversations/{conversation_id}`

- **Headers:**  
  `Authorization: Bearer <access_token>`
- **Response:**  
  `{ "message": "Conversation <id> and its messages have been deleted successfully" }`

---

## General Notes

- All endpoints (except `/api/token` and `/webhook/chatwood`) require Bearer token authentication.
- Error responses are in the format:
  ```json
  {
    "detail": "Error message"
  }
  ```
- For file uploads, use multipart/form-data.
- For all POST/PUT requests, use `Content-Type: application/json` unless otherwise specified.

---

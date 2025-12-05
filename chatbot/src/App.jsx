import { useState, useEffect, useRef } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:8000/api/v1'

function App() {
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [s3Files, setS3Files] = useState([])
  const [showFileList, setShowFileList] = useState(false)
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    fetchChatList()
    fetchS3Files()
  }, [])

  const fetchChatList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/list`)
      const data = await response.json()
      if (data.data) {
        setChats(data.data)
      }
    } catch (error) {
      console.error('Error fetching chat list:', error)
    }
  }

  const fetchS3Files = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/list`)
      const data = await response.json()
      if (data.data) {
        setS3Files(data.data)
      }
    } catch (error) {
      console.error('Error fetching S3 files:', error)
    }
  }

  const handleCreateChatClick = () => {
    setNewChatTitle('')
    setShowTitleModal(true)
  }

  const createNewChat = async (title = 'New Chat') => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || 'New Chat',
          messages: []
        }),
      })
      await response.json()
      await fetchChatList()
      
      // Get the newly created chat ID by refetching
      const listResponse = await fetch(`${API_BASE_URL}/chat/list`)
      const listData = await listResponse.json()
      if (listData.data && listData.data.length > 0) {
        const newChat = listData.data[0]
        setCurrentChatId(newChat.id)
        setMessages([])
      }
      setShowTitleModal(false)
      setNewChatTitle('')
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleTitleSubmit = (e) => {
    e.preventDefault()
    createNewChat(newChatTitle)
  }

  const loadChatHistory = async (chatId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${chatId}/history`)
      const data = await response.json()
      if (data.data) {
        setCurrentChatId(chatId)
        setMessages(data.data.messages || [])
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const deleteChat = async (chatId) => {
    try {
      await fetch(`${API_BASE_URL}/chat/${chatId}/delete`, {
        method: 'DELETE',
      })
      await fetchChatList()
      if (currentChatId === chatId) {
        setCurrentChatId(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || !currentChatId || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/chat/send-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentChatId,
          message: userMessage,
        }),
      })

      const data = await response.json()
      if (data.data) {
        // Reload chat history to get the updated messages
        await loadChatHistory(currentChatId)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const downloadFile = (url) => {
    window.open(url, '_blank')
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file)
        setUploadError('')
      } else {
        setUploadError('Only PDF files are allowed')
        setSelectedFile(null)
      }
    }
  }

  const handleUploadFile = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_BASE_URL}/upload-file`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        // Success - refresh file list and close modal
        await fetchS3Files()
        setShowUploadModal(false)
        setSelectedFile(null)
        alert('File uploaded successfully!')
      } else {
        setUploadError(data.error || 'Failed to upload file')
      }
    } catch (error) {
      setUploadError('Error uploading file: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>S3 File Retriever</h2>
          <button className="new-chat-btn" onClick={handleCreateChatClick}>
            + New Chat
          </button>
        </div>

        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => loadChatHistory(chat.id)}
            >
              <div className="chat-item-content">
                <span className="chat-title">{chat.title}</span>
                <span className="chat-date">
                  {new Date(chat.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteChat(chat.id)
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            className="upload-file-btn"
            onClick={() => setShowUploadModal(true)}
          >
            ⬆️ Upload PDF
          </button>
          <button
            className="files-toggle-btn"
            onClick={() => setShowFileList(!showFileList)}
          >
            📁 S3 Files ({s3Files.length})
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-content">
        {!currentChatId ? (
          <div className="welcome-screen">
            <h1>🤖 S3 File Retrieval Chatbot</h1>
            <p>Ask me to find files from your S3 bucket!</p>
            <p className="hint">Examples:</p>
            <ul className="examples">
              <li>"Find files related to John Smith"</li>
              <li>"Show me files from the Marketing department"</li>
              <li>"Get documents for Project Alpha"</li>
            </ul>
            <button className="start-btn" onClick={handleCreateChatClick}>
              Start New Conversation
            </button>
          </div>
        ) : (
          <>
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <p>Start a conversation by asking about files in your S3 bucket</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-avatar">
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.content}</div>
                      <div className="message-time">{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="input-container" onSubmit={sendMessage}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about files in your S3 bucket..."
                disabled={isLoading}
                className="message-input"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="send-btn"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
            </form>
          </>
        )}
      </div>

      {/* S3 Files Panel */}
      {showFileList && (
        <div className="files-panel">
          <div className="files-panel-header">
            <h3>Available Files</h3>
            <button className="close-btn" onClick={() => setShowFileList(false)}>
              ✕
            </button>
          </div>
          <div className="files-list">
            {s3Files.length === 0 ? (
              <p className="no-files">No files found in S3 bucket</p>
            ) : (
              s3Files.map((file, idx) => (
                <div key={idx} className="file-item">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <div className="file-name">{file.key}</div>
                    <div className="file-meta">
                      <span>{(file.size / 1024).toFixed(2)} KB</span>
                      <span>•</span>
                      <span>{new Date(file.last_modified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    className="download-btn"
                    onClick={() => downloadFile(file.url)}
                  >
                    ⬇️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Title Input Modal */}
      {showTitleModal && (
        <div className="modal-overlay" onClick={() => setShowTitleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Chat</h3>
            <p className="modal-subtitle">Enter a title for your chat (optional)</p>
            <form onSubmit={handleTitleSubmit}>
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Enter chat title..."
                className="title-input"
                autoFocus
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => {
                    setShowTitleModal(false)
                    setNewChatTitle('')
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Create Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Upload PDF to S3</h3>
            <p className="modal-subtitle">Select a PDF file to upload to your S3 bucket</p>
            <form onSubmit={handleUploadFile}>
              <div className="file-upload-area">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="file-input"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="file-input-label">
                  {selectedFile ? (
                    <div className="selected-file-info">
                      <span className="file-icon-large">📄</span>
                      <span className="file-name-display">{selectedFile.name}</span>
                      <span className="file-size-display">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  ) : (
                    <div className="file-input-placeholder">
                      <span className="upload-icon">📤</span>
                      <span>Click to select a PDF file</span>
                    </div>
                  )}
                </label>
              </div>
              
              {uploadError && (
                <div className="upload-error">
                  ⚠️ {uploadError}
                </div>
              )}

              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                    setUploadError('')
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload to S3'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

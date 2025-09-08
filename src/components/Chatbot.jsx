import React, { useState } from 'react';
import { Bot, Send } from 'lucide-react';

// You will need to create a backend API endpoint that runs your Python script
// and returns the response from the Ollama model. Replace this with your actual API URL.
const CHATBOT_API_URL = 'http://127.0.0.1:5000/api/chat';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! How can I help you with the Bihar job portal today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // This is a placeholder for a real API call.
      // You must create a server-side endpoint that receives the user message,
      // runs your Python script, and sends back the chatbot's response.
      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { role: 'bot', content: data.content };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Failed to fetch from chatbot API:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'bot', content: 'Sorry, I am unable to connect to the server right now. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors duration-300"
        onClick={toggleChatbot}
        aria-label="Toggle Chatbot"
      >
        <Bot size={28} />
      </button>

      {/* Chatbot Window */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chatbot Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h3 className="font-semibold text-lg">AI Chatbot</h3>
          <button onClick={toggleChatbot} aria-label="Close Chatbot" className="text-white hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-xl p-3 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-xl p-3 max-w-[80%] rounded-bl-none">
                <div className="dot-flashing"></div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={isLoading}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
      
      {/* Simple CSS for loading animation */}
      <style jsx>{`
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::before,
        .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0.2s;
        }
        .dot-flashing::after {
          left: 15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0.4s;
        }
        @keyframes dot-flashing {
          0% {
            background-color: #9880ff;
          }
          50%,
          100% {
            background-color: rgba(152, 128, 255, 0.2);
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
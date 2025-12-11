//propdash-mvp\src\components\ProviderDashboard\Messages.jsx
import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Search,
  User,
  Clock,
  CheckCheck,
  Paperclip,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";
import { theme } from "../../styles/theme";

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      // Get conversations first
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("provider_id", user.id)
        .order("last_message_at", { ascending: false });

      if (convError) {
        console.error("Error fetching conversations:", convError);
        setLoading(false);
        return;
      }

      if (convData && convData.length > 0) {
        // Get unique customer IDs
        const customerIds = [...new Set(convData.map(c => c.customer_id))];
        
        // Fetch customer details
        const { data: customerData } = await supabase
          .from("customers")
          .select("id, full_name, email, phone")
          .in("id", customerIds);

        // Get unique job IDs
        const jobIds = convData.map(c => c.job_id).filter(Boolean);
        
        // Fetch job details
        const { data: jobData } = await supabase
          .from("jobs")
          .select("id, service_name, status")
          .in("id", jobIds);

        // Combine the data
        const enrichedConversations = convData.map(conv => ({
          ...conv,
          customers: customerData?.find(c => c.id === conv.customer_id) || null,
          jobs: jobData?.find(j => j.id === conv.job_id) || null,
        }));

        setConversations(enrichedConversations);
        if (enrichedConversations.length > 0) {
          setSelectedConversation(enrichedConversations[0]);
        }
      } else {
        setConversations([]);
      }
      
      setLoading(false);
    }
    
    if (user) fetchConversations();
  }, [user]);

  // Fetch messages for selected conversation
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedConversation) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data);
        // Mark messages as read
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("conversation_id", selectedConversation.id)
          .eq("receiver_id", user.id)
          .eq("is_read", false);
      }
    }
    fetchMessages();
  }, [selectedConversation, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);

    const { data, error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      receiver_id: selectedConversation.customer_id,
      message: newMessage.trim(),
    });

    if (!error) {
      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedConversation.id);

      // Add message to local state
      const newMsg = {
        id: crypto.randomUUID(),
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        receiver_id: selectedConversation.customer_id,
        message: newMessage.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }

    setSending(false);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.customers?.full_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={theme.text.body}>Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className={theme.text.h1}>Messages</h1>
        <p className={`${theme.text.body} mt-1`}>
          Chat with customers about their projects
        </p>
      </div>

      {/* Messages Layout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-[calc(100%-5rem)] flex">
        {/* Conversations List */}
        <div
          className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${
            selectedConversation ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm`}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="text-slate-400" size={24} />
                </div>
                <p className="text-sm text-slate-600">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                />
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="bg-blue-100 p-2.5 rounded-full">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className={`${theme.text.h4} flex items-center gap-2`}>
                    {selectedConversation.customers?.full_name || "Customer"}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {selectedConversation.jobs?.service_name || "General inquiry"}
                  </p>
                </div>
              </div>
              <button className="text-slate-600 hover:text-slate-900">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="text-slate-400" size={32} />
                    </div>
                    <p className={`${theme.text.h4} mb-2`}>
                      No messages yet
                    </p>
                    <p className={`${theme.text.body} text-sm`}>
                      Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.sender_id === user.id}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-slate-200"
            >
              <div className="flex gap-2">
                <button
                  type="button"
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`${theme.input.base} ${theme.input.provider} flex-1`}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className={`${theme.button.provider} flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="bg-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-slate-400" size={40} />
              </div>
              <h3 className={`${theme.text.h3} mb-2`}>
                No conversation selected
              </h3>
              <p className={`${theme.text.body} text-sm`}>
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Conversation Item Component
function ConversationItem({ conversation, isSelected, onClick }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-b border-slate-200 hover:bg-slate-50 transition text-left ${
        isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
          <User className="text-blue-600" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {conversation.customers?.full_name || "Customer"}
            </h4>
            <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
              {formatTime(conversation.last_message_at)}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-1 truncate">
            {conversation.jobs?.service_name || "General inquiry"}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                conversation.jobs?.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {conversation.jobs?.status || "New"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// Message Bubble Component
function MessageBubble({ message, isOwn }) {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
        <div
          className={`p-2 rounded-full flex-shrink-0 ${
            isOwn ? "bg-blue-100" : "bg-slate-100"
          }`}
        >
          <User size={16} className={isOwn ? "text-blue-600" : "text-slate-600"} />
        </div>
        <div>
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn
                ? "bg-blue-600 text-white rounded-tr-sm"
                : "bg-slate-100 text-slate-900 rounded-tl-sm"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.message}</p>
          </div>
          <div
            className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <Clock size={12} />
            <span>{formatTime(message.created_at)}</span>
            {isOwn && (
              <CheckCheck
                size={14}
                className={message.is_read ? "text-blue-600" : ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
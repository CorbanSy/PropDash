import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Shield,
  Ban,
  Flag,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false); // ✅ Added
  const [showBlockModal, setShowBlockModal] = useState(false); // ✅ Added
  const [showReportModal, setShowReportModal] = useState(false); // ✅ Added
  const messagesEndRef = useRef(null);
  const optionsMenuRef = useRef(null); // ✅ Added

  // ✅ Close options menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      console.log("Fetching conversations for user:", user.id);

      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("customer_id", user.id)
        .order("last_message_at", { ascending: false });

      console.log("Conversations data:", convData);
      console.log("Conversations error:", convError);

      if (convError) {
        console.error("Error fetching conversations:", convError);
        setLoading(false);
        return;
      }

      if (convData && convData.length > 0) {
        const providerIds = [...new Set(convData.map(c => c.provider_id))];
        
        const { data: providerData } = await supabase
          .from("providers")
          .select("id, business_name, verification_status, base_rate")
          .in("id", providerIds);

        console.log("Provider data:", providerData);

        const jobIds = convData.map(c => c.job_id).filter(Boolean);
        
        let jobData = [];
        if (jobIds.length > 0) {
          const { data } = await supabase
            .from("jobs")
            .select("id, service_name, status")
            .in("id", jobIds);
          jobData = data || [];
        }

        console.log("Job data:", jobData);

        const enrichedConversations = convData.map(conv => ({
          ...conv,
          providers: providerData?.find(p => p.id === conv.provider_id) || null,
          jobs: jobData?.find(j => j.id === conv.job_id) || null,
        }));

        console.log("Enriched conversations:", enrichedConversations);

        setConversations(enrichedConversations);
        
        const searchParams = new URLSearchParams(location.search);
        const conversationId = searchParams.get('conversation');
        
        if (conversationId) {
          const targetConversation = enrichedConversations.find(c => c.id === conversationId);
          if (targetConversation) {
            setSelectedConversation(targetConversation);
          } else {
            setSelectedConversation(enrichedConversations[0]);
          }
        } else if (enrichedConversations.length > 0) {
          setSelectedConversation(enrichedConversations[0]);
        }
      } else {
        console.log("No conversations found");
        setConversations([]);
      }
      
      setLoading(false);
    }
    
    if (user) fetchConversations();
  }, [user, location.search]);

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
      receiver_id: selectedConversation.provider_id,
      message: newMessage.trim(),
    });

    if (!error) {
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedConversation.id);

      const newMsg = {
        id: crypto.randomUUID(),
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        receiver_id: selectedConversation.provider_id,
        message: newMessage.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }

    setSending(false);
  };

  // ✅ Handle block user
  const handleBlockUser = async () => {
    setShowBlockModal(false);
    setShowOptionsMenu(false);
    
    // TODO: Implement actual blocking logic in database
    console.log("Blocking provider:", selectedConversation.provider_id);
    
    // You would create a "blocked_users" table and insert a record
    // For now, just show a success message
    alert(`${selectedConversation.providers?.business_name} has been blocked. You will no longer receive messages from this provider.`);
  };

  // ✅ Handle report user
  const handleReportUser = async (reason) => {
    setShowReportModal(false);
    setShowOptionsMenu(false);
    
    // TODO: Implement actual reporting logic in database
    console.log("Reporting provider:", selectedConversation.provider_id, "Reason:", reason);
    
    // You would create a "reports" table and insert a record
    // For now, just show a success message
    alert(`Thank you for your report. Our team will review ${selectedConversation.providers?.business_name}'s account.`);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.providers?.business_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">
          Chat with service providers about your projects
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
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
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
                <p className="text-xs text-slate-500 mt-2">
                  Start a conversation by messaging a provider
                </p>
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
                <div className="bg-teal-100 p-2.5 rounded-full">
                  <User className="text-teal-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {selectedConversation.providers?.business_name || "Provider"}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {selectedConversation.jobs?.service_name || "General inquiry"}
                  </p>
                </div>
              </div>
              
              {/* ✅ Options Menu */}
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <MoreVertical size={20} />
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowBlockModal(true);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                    >
                      <Ban size={16} className="text-red-600" />
                      Block User
                    </button>
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowReportModal(true);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                    >
                      <Flag size={16} className="text-orange-600" />
                      Report User
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="text-slate-400" size={32} />
                    </div>
                    <p className="text-slate-900 font-semibold mb-2">
                      No messages yet
                    </p>
                    <p className="text-slate-600 text-sm">
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
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No conversation selected
              </h3>
              <p className="text-slate-600 text-sm">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Block Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Ban className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Block User</h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              Are you sure you want to block <strong>{selectedConversation.providers?.business_name}</strong>? 
              You will no longer receive messages from this provider, and they won't be able to contact you.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Block User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Report Modal */}
      {showReportModal && (
        <ReportModal
          providerName={selectedConversation.providers?.business_name}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportUser}
        />
      )}
    </div>
  );
}

// ✅ Report Modal Component
function ReportModal({ providerName, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");

  const reasons = [
    "Spam or scam",
    "Inappropriate behavior",
    "Harassment",
    "Fake profile",
    "Unprofessional conduct",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason) return;
    onSubmit({ reason: selectedReason, details });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Flag className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Report User</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-slate-600 mb-4">
          Report <strong>{providerName}</strong> to our team. We'll review the issue.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason for report *
            </label>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide more information about the issue..."
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Report
            </button>
          </div>
        </form>
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
        <div className="bg-teal-100 p-2 rounded-full flex-shrink-0">
          <User className="text-teal-600" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {conversation.providers?.business_name || "Provider"}
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
            isOwn ? "bg-blue-100" : "bg-teal-100"
          }`}
        >
          <User size={16} className={isOwn ? "text-blue-600" : "text-teal-600"} />
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
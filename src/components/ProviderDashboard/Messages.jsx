// src/components/ProviderDashboard/Messages.jsx
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
  Users,
  Briefcase,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";
import { theme } from "../../styles/theme";
import { useLocation } from 'react-router-dom';

export default function Messages() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("customers");
  const [customerConversations, setCustomerConversations] = useState([]);
  const [professionalConversations, setProfessionalConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const location = useLocation();
  const customerId = location.state?.customerId;
  const jobId = location.state?.jobId;
  const professionalId = location.state?.professionalId;
  const conversationId = location.state?.conversationId;
  const openTab = location.state?.openTab;
  const messagesEndRef = useRef(null);

  const currentConversations = activeTab === "customers" 
    ? customerConversations 
    : professionalConversations;

  useEffect(() => {
    if (openTab && (openTab === "customers" || openTab === "professionals")) {
      setActiveTab(openTab);
    }
  }, [openTab]);

  useEffect(() => {
    if (customerId && customerConversations.length > 0) {
      const conversation = customerConversations.find(c => c.customer_id === customerId);
      if (conversation) {
        setActiveTab("customers");
        setSelectedConversation(conversation);
      }
    }
    else if ((professionalId || conversationId) && professionalConversations.length > 0) {
      const conversation = professionalConversations.find(
        c => c.otherPartyId === professionalId || c.id === conversationId
      );
      if (conversation) {
        setActiveTab("professionals");
        setSelectedConversation(conversation);
      }
    }
  }, [customerId, professionalId, conversationId, customerConversations, professionalConversations]);
  
  useEffect(() => {
    async function fetchAllConversations() {
      if (!user) return;

      try {
        const { data: convData, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("provider_id", user.id)
          .order("last_message_at", { ascending: false });

        if (convError) {
          console.error("Error fetching customer conversations:", convError);
        }

        if (convData && convData.length > 0) {
          const customerIds = [...new Set(convData.map(c => c.customer_id))];
          
          const { data: customerData } = await supabase
            .from("customers")
            .select("id, full_name, email, phone")
            .in("id", customerIds);

          const jobIds = convData.map(c => c.job_id).filter(Boolean);
          
          const { data: jobData } = await supabase
            .from("jobs")
            .select("id, service_name, status")
            .in("id", jobIds);

          const enrichedConversations = convData.map(conv => ({
            ...conv,
            type: "customer",
            customers: customerData?.find(c => c.id === conv.customer_id) || null,
            jobs: jobData?.find(j => j.id === conv.job_id) || null,
            otherPartyName: customerData?.find(c => c.id === conv.customer_id)?.full_name || "Customer",
            otherPartyId: conv.customer_id,
          }));

          setCustomerConversations(enrichedConversations);
        } else {
          setCustomerConversations([]);
        }

        const { data: providerConv1, error: provError1 } = await supabase
          .from("provider_conversations")
          .select("*")
          .eq("provider1_id", user.id)
          .order("last_message_at", { ascending: false });

        const { data: providerConv2, error: provError2 } = await supabase
          .from("provider_conversations")
          .select("*")
          .eq("provider2_id", user.id)
          .order("last_message_at", { ascending: false });

        if (provError1) console.error("Error fetching provider conversations 1:", provError1);
        if (provError2) console.error("Error fetching provider conversations 2:", provError2);

        const allProviderConvs = [...(providerConv1 || []), ...(providerConv2 || [])];

        if (allProviderConvs.length > 0) {
          const providerIds = new Set();
          allProviderConvs.forEach(conv => {
            if (conv.provider1_id !== user.id) providerIds.add(conv.provider1_id);
            if (conv.provider2_id !== user.id) providerIds.add(conv.provider2_id);
          });

          const { data: providerData } = await supabase
            .from("providers")
            .select("id, business_name, phone, is_online, verification_status")
            .in("id", Array.from(providerIds));

          const enrichedProviderConversations = allProviderConvs.map(conv => {
            const otherProviderId = conv.provider1_id === user.id 
              ? conv.provider2_id 
              : conv.provider1_id;
            
            const otherProvider = providerData?.find(p => p.id === otherProviderId);

            return {
              ...conv,
              type: "professional",
              provider: otherProvider || null,
              otherPartyName: otherProvider?.business_name || "Professional",
              otherPartyId: otherProviderId,
            };
          });

          enrichedProviderConversations.sort((a, b) => 
            new Date(b.last_message_at) - new Date(a.last_message_at)
          );

          setProfessionalConversations(enrichedProviderConversations);
        } else {
          setProfessionalConversations([]);
        }

      } catch (err) {
        console.error("Exception fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAllConversations();
  }, [user]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);

    const { data, error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      receiver_id: selectedConversation.otherPartyId,
      message: newMessage.trim(),
    });

    if (!error) {
      const tableName = selectedConversation.type === "customer" 
        ? "conversations" 
        : "provider_conversations";

      await supabase
        .from(tableName)
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedConversation.id);

      const newMsg = {
        id: crypto.randomUUID(),
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        receiver_id: selectedConversation.otherPartyId,
        message: newMessage.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }

    setSending(false);
  };

  const filteredConversations = currentConversations.filter((conv) =>
    conv.otherPartyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary-700">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Messages</h1>
        <p className="text-secondary-700 mt-1 leading-relaxed">
          Chat with customers and other professionals
        </p>
      </div>

      {/* Messages Layout */}
      <div className="bg-white rounded-xl border-2 border-secondary-200 shadow-card h-[calc(100%-5rem)] flex flex-col">
        {/* Tabs */}
        <div className="border-b border-secondary-200 px-4 flex gap-4">
          <button
            onClick={() => {
              setActiveTab("customers");
              setSelectedConversation(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200 relative ${
              activeTab === "customers"
                ? "text-accent-700"
                : "text-secondary-600 hover:text-secondary-900"
            }`}
          >
            <User size={18} />
            <span>Customers</span>
            {customerConversations.length > 0 && (
              <span className="bg-accent-100 text-accent-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {customerConversations.length}
              </span>
            )}
            {activeTab === "customers" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-700"></div>
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveTab("professionals");
              setSelectedConversation(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200 relative ${
              activeTab === "professionals"
                ? "text-premium-700"
                : "text-secondary-600 hover:text-secondary-900"
            }`}
          >
            <Users size={18} />
            <span>Professionals</span>
            {professionalConversations.length > 0 && (
              <span className="bg-premium-100 text-premium-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {professionalConversations.length}
              </span>
            )}
            {activeTab === "professionals" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-700"></div>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div
            className={`w-full md:w-80 border-r border-secondary-200 flex flex-col ${
              selectedConversation ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search */}
            <div className="p-4 border-b border-secondary-200">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className={`${
                    activeTab === "customers" ? "bg-accent-100" : "bg-premium-100"
                  } w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    {activeTab === "customers" ? (
                      <User className="text-accent-700" size={24} />
                    ) : (
                      <Users className="text-premium-700" size={24} />
                    )}
                  </div>
                  <p className="text-sm text-secondary-600">
                    No {activeTab} conversations yet
                  </p>
                  {activeTab === "professionals" && (
                    <p className="text-xs text-secondary-500 mt-2">
                      Visit the Network page to connect with professionals
                    </p>
                  )}
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    type={activeTab}
                  />
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Thread Header */}
              <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden text-secondary-600 hover:text-secondary-900 transition"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className={`${
                    selectedConversation.type === "customer" 
                      ? "bg-accent-100" 
                      : "bg-premium-100"
                  } p-2.5 rounded-full`}>
                    {selectedConversation.type === "customer" ? (
                      <User className="text-accent-700" size={20} />
                    ) : (
                      <Briefcase className="text-premium-700" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                      {selectedConversation.otherPartyName}
                      {selectedConversation.type === "professional" && 
                       selectedConversation.provider?.is_online && (
                        <span className="flex items-center gap-1 text-xs text-success-600 font-normal">
                          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                          Online
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-secondary-600">
                      {selectedConversation.type === "customer" 
                        ? (selectedConversation.jobs?.service_name || "General inquiry")
                        : "Professional Connection"}
                    </p>
                  </div>
                </div>
                <button className="text-secondary-600 hover:text-secondary-900 transition">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-secondary-400" size={32} />
                      </div>
                      <p className="text-lg font-semibold text-secondary-900 mb-2">
                        No messages yet
                      </p>
                      <p className="text-secondary-600 text-sm">
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
                        conversationType={selectedConversation.type}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-secondary-200"
              >
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition"
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-secondary-50">
              <div className="text-center">
                <div className="bg-secondary-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="text-secondary-400" size={40} />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  No conversation selected
                </h3>
                <p className="text-secondary-600 text-sm">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Conversation Item Component
function ConversationItem({ conversation, isSelected, onClick, type }) {
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

  const isCustomer = type === "customers";

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-b border-secondary-200 hover:bg-secondary-50 transition-all duration-200 text-left ${
        isSelected 
          ? `${isCustomer ? "bg-accent-50 border-l-4 border-l-accent-700" : "bg-premium-50 border-l-4 border-l-premium-700"}` 
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`${
          isCustomer ? "bg-accent-100" : "bg-premium-100"
        } p-2 rounded-full flex-shrink-0`}>
          {isCustomer ? (
            <User className="text-accent-700" size={18} />
          ) : (
            <Briefcase className="text-premium-700" size={18} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-secondary-900 text-sm truncate flex items-center gap-2">
              {conversation.otherPartyName}
              {!isCustomer && conversation.provider?.is_online && (
                <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
              )}
            </h4>
            <span className="text-xs text-secondary-500 flex-shrink-0 ml-2">
              {formatTime(conversation.last_message_at)}
            </span>
          </div>
          {isCustomer ? (
            <>
              <p className="text-xs text-secondary-600 mb-1 truncate">
                {conversation.jobs?.service_name || "General inquiry"}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    conversation.jobs?.status === "confirmed"
                      ? "bg-success-100 text-success-700"
                      : "bg-secondary-100 text-secondary-700"
                  }`}
                >
                  {conversation.jobs?.status || "New"}
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-secondary-600 mb-1">
                Professional Connection
              </p>
              {conversation.provider?.verification_status === "verified" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-success-100 text-success-700 font-semibold">
                  Verified
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  );
}

// Message Bubble Component
function MessageBubble({ message, isOwn, conversationType }) {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const bubbleColor = isOwn 
    ? (conversationType === "customer" ? "bg-accent-700" : "bg-premium-700")
    : "bg-secondary-100";

  const iconBgColor = isOwn
    ? (conversationType === "customer" ? "bg-accent-100" : "bg-premium-100")
    : "bg-secondary-100";

  const iconColor = isOwn
    ? (conversationType === "customer" ? "text-accent-700" : "text-premium-700")
    : "text-secondary-600";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
        <div className={`p-2 rounded-full flex-shrink-0 ${iconBgColor}`}>
          {conversationType === "customer" ? (
            <User size={16} className={iconColor} />
          ) : (
            <Briefcase size={16} className={iconColor} />
          )}
        </div>
        <div>
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn
                ? `${bubbleColor} text-white ${conversationType === "customer" ? "rounded-tr-sm" : "rounded-tr-sm"}`
                : "bg-secondary-100 text-secondary-900 rounded-tl-sm"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
          </div>
          <div
            className={`flex items-center gap-1 mt-1 text-xs text-secondary-500 ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <Clock size={12} />
            <span>{formatTime(message.created_at)}</span>
            {isOwn && (
              <CheckCheck
                size={14}
                className={message.is_read ? (conversationType === "customer" ? "text-accent-700" : "text-premium-700") : ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
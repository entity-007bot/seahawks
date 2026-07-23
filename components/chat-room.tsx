"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare, ChevronLeft, Anchor, Video, Plus, Link2, ExternalLink, Camera, Bell, CheckCircle2, Users, Radio } from "lucide-react";

interface MeetingLink {
  id: string;
  title: string;
  url: string;
  platform: "WhatsApp" | "Google Meet" | "Zoom" | "Custom";
  postedBy: string;
  postedAt: string;
  roomId?: string; // Optional specific Room Suite or all
}

export function ChatRoom({
  chatRooms,
  setChatRooms,
  session,
  onUserAvatarUpdate
}: {
  chatRooms: any[];
  setChatRooms: (rooms: any[]) => void;
  session: any;
  onUserAvatarUpdate?: (newAvatarUrl: string) => void;
}) {
  const [activeChatId, setActiveChatId] = useState<string>("chat_1");
  const [chatInput, setChatInput] = useState<string>("");
  const [mobileActive, setMobileActive] = useState<boolean>(false);

  // Modals
  const [showCreateRoomModal, setShowCreateRoomModal] = useState<boolean>(false);
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState<boolean>(false);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  // Form states
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [newRoomDesc, setNewRoomDesc] = useState<string>("");
  const [newRoomCategory, setNewRoomCategory] = useState<string>("General Suite");

  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [meetingUrl, setMeetingUrl] = useState<string>("");
  const [meetingPlatform, setMeetingPlatform] = useState<"WhatsApp" | "Google Meet" | "Zoom" | "Custom">("WhatsApp");
  const [meetingTargetRoom, setMeetingTargetRoom] = useState<string>("ALL");

  const [avatarUrlInput, setAvatarUrlInput] = useState<string>("");
  const [customAvatar, setCustomAvatar] = useState<string>("");
  const currentUserAvatar = customAvatar || session?.profilePhoto || "";

  // Meeting links list
  const [meetingLinks, setMeetingLinks] = useState<MeetingLink[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("privateers_meeting_links");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default meeting link
    const defaultLinks: MeetingLink[] = [
      {
        id: "link_default_1",
        title: "Official SAEAHAWKS Assembly & Conclave Meeting",
        url: "https://chat.whatsapp.com/GNDCorsairsOfficialAssembly",
        platform: "WhatsApp",
        postedBy: "Admiral David Chukwuyem",
        postedAt: "Just now",
        roomId: "ALL"
      }
    ];
    localStorage.setItem("privateers_meeting_links", JSON.stringify(defaultLinks));
    return defaultLinks;
  });

  // Notifications
  const [notifications, setNotifications] = useState<string[]>([]);

  const isAdmin = session?.superAdmin || session?.rank?.includes("Admiral") || session?.rank?.includes("Commander") || session?.rank?.includes("Scribe");

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const updated = chatRooms.map((room) => {
      if (room.id === activeChatId) {
        return {
          ...room,
          messages: [
            ...room.messages,
            {
              sender: session?.name || "Admiral David Chukwuyem",
              rank: session?.rank || "Admiral",
              avatar: currentUserAvatar || session?.profilePhoto || "",
              text: chatInput,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          ]
        };
      }
      return room;
    });
    setChatRooms(updated);
    localStorage.setItem("privateers_db_chats", JSON.stringify(updated));
    setChatInput("");
  };

  const handleCreateRoomSuite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newId = `suite_${Date.now()}`;
    const newRoom = {
      id: newId,
      name: newRoomName.includes("Suite") ? newRoomName : `${newRoomName} Suite`,
      description: newRoomDesc || "Admin created room suite for secure member communication.",
      unread: true,
      category: newRoomCategory,
      messages: [
        {
          sender: session?.name || "Admiral David Chukwuyem",
          rank: session?.rank || "Admiral",
          avatar: currentUserAvatar,
          text: `⚓ Room Suite created by Admin. Welcome members! Start your conversations here.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    const updated = [newRoom, ...chatRooms];
    setChatRooms(updated);
    localStorage.setItem("privateers_db_chats", JSON.stringify(updated));
    setActiveChatId(newId);

    // Notify users
    const notif = `📢 NEW ROOM SUITE CREATED: ${newRoom.name} is now open for chat!`;
    setNotifications((prev) => [notif, ...prev]);
    localStorage.setItem("privateers_last_room_notif", notif);

    // Clear form
    setNewRoomName("");
    setNewRoomDesc("");
    setShowCreateRoomModal(false);
  };

  const handlePostMeetingLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim() || !meetingUrl.trim()) return;

    const newLink: MeetingLink = {
      id: `link_${Date.now()}`,
      title: meetingTitle,
      url: meetingUrl.startsWith("http") ? meetingUrl : `https://${meetingUrl}`,
      platform: meetingPlatform,
      postedBy: session?.name || "Admiral David Chukwuyem",
      postedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      roomId: meetingTargetRoom
    };

    const updatedLinks = [newLink, ...meetingLinks];
    setMeetingLinks(updatedLinks);
    localStorage.setItem("privateers_meeting_links", JSON.stringify(updatedLinks));

    // Also post a system message to the room
    const updatedChats = chatRooms.map((room) => {
      if (meetingTargetRoom === "ALL" || room.id === meetingTargetRoom) {
        return {
          ...room,
          messages: [
            ...room.messages,
            {
              sender: session?.name || "Admin Command",
              rank: "Official Link",
              avatar: currentUserAvatar,
              text: `🔗 OFFICIAL MEETING LINK POSTED: ${meetingTitle} (${meetingPlatform}). Click "Come Aboard" to join: ${newLink.url}`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          ]
        };
      }
      return room;
    });

    setChatRooms(updatedChats);
    localStorage.setItem("privateers_db_chats", JSON.stringify(updatedChats));

    const notif = `🚨 OFFICIAL MEETING LINK POSTED by Admin: ${meetingTitle}`;
    setNotifications((prev) => [notif, ...prev]);

    // Reset modal
    setMeetingTitle("");
    setMeetingUrl("");
    setShowMeetingLinkModal(false);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomAvatar(base64);
        if (onUserAvatarUpdate) onUserAvatarUpdate(base64);
        
        // update local session profile photo
        const savedSession = localStorage.getItem("privateers_session");
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            parsed.profilePhoto = base64;
            localStorage.setItem("privateers_session", JSON.stringify(parsed));
          } catch (err) {}
        }
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatarUrl = () => {
    if (avatarUrlInput.trim()) {
      setCustomAvatar(avatarUrlInput);
      if (onUserAvatarUpdate) onUserAvatarUpdate(avatarUrlInput);

      const savedSession = localStorage.getItem("privateers_session");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          parsed.profilePhoto = avatarUrlInput;
          localStorage.setItem("privateers_session", JSON.stringify(parsed));
        } catch (err) {}
      }
      setShowAvatarModal(false);
    }
  };

  const activeRoom = chatRooms.find((r) => r.id === activeChatId) || chatRooms[0];
  const activeRoomMeetingLink = meetingLinks.find(m => m.roomId === activeRoom?.id || m.roomId === "ALL");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] relative">
      {/* Top Notification Banner if any */}
      {notifications.length > 0 && (
        <div className="md:col-span-12 bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2 truncate">
            <Bell size={14} className="text-amber-400 animate-bounce" />
            <span className="font-semibold truncate">{notifications[0]}</span>
          </div>
          <button
            onClick={() => setNotifications((prev) => prev.slice(1))}
            className="text-[10px] text-amber-400 hover:underline uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* LEFT COLUMN: Room Suites list */}
      <div className={`md:col-span-4 border-r border-slate-800 bg-slate-950/40 p-4 space-y-4 ${mobileActive ? "hidden md:block" : "block"}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio size={14} className="animate-pulse text-amber-400" />
            Room Suites
          </span>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <button
                onClick={() => setShowCreateRoomModal(true)}
                title="Create New Room Suite (Admin)"
                className="px-2 py-1 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus size={12} />
                <span>New Suite</span>
              </button>
            )}
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Action Controls for Admin */}
        {isAdmin && (
          <div className="grid grid-cols-2 gap-2 pt-1 border-b border-slate-800/80 pb-3">
            <button
              onClick={() => setShowCreateRoomModal(true)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-amber-500/60 rounded-xl text-slate-200 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Plus size={12} className="text-amber-400" />
              <span>Create Suite</span>
            </button>
            <button
              onClick={() => setShowMeetingLinkModal(true)}
              className="px-2.5 py-1.5 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/40 rounded-xl text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Video size={12} className="text-emerald-400" />
              <span>Post Meeting</span>
            </button>
          </div>
        )}

        {/* Room List Scroll */}
        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {chatRooms.map((room) => {
            const isActive = activeChatId === room.id;
            const lastMessage = room.messages[room.messages.length - 1];
            return (
              <button
                key={room.id}
                onClick={() => {
                  setActiveChatId(room.id);
                  setMobileActive(true);
                  const updated = chatRooms.map((r) => (r.id === room.id ? { ...r, unread: false } : r));
                  setChatRooms(updated);
                  localStorage.setItem("privateers_db_chats", JSON.stringify(updated));
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-950/30 border-amber-800/80 text-white shadow-md shadow-amber-950/20"
                    : "bg-slate-900/60 border-slate-850 hover:bg-slate-900 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-xs font-serif font-bold ${isActive ? "text-amber-400" : "text-slate-200"}`}>
                    {room.name}
                  </span>
                  {room.unread && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-light line-clamp-1">
                  {room.description}
                </p>
                {lastMessage && (
                  <div className="border-t border-slate-900/50 pt-2 mt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span className="truncate max-w-[140px]">
                      <strong>{lastMessage.sender}</strong>: {lastMessage.text}
                    </span>
                    <span>{lastMessage.time}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Room Messages */}
      <div className={`md:col-span-8 flex flex-col justify-between p-4 md:p-6 min-h-[500px] ${mobileActive ? "block" : "hidden md:flex"}`}>
        {activeRoom ? (
          <>
            {/* Room Header */}
            <div className="border-b border-slate-800 pb-3 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileActive(false)}
                    className="md:hidden p-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-400 hover:text-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                      Active Room Suite Channel
                    </span>
                    <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                      {activeRoom.name}
                    </h4>
                  </div>
                </div>

                {/* Profile Photo Uploader Trigger for Member */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl text-slate-300 hover:text-white text-[10px] font-mono transition-all cursor-pointer"
                    title="Change My Profile Photo"
                  >
                    {currentUserAvatar ? (
                      <img
                        src={currentUserAvatar}
                        alt="My Profile"
                        className="w-5 h-5 rounded-full object-cover border border-amber-500/50"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-amber-400">
                        {session?.name?.charAt(0) || "P"}
                      </div>
                    )}
                    <span className="hidden sm:inline">My Avatar</span>
                    <Camera size={12} className="text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Active Meeting Link Banner if present */}
              {activeRoomMeetingLink && (
                <div className="p-2.5 bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-800/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 truncate">
                    <Video size={16} className="text-emerald-400 animate-pulse flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-bold block text-[11px]">{activeRoomMeetingLink.title}</span>
                      <span className="text-[9px] text-slate-400">Posted by {activeRoomMeetingLink.postedBy} • {activeRoomMeetingLink.platform}</span>
                    </div>
                  </div>
                  <a
                    href={activeRoomMeetingLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all flex-shrink-0 shadow-md shadow-emerald-950/50"
                  >
                    <span>Come Aboard</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Chat Scrollbox */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[380px] min-h-[300px] pr-2 text-left">
              {activeRoom.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <span className="text-2xl">⚓</span>
                  <p className="text-xs text-slate-500 mt-1 font-light">No dispatches in this Room Suite yet. Write first!</p>
                </div>
              ) : (
                activeRoom.messages.map((msg: any, idx: number) => {
                  const isSelf = msg.sender === (session?.name || "Admiral David Chukwuyem");
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 max-w-[85%] ${
                        isSelf ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 mt-0.5">
                        {msg.avatar ? (
                          <img
                            src={msg.avatar}
                            alt={msg.sender}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shadow"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-amber-400">
                            {msg.sender?.charAt(0) || "P"}
                          </div>
                        )}
                      </div>

                      <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1">
                          <span className="font-bold text-slate-200">{msg.sender}</span>
                          <span>•</span>
                          <span className="text-amber-400/90">({msg.rank})</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isSelf
                              ? "bg-[#0c2444] border border-[#143763] text-slate-100 rounded-tr-none"
                              : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">{msg.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendChatMessage}
              className="border-t border-slate-800 pt-4 flex gap-3"
            >
              <input
                type="text"
                required
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Dispatch message to ${activeRoom.name}...`}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-white"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl border border-amber-500 hover:brightness-110 flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-amber-950/30"
              >
                <span>Send</span>
                <Anchor size={12} className="text-slate-950" />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <span className="text-2xl">⚓</span>
            <p className="text-xs text-slate-500 mt-1 font-light">Select a Room Suite to open connection.</p>
          </div>
        )}
      </div>

      {/* MODAL 1: Admin Create Room Suite */}
      {showCreateRoomModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-amber-400" />
                Admin: Create Room Suite
              </h3>
              <button
                onClick={() => setShowCreateRoomModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoomSuite} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Room Suite Name *</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="E.g. Coastal Operations Suite"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description / Purpose</label>
                <textarea
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  rows={2}
                  placeholder="Dedicated room suite for maritime logistics and general privateer chat..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Suite Category</label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="General Suite">General Suite</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Logistics Suite">Logistics Suite</option>
                  <option value="Welfare Suite">Welfare Suite</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Create Room Suite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Admin Post Meeting Link */}
      {showMeetingLinkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Video size={16} className="text-emerald-400" />
                Admin: Post Official Meeting Link
              </h3>
              <button
                onClick={() => setShowMeetingLinkModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostMeetingLink} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="E.g. WhatsApp Privateers Group / Google Meet Assembly"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Platform Type</label>
                <select
                  value={meetingPlatform}
                  onChange={(e) => setMeetingPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="WhatsApp">WhatsApp Group Link</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom Meeting</option>
                  <option value="Custom">Custom Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Meeting URL *</label>
                <input
                  type="text"
                  required
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://chat.whatsapp.com/... or https://meet.google.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Target Room Suite</label>
                <select
                  value={meetingTargetRoom}
                  onChange={(e) => setMeetingTargetRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Room Suites (Broadcast Banner)</option>
                  {chatRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMeetingLinkModal(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Upload & Post Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Member Profile Photo Update */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Camera size={16} className="text-amber-400" />
                Update My Profile Photo
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Upload Photo File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500">OR IMAGE URL</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Photo Image Web URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleSaveAvatarUrl}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-all cursor-pointer"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Preview */}
              {currentUserAvatar && (
                <div className="pt-2 flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <img
                    src={currentUserAvatar}
                    alt="Current Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-amber-500"
                  />
                  <span className="text-xs text-slate-300 font-mono">Current Profile Picture Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

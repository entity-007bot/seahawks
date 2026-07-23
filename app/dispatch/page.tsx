"use client";
import React, { useState, useEffect } from "react";
import { ChatRoom } from "@/components/chat-room";
import { MessageSquare, Anchor, Shield, LogOut, ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const defaultChats: any[] = [];

export default function DispatchPage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(() => {
        if (typeof window === "undefined") return null;
        const savedSession = localStorage.getItem("privateers_session");
        if (savedSession) {
            try {
                return JSON.parse(savedSession);
            } catch (e) {
                console.error(e);
            }
        }
        return {
            name: "Admiral David Chukwuyem",
            rank: "Admiral",
            mqeNumber: "MQE-0000001",
            superAdmin: true,
            status: "ACTIVE"
        };
    });

    const [chatRooms, setChatRooms] = useState<any[]>(() => {
        if (typeof window === "undefined") return defaultChats;
        const localChats = localStorage.getItem("privateers_db_chats");
        if (localChats) {
            try {
                return JSON.parse(localChats);
            } catch (e) {
                return defaultChats;
            }
        }
        localStorage.setItem("privateers_db_chats", JSON.stringify(defaultChats));
        return defaultChats;
    });

    const clearAllDummyChats = () => {
        if (confirm("Are you sure you want to delete all dummy test chat messages from all channels?")) {
            const cleanChannels = chatRooms.map(room => ({
                ...room,
                unread: false,
                messages: []
            }));
            setChatRooms(cleanChannels);
            localStorage.setItem("privateers_db_chats", JSON.stringify(cleanChannels));
            alert("✓ All dummy chats deleted! Channels are now 100% clean for live member messaging.");
        }
    };

    const resetChatsToDefault = () => {
        if (confirm("Are you sure you want to reset all channel dispatches to default structure?")) {
            const cleanDefaults = defaultChats.map(room => ({
                ...room,
                unread: false,
                messages: []
            }));
            localStorage.setItem("privateers_db_chats", JSON.stringify(cleanDefaults));
            setChatRooms(cleanDefaults);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col">
            {/* Elegant Header */}
            <header className="h-20 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <Link 
                        href="/dashboard"
                        className="p-2 sm:p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline text-xs font-mono uppercase tracking-wider">Dashboard</span>
                    </Link>
                    <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <Anchor className="text-amber-500 animate-pulse hidden sm:block" size={20} />
                        <div>
                            <h1 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                                Privateers Mess
                            </h1>
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                                SAEAHAWKS Secure Link
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Clear All Dummy Chats Button */}
                    <button
                        onClick={clearAllDummyChats}
                        title="Delete All Dummy Chats"
                        className="px-2.5 py-1.5 bg-red-950/40 border border-red-900/50 hover:bg-red-900/60 rounded-xl text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete Dummy Chats</span>
                    </button>

                    {/* Reset Button */}
                    <button
                        onClick={resetChatsToDefault}
                        title="Reset Chats to Default"
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-amber-500 rounded-xl text-slate-400 transition-all cursor-pointer"
                    >
                        <RefreshCw size={15} />
                    </button>

                    {/* Member Info */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <div className="text-left font-mono">
                            <span className="text-[8px] text-slate-500 block uppercase font-bold">COMMISSIONED</span>
                            <span className="text-[10px] font-bold text-amber-500 uppercase">{session?.rank || "Admiral"}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="text-amber-500" size={24} />
                            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-wide">
                                Sovereign Dispatch Fleet
                            </h2>
                        </div>
                        <p className="text-xs text-slate-400 font-light max-w-2xl">
                            Real-time encrypted communication lines. Exchange secure tactical, relief, logistics, and historical coordination updates directly with active fleets.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                        <span className="px-2.5 py-1 bg-red-950/40 border border-red-900 text-amber-500 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider">
                            SECURE FEED
                        </span>
                        <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-[10px] font-mono uppercase font-bold">
                            256-BIT CJS
                        </span>
                    </div>
                </div>

                {chatRooms.length > 0 ? (
                    <ChatRoom chatRooms={chatRooms} setChatRooms={setChatRooms} session={session} />
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 text-center space-y-3">
                        <RefreshCw className="text-amber-500 animate-spin" size={32} />
                        <h4 className="font-serif text-base font-bold text-slate-300">Initializing Fleet Comms...</h4>
                        <p className="text-xs text-slate-500 max-w-xs font-light">Establishing handshake with Delta port servers.</p>
                    </div>
                )}
            </main>

            {/* Beautiful Footer */}
            <footer className="py-6 border-t border-slate-900 bg-slate-950/60 text-center">
                <p className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
                    © 2026 National Association of Privateers • Great Niger Delta Chapter
                </p>
            </footer>
        </div>
    );
}

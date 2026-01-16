"use client";

import Layout from "@/components/Layout";
import ChatSidebar from "@/components/chat/ChatSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout>
            <div className="flex h-[calc(100vh-8rem)] rounded-2xl border bg-background overflow-hidden shadow-sm">
                <ChatSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    {children}
                </div>
            </div>
        </Layout>
    );
}

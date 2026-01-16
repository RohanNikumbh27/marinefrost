"use client";

import { MessageSquare } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/20">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome to MarineChat</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
                Select a channel from the sidebar or start a new conversation.
            </p>
        </div>
    );
}

"use client";

import Layout from "@/components/Layout";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <Layout>
            <div className="flex h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] overflow-hidden -mx-6 -my-8 md:mx-0 md:my-0 md:rounded-2xl md:border md:bg-background md:shadow-sm">
                {/* Desktop Sidebar - hidden on mobile */}
                <div className="hidden md:block w-72 border-r h-full">
                    <ChatSidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2 p-2 bg-background/50 backdrop-blur-md shrink-0">
                        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-[300px] [&>button]:hidden">
                                <ChatSidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        <h1 className="font-semibold text-base truncate">MarineChat</h1>
                    </div>

                    {children}
                </div>
            </div>
        </Layout>
    );
}

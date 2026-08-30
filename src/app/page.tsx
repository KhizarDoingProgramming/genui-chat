import { ChatContainer } from "@/components/chat/ChatContainer";
import { DevSabotagePanel } from "@/components/chat/DevSabotagePanel";

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col bg-background">
      <a href="#chat-input" className="skip-link">
        Skip to chat input
      </a>
      <ChatContainer />
      <DevSabotagePanel />
    </main>
  );
}

import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage } = useChatStore();

  const quickReplies = [
    "yem chestunnavu",
    "tamaru yela vunnaru",
    "Tinnava",
    "oyy rukus",
  ];

  const handleQuickReply = (text) => {
    const messageText = String(text || "").trim();
    if (!messageText) return;
    sendMessage({ text: messageText, image: null });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-[#8b7355]/15 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="size-8 text-[#8b7355]" />
      </div>
      <h3 className="text-lg font-medium text-[#4a2c1c] mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-[#4a2c1c]/70 text-sm">
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#d4a574]/40 to-transparent mx-auto"></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {quickReplies.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => handleQuickReply(text)}
            className="px-4 py-2 text-xs font-medium text-[#4a2c1c] bg-[#8b7355]/15 rounded-full hover:bg-[#8b7355]/25 transition-colors"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
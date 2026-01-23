import React from 'react'
import { useState ,useRef} from 'react';
import useKeyBoardSound from '../hooks/useKeyboardSound';
import { useChatStore } from '../store/useChatStore';
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const {playRandomStrokes}=useKeyBoardSound();
  const [text,setText]=useState("");
  const [imagePreview,setImagePreview]=useState(null);
  const fileInputRef=useRef(null);

  const {sendMessage,isSoundEnabled}=useChatStore();

  const handleInputChange=(e)=>{
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (isSoundEnabled) playRandomStrokes();

    sendMessage({
      text: text.trim(),
      image : imagePreview,
    })
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange=(e)=>{
    const file=e.target.files?.[0];
    if (!file) return;
    if(!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader=new FileReader();
    reader.onloadend=()=>{
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage=()=>{
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="p-4 border-t border-[#d4a574]/30 bg-[#a0826d]/20 backdrop-blur-sm">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#d4a574]/40"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#8b7355] flex items-center justify-center text-white hover:bg-[#7a654b]"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleInputChange} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isSoundEnabled) playRandomStrokes();
          }}
          className="flex-1 bg-[#8b7355]/15 border border-[#d4a574]/30 rounded-lg py-2 px-4 text-[#4a2c1c] placeholder:text-[#4a2c1c]/60"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-[#8b7355]/15 text-[#4a2c1c]/70 hover:text-[#4a2c1c] border border-transparent rounded-lg px-4 transition-colors ${
            imagePreview ? "text-[#8b7355]" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-[#8b7355] text-white rounded-lg px-4 py-2 font-medium hover:bg-[#7a654b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
        </form>
    </div>
  )
}

export default MessageInput

import React from 'react'
import { useChatStore } from '../store/useChatStore'

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore()
  const baseTab =
    'tab border border-transparent text-[#4a2c1c] focus:outline-none focus-visible:outline-none focus-visible:ring-0'
  const active = 'bg-[#8b7355]/25 border-[#8b7355]/40'
  const inactive = 'text-[#4a2c1c]/70 hover:text-[#4a2c1c] hover:bg-[#8b7355]/10'

  return (
    <div className="tabs tabs-boxed bg-transparent px-4 py-2">
      <button
        type="button"
        onClick={() => setActiveTab('chats')}
        className={`${baseTab} ${activeTab === 'chats' ? active : inactive}`}
      >
        chats
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('contacts')}
        className={`${baseTab} ${activeTab === 'contacts' ? active : inactive}`}
      >
        contacts
      </button>
      
    </div>
  )
}

export default ActiveTabSwitch

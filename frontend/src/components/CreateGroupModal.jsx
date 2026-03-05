import { useState, useEffect } from "react";
import { XIcon, SearchIcon, CheckIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";

function CreateGroupModal({ onClose }) {
    const { allContacts, getAllContacts } = useChatStore();
    const { createGroup, isCreatingGroup } = useGroupStore();

    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (allContacts.length === 0) getAllContacts();
    }, [allContacts.length, getAllContacts]);

    const filteredContacts = allContacts.filter((c) => {
        const name = (c.fullname || c.fullName || "").toLowerCase();
        return name.includes(search.toLowerCase());
    });

    const toggleMember = (userId) => {
        setSelectedMembers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (!groupName.trim()) return;
        const result = await createGroup({ name: groupName.trim(), memberIds: selectedMembers });
        if (result) onClose();
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-[#4a2c1c]">Create Group</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Group Name */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text text-[#4a2c1c]">Group Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter group name..."
                        className="input input-bordered bg-white/60 text-[#4a2c1c] border-[#d4a574]/40 focus:border-[#d4a574] focus:outline-none"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        maxLength={100}
                        autoFocus
                    />
                </div>

                {/* Member Search */}
                <div className="form-control mb-3">
                    <label className="label">
                        <span className="label-text text-[#4a2c1c]">Add Members</span>
                        <span className="label-text-alt text-[#4a2c1c]/60">{selectedMembers.length} selected</span>
                    </label>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a2c1c]/50" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="input input-bordered input-sm bg-white/60 text-[#4a2c1c] border-[#d4a574]/40 focus:outline-none pl-9 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
                    {filteredContacts.map((contact) => {
                        const isSelected = selectedMembers.includes(contact._id);
                        return (
                            <div
                                key={contact._id}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                    isSelected ? "bg-[#d4a574]/30" : "hover:bg-[#8b7355]/15"
                                }`}
                                onClick={() => toggleMember(contact._id)}
                            >
                                <div className="avatar">
                                    <div className="size-8 rounded-full">
                                        <img
                                            src={contact.profilepic || contact.profilePic || "/avathar.png"}
                                            alt={contact.fullname || contact.fullName}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm text-[#4a2c1c] flex-1 truncate">
                                    {contact.fullname || contact.fullName}
                                </span>
                                {isSelected && <CheckIcon className="w-4 h-4 text-green-600" />}
                            </div>
                        );
                    })}
                    {filteredContacts.length === 0 && (
                        <p className="text-center text-sm text-[#4a2c1c]/50 py-4">No contacts found</p>
                    )}
                </div>

                {/* Actions */}
                <div className="modal-action">
                    <button className="btn btn-ghost text-[#4a2c1c] hover:bg-[#8b7355]/20" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn bg-[#8b7355] hover:bg-[#6b5640] text-white border-none"
                        disabled={!groupName.trim() || isCreatingGroup}
                        onClick={handleCreate}
                    >
                        {isCreatingGroup ? <span className="loading loading-spinner loading-sm" /> : "Create"}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}

export default CreateGroupModal;

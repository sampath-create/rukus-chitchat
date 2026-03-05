import { useState } from "react";
import { XIcon, UsersIcon, PencilIcon, UserPlusIcon, LogOutIcon, Trash2Icon, CheckIcon, CrownIcon } from "lucide-react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function GroupChatHeader() {
    const { selectedGroup, setSelectedGroup, updateGroup, leaveGroup, deleteGroup } = useGroupStore();
    const { authUser } = useAuthStore();
    const { allContacts, getAllContacts } = useChatStore();

    const [showInfo, setShowInfo] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isAdmin = selectedGroup?.admin?._id === authUser?._id;

    const handleSaveName = async () => {
        if (!newName.trim()) return;
        await updateGroup(selectedGroup._id, { name: newName.trim() });
        setIsEditingName(false);
    };

    return (
        <>
            <div className="flex justify-between items-center bg-[#8b7355]/15 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
                <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => setShowInfo(true)}
                >
                    <div className="avatar placeholder">
                        <div className="w-12 rounded-full bg-[#d4a574] text-[#4a2c1c]">
                            {selectedGroup?.groupPic ? (
                                <img src={selectedGroup.groupPic} alt={selectedGroup.name} />
                            ) : (
                                <span className="text-lg font-bold">
                                    {selectedGroup?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-200 font-medium">{selectedGroup?.name}</h3>
                        <p className="text-slate-400 text-sm">
                            {selectedGroup?.members?.length} member{selectedGroup?.members?.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <button onClick={() => { setSelectedGroup(null); }}>
                    <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
                </button>
            </div>

            {/* Group Info Modal */}
            <dialog className={`modal ${showInfo ? "modal-open" : ""}`}>
                <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40 max-w-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-[#4a2c1c]">Group Info</h3>
                        <button onClick={() => setShowInfo(false)} className="btn btn-ghost btn-sm btn-circle">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Group avatar & name */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="avatar placeholder mb-2">
                            <div className="w-20 rounded-full bg-[#d4a574] text-[#4a2c1c]">
                                {selectedGroup?.groupPic ? (
                                    <img src={selectedGroup.groupPic} alt={selectedGroup.name} />
                                ) : (
                                    <span className="text-3xl font-bold">
                                        {selectedGroup?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="input input-bordered input-sm bg-white/60 text-[#4a2c1c] border-[#d4a574]/40 focus:outline-none"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    maxLength={100}
                                    autoFocus
                                />
                                <button onClick={handleSaveName} className="btn btn-sm btn-ghost">
                                    <CheckIcon className="w-4 h-4 text-green-600" />
                                </button>
                                <button onClick={() => setIsEditingName(false)} className="btn btn-sm btn-ghost">
                                    <XIcon className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h4 className="text-xl font-semibold text-[#4a2c1c]">{selectedGroup?.name}</h4>
                                {isAdmin && (
                                    <button
                                        onClick={() => { setNewName(selectedGroup?.name || ""); setIsEditingName(true); }}
                                        className="btn btn-ghost btn-xs"
                                        title="Edit group name"
                                    >
                                        <PencilIcon className="w-3.5 h-3.5 text-[#4a2c1c]/60" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Members list */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-[#4a2c1c]/80">
                                <UsersIcon className="w-4 h-4 inline mr-1" />
                                Members ({selectedGroup?.members?.length})
                            </h5>
                            {isAdmin && (
                                <button
                                    onClick={() => { setShowAddMembers(true); setShowInfo(false); if (allContacts.length === 0) getAllContacts(); }}
                                    className="btn btn-ghost btn-xs text-[#4a2c1c]"
                                >
                                    <UserPlusIcon className="w-3.5 h-3.5" /> Add
                                </button>
                            )}
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {selectedGroup?.members?.map((member) => (
                                <div key={member._id} className="flex items-center gap-3 p-2 rounded-lg">
                                    <div className="avatar">
                                        <div className="size-8 rounded-full">
                                            <img
                                                src={member.profilepic || member.profilePic || "/avathar.png"}
                                                alt={member.fullname || member.fullName}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm text-[#4a2c1c] flex-1 truncate">
                                        {member.fullname || member.fullName}
                                        {member._id === authUser?._id && " (You)"}
                                    </span>
                                    {member._id === selectedGroup?.admin?._id && (
                                        <span className="badge badge-sm bg-[#d4a574] text-[#4a2c1c] border-none gap-1">
                                            <CrownIcon className="w-3 h-3" /> Admin
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        {!isAdmin && (
                            <button
                                className="btn btn-outline btn-warning btn-sm"
                                onClick={() => { setShowInfo(false); setShowLeaveConfirm(true); }}
                            >
                                <LogOutIcon className="w-4 h-4" /> Leave Group
                            </button>
                        )}
                        {isAdmin && (
                            <button
                                className="btn btn-outline btn-error btn-sm"
                                onClick={() => { setShowInfo(false); setShowDeleteConfirm(true); }}
                            >
                                <Trash2Icon className="w-4 h-4" /> Delete Group
                            </button>
                        )}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setShowInfo(false)}>close</button>
                </form>
            </dialog>

            {/* Add Members Modal */}
            <AddMembersModal
                show={showAddMembers}
                onClose={() => setShowAddMembers(false)}
                group={selectedGroup}
                contacts={allContacts}
            />

            {/* Leave Confirmation */}
            <dialog className={`modal ${showLeaveConfirm ? "modal-open" : ""}`}>
                <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40">
                    <h3 className="font-bold text-lg text-[#4a2c1c]">Leave Group</h3>
                    <p className="py-4 text-[#4a2c1c]/80">
                        Leave <span className="font-semibold">{selectedGroup?.name}</span>?
                    </p>
                    <div className="modal-action">
                        <button className="btn btn-ghost text-[#4a2c1c]" onClick={() => setShowLeaveConfirm(false)}>Cancel</button>
                        <button
                            className="btn bg-orange-500 hover:bg-orange-600 text-white border-none"
                            onClick={() => { leaveGroup(selectedGroup._id); setShowLeaveConfirm(false); }}
                        >
                            Leave
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setShowLeaveConfirm(false)}>close</button>
                </form>
            </dialog>

            {/* Delete Confirmation */}
            <dialog className={`modal ${showDeleteConfirm ? "modal-open" : ""}`}>
                <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40">
                    <h3 className="font-bold text-lg text-[#4a2c1c]">Delete Group</h3>
                    <p className="py-4 text-[#4a2c1c]/80">
                        Delete <span className="font-semibold">{selectedGroup?.name}</span> and all messages? This cannot be undone.
                    </p>
                    <div className="modal-action">
                        <button className="btn btn-ghost text-[#4a2c1c]" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        <button
                            className="btn bg-red-500 hover:bg-red-600 text-white border-none"
                            onClick={() => { deleteGroup(selectedGroup._id); setShowDeleteConfirm(false); }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setShowDeleteConfirm(false)}>close</button>
                </form>
            </dialog>
        </>
    );
}

// Sub-component for adding members
function AddMembersModal({ show, onClose, group, contacts }) {
    const { addMembers } = useGroupStore();
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");

    const currentMemberIds = new Set((group?.members || []).map((m) => m._id));

    const availableContacts = contacts.filter(
        (c) => !currentMemberIds.has(c._id) && (c.fullname || c.fullName || "").toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleAdd = async () => {
        if (selected.length === 0) return;
        await addMembers(group._id, selected);
        setSelected([]);
        setSearch("");
        onClose();
    };

    if (!show) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-[#4a2c1c]">Add Members</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="input input-bordered input-sm bg-white/60 text-[#4a2c1c] border-[#d4a574]/40 focus:outline-none w-full mb-3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
                    {availableContacts.map((contact) => {
                        const isSelected = selected.includes(contact._id);
                        return (
                            <div
                                key={contact._id}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                    isSelected ? "bg-[#d4a574]/30" : "hover:bg-[#8b7355]/15"
                                }`}
                                onClick={() => toggle(contact._id)}
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
                    {availableContacts.length === 0 && (
                        <p className="text-center text-sm text-[#4a2c1c]/50 py-4">No more contacts to add</p>
                    )}
                </div>

                <div className="modal-action">
                    <button className="btn btn-ghost text-[#4a2c1c]" onClick={onClose}>Cancel</button>
                    <button
                        className="btn bg-[#8b7355] hover:bg-[#6b5640] text-white border-none"
                        disabled={selected.length === 0}
                        onClick={handleAdd}
                    >
                        Add ({selected.length})
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}

export default GroupChatHeader;

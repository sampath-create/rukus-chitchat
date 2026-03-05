import { useEffect, useState } from "react";
import { PlusIcon, UsersIcon, Trash2Icon, LogOutIcon } from "lucide-react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import CreateGroupModal from "./CreateGroupModal";

function GroupList() {
    const {
        groups,
        isGroupsLoading,
        getMyGroups,
        setSelectedGroup,
        selectedGroup,
        deleteGroup,
        leaveGroup,
        subscribeToGroupEvents,
        unsubscribeFromGroupEvents,
    } = useGroupStore();
    const { setSelectedUser } = useChatStore();
    const { authUser } = useAuthStore();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [groupToLeave, setGroupToLeave] = useState(null);

    useEffect(() => {
        getMyGroups();
        subscribeToGroupEvents();
        return () => unsubscribeFromGroupEvents();
    }, [getMyGroups, subscribeToGroupEvents, unsubscribeFromGroupEvents]);

    const handleSelectGroup = (group) => {
        setSelectedUser(null); // deselect any DM
        setSelectedGroup(group);
    };

    const handleDeleteGroup = (e, group) => {
        e.stopPropagation();
        setGroupToDelete(group);
    };

    const handleLeaveGroup = (e, group) => {
        e.stopPropagation();
        setGroupToLeave(group);
    };

    if (isGroupsLoading) return <UsersLoadingSkeleton />;

    return (
        <>
            {/* Create group button */}
            <button
                onClick={() => setShowCreateModal(true)}
                className="w-full flex items-center gap-2 p-3 rounded-lg bg-[#8b7355]/15 hover:bg-[#8b7355]/30 transition-colors text-[#4a2c1c] mb-2"
            >
                <PlusIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Create Group</span>
            </button>

            {groups.length === 0 ? (
                <div className="text-center py-6 text-[#4a2c1c]/50">
                    <UsersIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No groups yet</p>
                </div>
            ) : (
                groups.map((group) => {
                    const isAdmin = group.admin?._id === authUser?._id;
                    const isSelected = selectedGroup?._id === group._id;
                    return (
                        <div
                            key={group._id}
                            className={`group p-4 rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                    ? "bg-[#8b7355]/40"
                                    : "bg-[#8b7355]/25 hover:bg-[#8b7355]/35"
                            }`}
                            onClick={() => handleSelectGroup(group)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="avatar placeholder">
                                    <div className="size-12 rounded-full bg-[#d4a574] text-[#4a2c1c]">
                                        {group.groupPic ? (
                                            <img src={group.groupPic} alt={group.name} />
                                        ) : (
                                            <span className="text-lg font-bold">{group.name?.charAt(0)?.toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[#4a2c1c] font-medium truncate">{group.name}</h4>
                                    <p className="text-xs text-[#4a2c1c]/60 truncate">
                                        {group.members?.length} member{group.members?.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                {isAdmin ? (
                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteGroup(e, group)}
                                        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
                                        title="Delete group"
                                    >
                                        <Trash2Icon className="w-4 h-4 text-red-500" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={(e) => handleLeaveGroup(e, group)}
                                        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-orange-100 transition-all"
                                        title="Leave group"
                                    >
                                        <LogOutIcon className="w-4 h-4 text-orange-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <CreateGroupModal onClose={() => setShowCreateModal(false)} />
            )}

            {/* Delete Group Confirmation Modal */}
            <dialog className={`modal ${groupToDelete ? "modal-open" : ""}`}>
                <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40">
                    <h3 className="font-bold text-lg text-[#4a2c1c]">Delete Group</h3>
                    <p className="py-4 text-[#4a2c1c]/80">
                        Delete <span className="font-semibold text-[#4a2c1c]">{groupToDelete?.name}</span> and all its messages? This cannot be undone.
                    </p>
                    <div className="modal-action">
                        <button className="btn btn-ghost text-[#4a2c1c] hover:bg-[#8b7355]/20" onClick={() => setGroupToDelete(null)}>Cancel</button>
                        <button
                            className="btn bg-red-500 hover:bg-red-600 text-white border-none"
                            onClick={() => { deleteGroup(groupToDelete._id); setGroupToDelete(null); }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setGroupToDelete(null)}>close</button>
                </form>
            </dialog>

            {/* Leave Group Confirmation Modal */}
            <dialog className={`modal ${groupToLeave ? "modal-open" : ""}`}>
                <div className="modal-box bg-[#f5e6d3] border border-[#d4a574]/40">
                    <h3 className="font-bold text-lg text-[#4a2c1c]">Leave Group</h3>
                    <p className="py-4 text-[#4a2c1c]/80">
                        Leave <span className="font-semibold text-[#4a2c1c]">{groupToLeave?.name}</span>? You won't receive new messages from this group.
                    </p>
                    <div className="modal-action">
                        <button className="btn btn-ghost text-[#4a2c1c] hover:bg-[#8b7355]/20" onClick={() => setGroupToLeave(null)}>Cancel</button>
                        <button
                            className="btn bg-orange-500 hover:bg-orange-600 text-white border-none"
                            onClick={() => { leaveGroup(groupToLeave._id); setGroupToLeave(null); }}
                        >
                            Leave
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setGroupToLeave(null)}>close</button>
                </form>
            </dialog>
        </>
    );
}

export default GroupList;

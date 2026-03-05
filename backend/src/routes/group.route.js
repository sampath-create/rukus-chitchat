import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import {
    createGroup,
    getMyGroups,
    getGroupById,
    addMembers,
    leaveGroup,
    updateGroup,
    deleteGroup,
    getGroupMessages,
    sendGroupMessage,
} from "../controllers/group.controller.js";

const router = express.Router();
router.use(arcjetProtection, protectRoute);

router.post("/", createGroup);               // POST   /api/groups
router.get("/", getMyGroups);                 // GET    /api/groups
router.get("/:groupId", getGroupById);        // GET    /api/groups/:groupId
router.patch("/:groupId", updateGroup);       // PATCH  /api/groups/:groupId
router.delete("/:groupId", deleteGroup);      // DELETE /api/groups/:groupId
router.post("/:groupId/members", addMembers); // POST   /api/groups/:groupId/members
router.post("/:groupId/leave", leaveGroup);   // POST   /api/groups/:groupId/leave
router.get("/:groupId/messages", getGroupMessages);    // GET  /api/groups/:groupId/messages
router.post("/:groupId/messages", sendGroupMessage);   // POST /api/groups/:groupId/messages

export default router;

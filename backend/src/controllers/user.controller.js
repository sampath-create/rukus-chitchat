import User from "../Models/User.js";

export const searchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const rawQuery = String(req.query.q || "").trim();

    if (!rawQuery) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(rawQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const users = await User.find({
      _id: { $ne: loggedInUserId },
      $or: [{ fullname: regex }, { email: regex }],
    })
      .select("-password")
      .limit(15);

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

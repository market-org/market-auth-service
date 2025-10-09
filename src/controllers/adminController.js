import User from "../models/Users.js";

// Delete user by ID (Admin only)

export const deleteUser = async (req, res) => {
  try {
 
    // Check if the requester is an admin

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌   Du kannst nicht delete   " });
    }

    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "❌  this user not exist " });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: `✅  this user  ${user.name} has been deleted ` });
  } catch (error) {
    res.status(500).json({
      message: "❌   Error deleting user",
      error: error.message,
    });
  }
};

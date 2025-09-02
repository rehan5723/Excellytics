// backend/controllers/adminController.js
import User from "../models/User.js";
import Spreadsheet from "../models/Spreadsheet.js";
import LoginHistory from "../models/loginHistory.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

// Get all datasets
export const getDatasets = async (req, res) => {
  try {
    const datasets = await Spreadsheet.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(
      datasets.map((d) => ({
        _id: d._id,
        fileName: d.name,
        rowCount: d.data?.length || 0,
        uploadedBy: d.user,
        uploadedAt: d.createdAt,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch datasets", error });
  }
};

// Delete a dataset by ID
export const deleteDataset = async (req, res) => {
  try {
    const { id } = req.params;
    await Spreadsheet.findByIdAndDelete(id);
    res.status(200).json({ message: "Dataset deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete dataset", error });
  }
};

// Get login history
export const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find()
      .populate("user", "name email")
      .sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch login history", error });
  }
};

// Delete a login history entry by ID
export const deleteLoginHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await LoginHistory.findByIdAndDelete(id);
    res.status(200).json({ message: "Login history entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete login history entry", error });
  }
};

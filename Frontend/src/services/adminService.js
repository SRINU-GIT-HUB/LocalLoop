import api from "./api";

// ==========================================
// OVERVIEW & STATS
// ==========================================
const getDashboardStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

// ==========================================
// USER MANAGEMENT
// ==========================================
const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

const updateUser = async (id, updates) => {
  // 'updates' is an object like { role: "LEADER" } or { status: "suspended" }
  const response = await api.put(`/admin/users/${id}`, updates);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// ==========================================
// COMMUNITY MANAGEMENT
// ==========================================
const getAllCommunities = async () => {
  const response = await api.get("/admin/communities");
  return response.data;
};

const updateCommunity = async (id, updates) => {
  const response = await api.put(`/admin/communities/${id}`, updates);
  return response.data;
};

const deleteCommunity = async (id) => {
  const response = await api.delete(`/admin/communities/${id}`);
  return response.data;
};

// ==========================================
// LISTING MANAGEMENT
// ==========================================
const getAllListings = async () => {
  const response = await api.get("/admin/listings");
  return response.data;
};

const updateListingAsAdmin = async (id, updates) => {
  const response = await api.put(`/admin/listings/${id}`, updates);
  return response.data;
};

const deleteListingAsAdmin = async (id) => {
  const response = await api.delete(`/admin/listings/${id}`);
  return response.data;
};

// ==========================================
// PROVIDER APPROVALS
// ==========================================
const getPendingProviders = async () => {
  const response = await api.get("/admin/providers/pending");
  return response.data;
};

const updateProviderStatus = async (id, status) => {
  // Notice we pass 'status' as a query parameter (?status=APPROVED) 
  // to match the Spring Boot @RequestParam
  const response = await api.put(`/admin/providers/${id}/status?status=${status}`);
  return response.data;
};

// Export all functions as a single service object
const adminService = {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllCommunities,
  updateCommunity,
  deleteCommunity,
  getAllListings,
  updateListingAsAdmin,
  deleteListingAsAdmin,
  getPendingProviders,
  updateProviderStatus,
};

export default adminService;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [formData, setFormData] = useState({
    companyname: "",
    title: "",
    description: "",
    apply_link: "",
    image_link: "",
    url: "",
  });
  const [editJobId, setEditJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const jobsPerPage = 8;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchJobs(token);
    }
  }, []);

  const fetchJobs = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://backend-vtwx.onrender.com/api/jobs/adminpanel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
      setTotalPages(Math.ceil(data.length / jobsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search query
  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.companyname.toLowerCase().includes(formData.companyname.toLowerCase()) ||
      job.title.toLowerCase().includes(formData.title.toLowerCase()) ||
      job.description.toLowerCase().includes(formData.description.toLowerCase())
    );

    setFilteredJobs(filtered);
    setTotalPages(Math.ceil(filtered.length / jobsPerPage));
    setCurrentPage(1); // Reset to first page when filtering
  }, [formData, jobs]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.companyname || !formData.title || !formData.description || !formData.apply_link || !formData.image_link || !formData.url) {
      setNotification("All fields are required!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      return; // Exit the function if validation fails
    }

    const token = localStorage.getItem("token");
    const url = editJobId
      ? `https://backend-vtwx.onrender.com/api/jobs/${editJobId}`
      : `https://backend-vtwx.onrender.com/api/jobs`;
    const method = editJobId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchJobs(token);
        resetForm();
        setNotification(editJobId ? "Job updated successfully!" : "Job added successfully!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        const errorMessage = await response.text();
        setError(`Error: ${errorMessage}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const resetForm = () => {
    setEditJobId(null);
    setFormData({
      companyname: "",
      title: "",
      description: "",
      apply_link: "",
      image_link: "",
      url: "",
    });
    setNotification("");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://backend-vtwx.onrender.com/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchJobs(token);
        setNotification("Job deleted successfully!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        const errorMessage = await response.text();
        setError(`Error: ${errorMessage}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleEdit = (job) => {
    setEditJobId(job.id);
    setFormData({
      companyname: job.companyname,
      title: job.title,
      description: job.description,
      apply_link: job.apply_link,
      image_link: job.image_link,
      url: job.url,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-name">Admin Panel</h1>
        <button onClick={() => localStorage.removeItem("token") || navigate("/login")} className="logout-button">
          Logout
        </button>
        <div onClick={() => localStorage.removeItem("token") || navigate("/login")} className="logout-icon">
          <i class="fa-solid fa-right-from-bracket"></i>
        </div>
      </div>
      {notification && (
        <div className={`notification-popup ${notification === "All fields are required!" ? "error" : ""}`}>
          {notification}
        </div>
      )}
      {error && <div className="error">Error: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="submit-container">
          <div className="first-input-container">
            <input
              className="first-input companyname"
              type="text"
              placeholder="Company Name"
              value={formData.companyname}
              onChange={(e) => setFormData({ ...formData, companyname: e.target.value })}
            />
            <input
              className="first-input title"
              type="text"
              placeholder="Company Title/Role"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="second-input-container">
            <textarea
              className="second-input description"
              placeholder="Description Ex:Bachelor's Degree/Master's Degree#         2021/2022/2023/2024#"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              className="second-input"
              type="text"
              placeholder="Apply Link"
              value={formData.apply_link}
              onChange={(e) => setFormData({ ...formData, apply_link: e.target.value })}
            />
            <input
              className="second-input"
              type="text"
              placeholder="Image Link"
              value={formData.image_link}
              onChange={(e) => setFormData({ ...formData, image_link: e.target.value })}
            />
            <input
              className="second-input"
              type="text"
              placeholder="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <button type="submit" className="button">
              {editJobId ? "Update Job" : "Add Job"}
            </button>
            {/* Add this button for navigating to the PopUp page */}
            <button onClick={() => navigate("/popup")} className="navigate-popup-button">
              Manage Popup
            </button>
          </div>
        </div>
      </form>

      <h2 className="job-list-name">Job List</h2>
      <div className="loader-container">
        {loading && <div className="loader"></div>}
      </div>

      <div className="job-list-container">
        <ul className="job-list">
          {paginatedJobs.map((job) => {
            const descriptionPoints = job.description
              ? job.description.split("#").map((point) => point.trim())
              : [];

            return (
              <div key={job.id} className="job-card">
                <h1 className="company-card-name">{job.companyname}</h1>
                <h3>{job.title}</h3>
                <ul className="descriptions-details-side">
                  {descriptionPoints.map((point, index) => (
                    <li className="list-class" key={index}>{point}</li>
                  ))}
                </ul>
                <p>{job.url}</p>
                <div className="button-container">
                  <button className="button add-edit-button" onClick={() => handleEdit(job)}>Edit</button>
                  <button className="button add-edit-button" onClick={() => handleDelete(job.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </ul>
      </div>

      <div className="pagination">
        {[...Array(totalPages).keys()].map((pageNum) => (
          <button
            key={pageNum}
            className={`pagination-button ${currentPage === pageNum + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNum + 1)}
          >
            {pageNum + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

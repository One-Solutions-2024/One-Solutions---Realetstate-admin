import React, { useState, useEffect } from "react";
import "./admin.css"

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);
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

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://backend-vtwx.onrender.com/api/jobs");
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Add or Update job
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editJobId
      ? `https://backend-vtwx.onrender.com/api/jobs/${editJobId}`
      : "https://backend-vtwx.onrender.com/api/jobs";
    const method = editJobId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchJobs(); // Refresh job list
      setEditJobId(null); // Reset form
      setFormData({
        companyname: "",
        title: "",
        description: "",
        apply_link: "",
        image_link: "",
        url: "",
      });
    } else {
      const errorMessage = await response.text();
      setError(`Error: ${errorMessage}`);
    }
  };

  // Delete job
  const handleDelete = async (id) => {
    const response = await fetch(`https://backend-vtwx.onrender.com/api/jobs/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchJobs();
    } else {
      const errorMessage = await response.text();
      setError(`Error: ${errorMessage}`);
    }
  };

  // Fill form for editing
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




  return (
    <div className="admin-container">
      <h1 className="admin-name">Admin Panel</h1>
      

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
              placeholder="Description Ex:Bachelor's Degree/Master's Degree, 2021/2022/2023/2024,"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              className="second-input"

              type="text"
              placeholder="Apply Link"
              value={formData.apply_link}
              onChange={(e) =>
                setFormData({ ...formData, apply_link: e.target.value })
              }
            />
            <input
              className="second-input"

              type="text"
              placeholder="Image Link"
              value={formData.image_link}
              onChange={(e) =>
                setFormData({ ...formData, image_link: e.target.value })
              }
            />
            <input
              className="second-input"

              type="text"
              placeholder="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
            <button type="submit" className="button">
              {editJobId ? "Update Job" : "Add Job"}
            </button>
          </div>
        </div>
      </form>

      <h2 className="job-list-name">Job List</h2>
      <div className="loader-container">
      {loading && <div class="loader"></div>}
      {error && <div>Error: {error}</div>}
      </div>
      
      <div className="job-list-container">
      
        <ul className="job-list">
          {jobs.map((job) => {
            const descriptionPoints = job.description
              ? job.description.split("#").map((point) => point.trim())
              : [];

            return (
              <div key={job.id} className="job-card">
                <h1 className="company-card-name">{job.companyname}</h1>
                <h3>{job.title}</h3>
                <ul className="descriptions-details-side">
                  {descriptionPoints.map((point, index) => (
                    <li key={index}>{point}</li>
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
    </div>
  );
};

export default AdminPanel;

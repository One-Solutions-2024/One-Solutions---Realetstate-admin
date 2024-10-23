import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    apply_link: "",
    image_link: "",
  });
  const [editJobId, setEditJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://backend-dvwo.onrender.com/api/jobs");
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
      ? `https://backend-dvwo.onrender.com/api/jobs/${editJobId}`
      : "https://backend-dvwo.onrender.com/api/jobs";
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
        title: "",
        description: "",
        apply_link: "",
        image_link: "",
      });
    } else {
      const errorMessage = await response.text();
      setError(`Error: ${errorMessage}`);
    }
  };

  // Delete job
  const handleDelete = async (id) => {
    const response = await fetch(`https://backend-dvwo.onrender.com/api/jobs/${id}`, {
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
      title: job.title,
      description: job.description,
      apply_link: job.apply_link,
      image_link: job.image_link,
    });
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Apply Link"
          value={formData.apply_link}
          onChange={(e) =>
            setFormData({ ...formData, apply_link: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image Link"
          value={formData.image_link}
          onChange={(e) =>
            setFormData({ ...formData, image_link: e.target.value })
          }
        />
        <button type="submit">
          {editJobId ? "Update Job" : "Add Job"}
        </button>
      </form>

      <h2>Job List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h1>{job.companyname}</h1>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <button onClick={() => handleEdit(job)}>Edit</button>
            <button onClick={() => handleDelete(job.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;

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
    image_link: "", // This will store the file preview URL
    url: "",
    salary: "",
    location: "",
    job_type: "",
    experience: "",
    batch: "",
  });
  const [imageFile, setImageFile] = useState(null); // Store the uploaded image file
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

  // Handle image file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image_link: reader.result });
      };
      reader.readAsDataURL(file);
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

    if (!formData.companyname || !formData.title || !formData.description || !formData.apply_link || !formData.url || !imageFile) {
      setNotification("All fields are required!");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    const token = localStorage.getItem("token");
    const url = editJobId
      ? `https://backend-vtwx.onrender.com/api/jobs/${editJobId}`
      : `https://backend-vtwx.onrender.com/api/jobs`;
    const method = editJobId ? "PUT" : "POST";

    // Convert formData to include file if required by backend
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    formDataToSend.append("image_file", imageFile);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
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
      salary: "",
      location: "",
      job_type: "",
      experience: "",
      batch: "",
    });
    setImageFile(null); // Reset the image file
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
      salary: job.salary,
      location: job.location,
      job_type: job.job_type,
      experience: job.experience,
      batch: job.batch,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="admin-container">
      {/* Form and job list components remain the same */}

      <form onSubmit={handleSubmit}>
        <div className="submit-container">
          <input
            className="second-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formData.image_link && (
            <img src={formData.image_link} alt="Preview" style={{ width: "200px", height: "auto", marginTop: "10px" }} />
          )}
          <button type="submit" className="button-add">
            {editJobId ? "Update Job" : "Add Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;

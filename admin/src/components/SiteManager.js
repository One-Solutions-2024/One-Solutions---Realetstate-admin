import React, { useEffect, useState } from "react";
import axios from "axios";

const SiteManager = () => {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("view"); // "view", "edit"
    const [currentSite, setCurrentSite] = useState(null);
    const [formData, setFormData] = useState({
        sitename: "",
        sitetitle: "",
        siteaddress: "",
        sitedescription: "",
        category: "",
        videos: "",
        images: [],
    });

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/sites");
                setSites(response.data.sites);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching sites:", error);
                setLoading(false);
            }
        };
        fetchSites();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/sites/${id}`);
            setSites(sites.filter((site) => site.id !== id));
        } catch (error) {
            console.error("Error deleting site:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Append form data
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images") {
                Array.from(value).forEach((file) => data.append("images", file));
            } else {
                data.append(key, value);
            }
        });

        try {
            const response = await axios.put(
                `http://localhost:4000/api/sites/${currentSite.id}`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setSites(
                sites.map((site) =>
                    site.id === currentSite.id ? { ...site, ...response.data.site } : site
                )
            );
            resetForm();
        } catch (error) {
            console.error("Error updating site:", error);
        }
    };

    const resetForm = () => {
        setMode("view");
        setCurrentSite(null);
        setFormData({
            sitename: "",
            sitetitle: "",
            siteaddress: "",
            sitedescription: "",
            category: "",
            videos: "",
            images: [],
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (mode === "view") {
        return (
            <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
                <h1>Site Manager</h1>
                {sites.length === 0 ? (
                    <p>No sites available.</p>
                ) : (
                    sites.map((site) => (
                        <div
                            key={site.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "20px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                            }}
                        >
                            <h2>{site.sitename}</h2>
                            <h3>{site.sitetitle}</h3>
                            <p><strong>Address:</strong> {site.siteaddress}</p>
                            <p><strong>Description:</strong> {site.sitedescription}</p>
                            <p><strong>Category:</strong> {site.category}</p>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {(site.images || "")
                                    .split(",")
                                    .filter((img) => img.trim() !== "")
                                    .map((image, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:4000/uploads/${image}`}
                                            alt={`Site ${index + 1}`}
                                            style={{
                                                width: "150px",
                                                height: "auto",
                                                borderRadius: "4px",
                                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                            }}
                                        />
                                    ))}
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <button
                                    onClick={() => {
                                        setMode("edit");
                                        setCurrentSite(site);
                                        setFormData({
                                            sitename: site.sitename,
                                            sitetitle: site.sitetitle,
                                            siteaddress: site.siteaddress,
                                            sitedescription: site.sitedescription,
                                            category: site.category,
                                            videos: site.videos,
                                            images: [],
                                        });
                                    }}
                                    style={{ marginRight: "10px" }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(site.id)}
                                    style={{
                                        backgroundColor: "#d9534f",
                                        color: "#fff",
                                        border: "none",
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        borderRadius: "4px",
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h1>Edit Site</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Site Name:</label>
                    <input
                        type="text"
                        name="sitename"
                        value={formData.sitename}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Site Title:</label>
                    <input
                        type="text"
                        name="sitetitle"
                        value={formData.sitetitle}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Site Address:</label>
                    <input
                        type="text"
                        name="siteaddress"
                        value={formData.siteaddress}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Site Description:</label>
                    <textarea
                        name="sitedescription"
                        value={formData.sitedescription}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>videos:</label>
                    <input
                        type="text"
                        name="videos"
                        value={formData.videos}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Upload Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
                <button type="submit">Update Site</button>
                <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default SiteManager;

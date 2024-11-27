import React, { useState } from "react";
import axios from "axios";

const AddSite = () => {
    const [sitename, setSitename] = useState("");
    const [sitetitle, setSitetitle] = useState("");
    const [siteaddress, setSiteaddress] = useState("");
    const [sitedescription, setSitedescription] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("sitename", sitename);
        formData.append("sitetitle", sitetitle);
        formData.append("siteaddress", siteaddress);
        formData.append("sitedescription", sitedescription);
        formData.append("category", category);

        // Append multiple images
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            const response = await axios.post("http://localhost:4000/api/sites", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(response.data.message);
            // Clear form
            setSitename("");
            setSitetitle("");
            setSiteaddress("");
            setSitedescription("");
            setCategory("");
            setImages([]);
        } catch (error) {
            console.error(error);
            setMessage("Error adding site.");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h1>Add New Site</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Site Name:</label>
                    <input
                        type="text"
                        value={sitename}
                        onChange={(e) => setSitename(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Site Title:</label>
                    <input
                        type="text"
                        value={sitetitle}
                        onChange={(e) => setSitetitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Site Address:</label>
                    <input
                        type="text"
                        value={siteaddress}
                        onChange={(e) => setSiteaddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Site Description:</label>
                    <textarea
                        value={sitedescription}
                        onChange={(e) => setSitedescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                <button type="submit">Add Site</button>
            </form>
        </div>
    );
};

export default AddSite;

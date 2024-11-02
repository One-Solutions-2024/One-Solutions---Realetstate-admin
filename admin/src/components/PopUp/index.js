import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './popup.css';

const apiUrl = 'https://backend-vtwx.onrender.com/api/popup/adminpanel';

const PopUp = () => {
    const [popups, setPopups] = useState([]);
    const [popup, setPopup] = useState({
        id: null,
        popup_heading: '',
        popup_text: '',
        popup_link: '',
        popup_routing_link: '',
        popup_belowtext: '',
    });
    const [notification, setNotification] = useState('');
    const [file, setFile] = useState(null); // State to hold the selected file
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) fetchPopups(token);
        else navigate("/login");
    }, [navigate]);

    const fetchPopups = async (token) => {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok){
                setNotification("Failed to fetch! Logout and Come again")
                setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds

            }
            const data = await response.json();
            setPopups(data);
        } catch (error) {
            setNotification(error.message);
            setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds

            console.error('Error fetching popups:', error.message);
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "sfdqoeq5");
        formData.append("cloud_name", "dsjcty43b");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dsjcty43b/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            setNotification("Image upload failed. Please try again.");
            setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds

            return null;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPopup((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile); // Update the file state
        if (selectedFile) {
            const imageUrl = await uploadImageToCloudinary(selectedFile);
            if (imageUrl) {
                setPopup((prevData) => ({ ...prevData, popup_link: imageUrl }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const method = popup.id ? 'PUT' : 'POST';
        const url = popup.id ? `${apiUrl}/${popup.id}` : apiUrl;

         // Validate form fields
    if (!popup.popup_heading || !popup.popup_text || !popup.popup_link || !popup.popup_routing_link || !popup.popup_belowtext) {
        setNotification("All fields are required!");
        setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
        return; // Exit the function if validation fails
      }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(popup),
            });
            if (!response.ok) throw new Error(await response.text());

            setNotification(popup.id ? 'Popup updated successfully!' : 'Popup created successfully!');
            fetchPopups(token);
            resetForm();
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            setNotification(error.message);
            console.error('Error saving popup:', error.message);
        }
    };

    const handleEdit = (popup) => {
        setPopup(popup);
        setFile(null); // Reset the file state on edit
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(await response.text());

            setNotification('Popup deleted successfully!');
            fetchPopups(token);
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            setNotification(error.message);
            setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
            console.error('Error deleting popup:', error.message);
        }
    };

    const resetForm = () => {
        setPopup({
            id: null,
            popup_heading: '',
            popup_text: '',
            popup_link: '',
            popup_routing_link: '',
            popup_belowtext: '',
        });
        setFile(null); // Reset the file input
    };

    return (
        <div className="admin-panel-popup">
            <div className="admin-header">
                <h1 className='popup-name-admin'>Admin Popup Management</h1>
                <button onClick={() => navigate("/admin")} className="navigate-admin-button logout-button">
                    Back to Admin Panel
                </button>
                <div onClick={() => navigate("/admin")} className="logout-icon">
                    <i className="fa-solid fa-right-from-bracket"></i>
                </div>
            </div>

            {notification && <div className="notification-popup">{notification}</div>}

            <form onSubmit={handleSubmit} className='form-container-popup'>
                <input
                    type="text"
                    name="popup_heading"
                    placeholder="Popup Heading"
                    value={popup.popup_heading}
                    onChange={handleChange}
                    className='popup-input'
                    required
                />
                <textarea
                    name="popup_text"
                    className='popup-input popup-description'
                    placeholder="Popup Text"
                    value={popup.popup_text}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className='popup-input'
                />
                {popup.popup_link && (
                    <img src={popup.popup_link} alt="Preview" style={{ width: "200px", height: "auto", marginTop: "10px" }} className="preview-image"/>
                )}
                
                <input
                    type="text"
                    className='popup-input'
                    name="popup_routing_link"
                    placeholder="Popup Routing Link"
                    value={popup.popup_routing_link}
                    onChange={handleChange}
                    required
                />
                <input
                    name="popup_belowtext"
                    className='popup-input'
                    placeholder="Popup Below Text"
                    value={popup.popup_belowtext}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{popup.id ? 'Update' : 'Create'} Popup</button>
            </form>

            <h2 className='popup-name'>Popups</h2>
            <ul className="job-list">
                {popups.map((popup) => (
                    <div key={popup.id} className="job-card">
                        <h3>{popup.popup_heading}</h3>
                        <p>{popup.popup_text}</p>
                        <p><strong>Image Link:</strong>{popup.popup_link.slice(0, 35)}...</p>
                        <p><strong>Routing Link:</strong> {popup.popup_routing_link.slice(0, 35)}...</p>
                        <p><strong>Below Text:</strong> {popup.popup_belowtext}</p>
                        <div className="button-container">
                            <button className='pop-upbutton' onClick={() => handleEdit(popup)}>Edit</button>
                            <button className='pop-upbutton' onClick={() => handleDelete(popup.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default PopUp;

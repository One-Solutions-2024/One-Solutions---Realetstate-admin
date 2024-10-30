import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './popup.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const apiUrl = 'https://backend-vtwx.onrender.com/api/popup/adminpanel'; // Adjust this based on your API path

const PopUp = () => {
    const [popup, setPopup] = useState({
        id: null,
        popup_heading: '',
        popup_text: '',
        popup_Image_link: '',
        popup_routing_link: '',
        popup_belowtext: '',
    });
    
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchPopup();
    }, []);

    const fetchPopup = async () => {
        const token = localStorage.getItem("token"); // Retrieve the token here
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Use the token
                },
            });
            if (response.data) {
                setPopup(response.data);
            }
        } catch (error) {
            console.error('Error fetching popup:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPopup((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // Retrieve the token here
        try {
            const method = popup.id ? 'PUT' : 'POST';
            const url = popup.id ? `${apiUrl}/${popup.id}` : apiUrl;

            await axios({
                method,
                url,
                data: popup,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Use the token
                },
            });

            // Reset form data
            setPopup({
                id: null,
                popup_heading: '',
                popup_text: '',
                popup_Image_link: '',
                popup_routing_link: '',
                popup_belowtext: '',
            });
            fetchPopup(); // Fetch the updated popup
        } catch (error) {
            console.error('Error saving popup:', error);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token"); // Retrieve the token here
        try {
            await axios.delete(`${apiUrl}/${popup.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Use the token
                },
            });
            // Reset form data
            setPopup({
                id: null,
                popup_heading: '',
                popup_text: '',
                popup_Image_link: '',
                popup_routing_link: '',
                popup_belowtext: '',
            });
            fetchPopup(); // Refresh the popup state
        } catch (error) {
            console.error('Error deleting popup:', error);
        }
    };

    return (
        <div className="App">
            <h1>Admin Popup Management</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="popup_heading"
                    placeholder="Popup Heading"
                    value={popup.popup_heading}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="popup_text"
                    placeholder="Popup Text"
                    value={popup.popup_text}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="popup_Image_link"
                    placeholder="Popup Image Link"
                    value={popup.popup_Image_link}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="popup_routing_link"
                    placeholder="Popup Routing Link"
                    value={popup.popup_routing_link}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="popup_belowtext"
                    placeholder="Popup Below Text"
                    value={popup.popup_belowtext}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{popup.id ? 'Update' : 'Save'} Popup</button>
                {popup.id && <button type="button" onClick={handleDelete}>Delete Popup</button>}
            </form>

            {popup.id && (
                <div>
                    <h2>Current Popup</h2>
                    <p><strong>Heading:</strong> {popup.popup_heading}</p>
                    <p><strong>Text:</strong> {popup.popup_text}</p>
                    <p><strong>Image Link:</strong> {popup.popup_Image_link}</p>
                    <p><strong>Routing Link:</strong> {popup.popup_routing_link}</p>
                    <p><strong>Below Text:</strong> {popup.popup_belowtext}</p>
                </div>
            )}

            {/* Add this button for navigating back to Admin Panel */}
            <button onClick={() => navigate("/admin")} className="navigate-admin-button">
                Back to Admin Panel
            </button>
        </div>
    );
};

export default PopUp;

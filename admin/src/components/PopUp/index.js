import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './popup.css';
import { useNavigate } from 'react-router-dom';

const apiUrl = 'https://backend-vtwx.onrender.com/api/popup/adminpanel';

const PopUp = () => {
    const [popup, setPopup] = useState({
        id: null,
        popup_heading: '',
        popup_text: '',
        popup_link: '',
        popup_routing_link: '',
        popup_belowtext: '',
    });
    const [notification, setNotification] = useState(''); // Notification state
    const navigate = useNavigate();

    useEffect(() => {
        fetchPopup();
    }, []);

    const fetchPopup = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
        const token = localStorage.getItem("token");
        try {
            const method = popup.id ? 'PUT' : 'POST';
            const url = popup.id ? `${apiUrl}/${popup.id}` : apiUrl;

            await axios({
                method,
                url,
                data: popup,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Set success notification
            setNotification(popup.id ? 'Popup successfully updated!' : 'Popup successfully saved!');

            // Reset form data
            setPopup({
                id: null,
                popup_heading: '',
                popup_text: '',
                popup_link: '',
                popup_routing_link: '',
                popup_belowtext: '',
            });
            fetchPopup();

            // Clear the notification after 3 seconds
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error saving popup:', error);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${apiUrl}/${popup.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setNotification('Popup successfully deleted!');
            setPopup({
                id: null,
                popup_heading: '',
                popup_text: '',
                popup_link: '',
                popup_routing_link: '',
                popup_belowtext: '',
            });
            fetchPopup();

            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error deleting popup:', error);
        }
    };

    return (
        <div className="App">
            <h1>Admin Popup Management</h1>

            {/* Notification message */}
            {notification && <div className="notification">{notification}</div>}

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
                    name="popup_link"
                    placeholder="Popup Image Link"
                    value={popup.popup_link}
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
                    <p><strong>Image Link:</strong> {popup.popup_link}</p>
                    <p><strong>Routing Link:</strong> {popup.popup_routing_link}</p>
                    <p><strong>Below Text:</strong> {popup.popup_belowtext}</p>
                </div>
            )}

            {/* Button for navigating back to Admin Panel */}
            <button onClick={() => navigate("/admin")} className="navigate-admin-button">
                Back to Admin Panel
            </button>
        </div>
    );
};

export default PopUp;

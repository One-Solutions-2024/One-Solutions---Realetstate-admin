import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './popup.css'; // Optional CSS for styling
import { useNavigate } from 'react-router-dom';


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
    const navigate = useNavigate();


    useEffect(() => {
        fetchPopups();
    }, []);

    const fetchPopups = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setPopups(response.data);
        } catch (error) {
            console.error('Error fetching popups:', error);
            setNotification('Error fetching popups');
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

            setNotification(popup.id ? 'Popup updated successfully!' : 'Popup created successfully!');
            fetchPopups();
            resetForm();
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error saving popup:', error);
            setNotification('Error saving popup');
        }
    };

    const handleEdit = (popup) => {
        setPopup(popup);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${apiUrl}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotification('Popup deleted successfully!');
            fetchPopups();
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error deleting popup:', error);
            setNotification('Error deleting popup');
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
    };

    return (
        <div className="admin-panel">
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
                <button type="submit">{popup.id ? 'Update' : 'Create'} Popup</button>
            </form>

            <h2>Existing Popups</h2>
            <ul>
                {popups.map((popup) => (
                    <li key={popup.id}>
                        <h3>{popup.popup_heading}</h3>
                        <p>{popup.popup_text}</p>
                        <p><strong>Image Link:</strong> {popup.popup_link}</p>
                        <p><strong>Routing Link:</strong> {popup.popup_routing_link}</p>
                        <p><strong>Below Text:</strong> {popup.popup_belowtext}</p>
                        <button onClick={() => handleEdit(popup)}>Edit</button>
                        <button onClick={() => handleDelete(popup.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {/* Button for navigating back to Admin Panel */}
            <button onClick={() => navigate("/admin")} className="navigate-admin-button">
                Back to Admin Panel
            </button>
        </div>
    );
};

export default PopUp;

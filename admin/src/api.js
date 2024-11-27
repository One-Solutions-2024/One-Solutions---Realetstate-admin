const API_BASE_URL = "http://localhost:4000/api/site";

export const request = async (url, options = {}, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                "Content-Type": options.body instanceof FormData ? undefined : "application/json",
            },
            signal: controller.signal,
            ...options,
        });

        clearTimeout(id);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred");
        }

        const responseData = await response.text();
        return responseData ? JSON.parse(responseData) : {};
    } catch (error) {
        if (error.name === "AbortError") throw new Error("Request timed out");
        throw error;
    }
};

export const getSites = () => request("/getsite");
export const addSite = (formData) => request("/add", { method: "POST", body: formData });
export const updateSite = (id, data) => request(`/update/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteSite = (id) => request(`/delete/${id}`, { method: "DELETE" });

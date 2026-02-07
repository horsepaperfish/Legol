import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

export const api = {
    getGraph: async () => {
        const response = await axios.get(`${API_BASE_URL}/graph`);
        return response.data;
    },

    sendQuery: async (query) => {
        const response = await axios.post(`${API_BASE_URL}/query`, { query });
        return response.data;
    },

    chat: async (query, history = [], files = []) => {
        const response = await axios.post(`${API_BASE_URL}/chat`, { query, history, files });
        return response.data;
    },

    getTimelineFromConversation: async (history = []) => {
        const response = await axios.post(`${API_BASE_URL}/timeline`, { history });
        return response.data;
    },

    uploadFiles: async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    clearGraph: async () => {
        const response = await axios.post(`${API_BASE_URL}/clear`);
        return response.data;
    }
};

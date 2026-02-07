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

    clearGraph: async () => {
        const response = await axios.post(`${API_BASE_URL}/clear`);
        return response.data;
    }
};

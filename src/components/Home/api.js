import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // assuming your backend is served from the same domain
});

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/category/create', categoryData);
        console.log('Category created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const uploadImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Image uploaded:', response.data.filename);
        return response.data.filename;
    } catch (error) {
        console.error('Error uploading image:', error.response ? error.response.data : error.message);
        throw error;
    }
};

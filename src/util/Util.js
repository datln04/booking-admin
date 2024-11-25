import axios from "axios";


export const uploadImage = async (formData, image) => {
    formData.append('file', image);
    formData.append('upload_preset', 'ml_default'); // Replace with your upload preset
    formData.append('cloud_name', 'dntuuyqor'); // Replace with your Cloudinary cloud name

    try {
        const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dntuuyqor/image/upload',
            formData
        );
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
        return;
    }

}
import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ImageUpload = ({ setImageUrl, setPreviewImageUrl }) => {
    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_UPLOAD_URL}/api/image/upload/`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log("Response from image upload:", response.data); // Debug log
    
            if (response.status === 200) {
                const imageUrl = response.data?.path; // Adjust based on backend response structure
                console.log("Image URL from response:", imageUrl); // Debug log
    
                if (setImageUrl) {
                    setImageUrl(imageUrl);
                }
                if (setPreviewImageUrl) {
                    setPreviewImageUrl(imageUrl);
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Image uploaded successfully',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: response.data.message || 'Failed to upload image',
                });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to upload image',
            });
        }
    };

    return (
        <div className="form-control border rounded-lg shadow-sm my-6">
            <input onChange={handleImageUpload} type="file" className="file-input outline-none focus:outline-none" />
        </div>
    );
};

export default ImageUpload;

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../Hook/UseAxioSecure';
import ImageUpload from '../utilities/ImageUploadcpanel'; // Reusing the image uploader

const EditProductModal = ({ isOpen, onClose, product, onUpdateSuccess, availableCategories }) => {
    const axiosSecure = UseAxiosSecure();

    // --- Component State ---
    const [formData, setFormData] = useState({});
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // Add a key to fully reset the ImageUpload component when a new product is loaded
    const [imageUploadKey, setImageUploadKey] = useState(Date.now());

    // --- Effects ---
    // Populate form when the product data is passed in
    useEffect(() => {
        if (product) {
            setFormData({
                productCode: product.productCode || '',
                productName: product.productName || '',
                productCategory: product.productCategory || '',
                productDescription: product.productDescription || '',
                additionalInformation: product.additionalInformation || '',
                productPhoto: product.productPhoto || '',
                productPrice: product.productPrice || '',
            });
            // Reset image and errors for the new product being edited
            setNewImageUrl('');
            setErrors({});
            setImageUploadKey(Date.now()); // Change key to reset the child component
        }
    }, [product]);

    // Syncs the newly uploaded image URL to the form state
    useEffect(() => {
        if (newImageUrl) {
            setFormData(prevState => ({
                ...prevState,
                productPhoto: newImageUrl,
            }));
            // Clear photo error if a new one is uploaded
            if (errors.productPhoto) {
                setErrors(prevErrors => ({ ...prevErrors, productPhoto: null }));
            }
        }
    }, [newImageUrl, errors.productPhoto]);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    // --- Form Validation ---
    const validateForm = () => {
        const newErrors = {};
        if (!formData.productName.trim()) newErrors.productName = 'Product Name is required.';
        if (!formData.productCategory) newErrors.productCategory = 'Please select a category.';
        if (!formData.productPhoto) newErrors.productPhoto = 'Product image is required.';
        if (!formData.productPrice || parseFloat(formData.productPrice) <= 0) {
            newErrors.productPrice = 'Please enter a valid price.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire('Validation Error', 'Please fill all required fields correctly.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // The API endpoint matches your backend route: PUT /products/update/:id
            await axiosSecure.put(`/products/update/${product._id}`, formData);
            onUpdateSuccess(); // This function (passed as a prop) will close the modal and refresh the data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
            Swal.fire('Update Error!', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b pb-3 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4">
                            {/* Product Code (Read-only) */}
                            <div>
                                <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                                <input type="text" id="productCode" name="productCode" value={formData.productCode} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 cursor-not-allowed" />
                                <p className="text-xs text-gray-500 mt-1">Product code cannot be changed.</p>
                            </div>

                            {/* Product Name */}
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                                <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.productName ? 'border-red-500' : ''}`} />
                                {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                            </div>

                            {/* Product Category */}
                            <div>
                                <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Select Category <span className="text-red-500">*</span></label>
                                <select id="productCategory" name="productCategory" value={formData.productCategory} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.productCategory ? 'border-red-500' : ''}`}>
                                    <option value="">Select a category</option>
                                    {availableCategories.map((cat) => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}
                                </select>
                                {errors.productCategory && <p className="text-red-500 text-xs mt-1">{errors.productCategory}</p>}
                            </div>

                             {/* Product Price */}
                             <div>
                                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                                <input type="number" id="productPrice" name="productPrice" value={formData.productPrice} onChange={handleChange} min="0.01" step="0.01" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.productPrice ? 'border-red-500' : ''}`} />
                                {errors.productPrice && <p className="text-red-500 text-xs mt-1">{errors.productPrice}</p>}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col">
                             {/* Image Preview */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="relative h-48 rounded-lg border border-gray-200 mb-2 flex items-center justify-center bg-gray-50">
                                <img src={newImageUrl || formData.productPhoto} alt="Product" className="max-h-full max-w-full rounded-lg object-contain" />
                            </div>

                            {/* Image Upload Component */}
                            <ImageUpload setImageUrl={setNewImageUrl} key={imageUploadKey} />
                            {errors.productPhoto && <p className="text-red-500 text-xs mt-1">{errors.productPhoto}</p>}
                        </div>

                        {/* Full-width fields */}
                        <div className="md:col-span-2">
                             <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                             <textarea id="productDescription" name="productDescription" value={formData.productDescription} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="additionalInformation" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                            <textarea id="additionalInformation" name="additionalInformation" value={formData.additionalInformation} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                        </div>
                    </div>

                    {/* Modal Footer/Actions */}
                    <div className="flex justify-end items-center border-t pt-4 mt-6 space-x-3">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-[160px] flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import useCategories from '../../Hook/Categroie'; // Corrected import path
import ImageUpload from '../../utilities/ImageUploadcpanel';
import { AuthContext } from '../../providers/AuthProvider';

const AddProduct = () => {
    // --- Custom Hooks ---
    const axiosSecure = UseAxiosSecure();
    const { 
        categories: availableCategories, 
        loading: categoriesLoading, 
        fetchCategories 
    } = useCategories();
    
    // --- Component State ---
    const [imageurl, setImageUrl] = useState('');
      const { user} = useContext(AuthContext);
      console.log(user);
    const [productData, setProductData] = useState({
        productCode: '',
        productName: '',
        productCategory: '',
        productDescription: '',
        additionalInformation: '',
        productPhoto: '',
        productPrice: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // Add a key to force reset the ImageUpload component
    const [imageUploadKey, setImageUploadKey] = useState(Date.now());

    // --- Data and Effects ---

    // Fetch categories when the component mounts.
    useEffect(() => {
        fetchCategories({ limit: 999 }); 
    }, [fetchCategories]);

    // Syncs the uploaded image URL from the uploader to the form state.
    useEffect(() => {
        if (imageurl) {
            setProductData(prevState => ({
                ...prevState,
                productPhoto: imageurl,
            }));
            if (errors.productPhoto) {
                setErrors(prevErrors => ({ ...prevErrors, productPhoto: null }));
            }
        }
    }, [imageurl, errors.productPhoto]);

    // Set a default category once categories are loaded.
    useEffect(() => {
        if (availableCategories.length > 0 && !productData.productCategory) {
            setProductData(prevState => ({
                ...prevState,
                productCategory: availableCategories[0].name,
            }));
        }
    }, [availableCategories, productData.productCategory]);

    // --- Event Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevState => ({ ...prevState, [name]: value }));
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    // --- Form Validation ---
    const validateForm = () => {
        const newErrors = {};
        if (!productData.productCode.trim()) newErrors.productCode = 'Product Code is required.';
        if (!productData.productName.trim()) newErrors.productName = 'Product Name is required.';
        if (!productData.productCategory) newErrors.productCategory = 'Please select a category.';
        if (!productData.productPhoto) newErrors.productPhoto = 'Please upload a product image.';
        if (!productData.productPrice || parseFloat(productData.productPrice) <= 0) {
            newErrors.productPrice = 'Please enter a valid price.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire('Validation Error!', 'Please fill all required fields correctly.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await axiosSecure.post('/products/post', productData);
            Swal.fire('Success!', 'Product created successfully!', 'success');

            // Reset form
            setProductData({
                productCode: '',
                productName: '',
                productCategory: availableCategories.length > 0 ? availableCategories[0].name : '',
                productDescription: '',
                additionalInformation: '',
                productPhoto: '',
                productPrice: '',
            });
            setErrors({});
            setImageUrl(''); // Reset image URL state
            setImageUploadKey(Date.now()); // Reset file input component

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
            Swal.fire('Submission Error!', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---
    return (
        <div className="bg-gray-100 font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <nav className="text-sm mb-4 text-gray-500">
                    <a href="#" className="hover:text-gray-700">Home</a> /
                    <span className="font-medium text-gray-800"> Add Product</span>
                </nav>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form Fields */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">ADD PRODUCT FORM</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Code */}
                                <div>
                                    <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">Product Code <span className="text-red-500">*</span></label>
                                    <input type="text" id="productCode" name="productCode" value={productData.productCode} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productCode ? 'border-red-500' : ''}`} />
                                    {errors.productCode && <p className="text-red-500 text-xs mt-1">{errors.productCode}</p>}
                                </div>
                                {/* Product Name */}
                                <div>
                                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                                    <input type="text" id="productName" name="productName" value={productData.productName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productName ? 'border-red-500' : ''}`} />
                                    {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                                </div>
                                {/* Product Category */}
                                <div>
                                    <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Select Category <span className="text-red-500">*</span></label>
                                    <select id="productCategory" name="productCategory" value={productData.productCategory} onChange={handleChange} disabled={categoriesLoading} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productCategory ? 'border-red-500' : ''}`}>
                                        <option value="" disabled>{categoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
                                        {availableCategories.map((cat) => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}
                                    </select>
                                    {errors.productCategory && <p className="text-red-500 text-xs mt-1">{errors.productCategory}</p>}
                                </div>
                                {/* Product Price */}
                                <div>
                                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                                    <input type="number" id="productPrice" name="productPrice" value={productData.productPrice} onChange={handleChange} min="0.01" step="0.01" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productPrice ? 'border-red-500' : ''}`} />
                                    {errors.productPrice && <p className="text-red-500 text-xs mt-1">{errors.productPrice}</p>}
                                </div>
                                {/* Product Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea id="productDescription" name="productDescription" value={productData.productDescription} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                                {/* Additional Information */}
                                <div className="md:col-span-2">
                                    <label htmlFor="additionalInformation" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                                    <textarea id="additionalInformation" name="additionalInformation" value={productData.additionalInformation} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                                {/* Image Upload Component */}
                                <div className="md:col-span-2">
                                    <ImageUpload setImageUrl={setImageUrl} key={imageUploadKey} />
                                    {errors.productPhoto && <p className="text-red-500 text-xs mt-1">{errors.productPhoto}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Preview and Submit Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">PRODUCT PREVIEW</h2>
                            <div className="relative h-48 rounded-lg border border-gray-200 mb-6 flex items-center justify-center bg-gray-50">
                                {imageurl ? (
                                    <img src={imageurl} alt="Product Preview" className="max-h-full max-w-full rounded-lg object-contain" />
                                ) : (
                                    <span className="text-gray-400">Image Preview</span>
                                )}
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading || categoriesLoading} 
                                className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save and Add Product'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
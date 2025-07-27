import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../Hook/UseAxioSecure';
 // Adjust the import path as needed

// In a real app, this would come from your auth context/state management.
const getAuthToken = () => {
    return 'your_jwt_token_here';
};

const AddProduct = () => {
    // --- Custom Hooks ---
    const axiosSecure = UseAxiosSecure();
    const { 
        categories: availableCategories, 
        loading: categoriesLoading, 
        error: categoriesError, 
        fetchCategories 
    } = useCategories();

    // --- Component State ---
    const [productData, setProductData] = useState({
        productCode: '',
        productName: '',
        productCategory: '', // Initialize as empty, will be populated from the hook
        productDescription: '',
        additionalInformation: '',
        productPhoto: '',
        productPrice: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('https://placehold.co/400x200/e2e8f0/cbd5e0?text=Image+Preview');

    // --- Data Fetching ---
    // Fetch all categories on component mount for the dropdown.
    useEffect(() => {
        // Assuming limit=0 or a high number fetches all categories.
        // Adjust if your API behaves differently.
        fetchCategories({ limit: 999 }); 
    }, [fetchCategories]);

    // Set a default category in the form once the categories have loaded.
    useEffect(() => {
        if (availableCategories.length > 0 && !productData.productCategory) {
            setProductData(prevState => ({
                ...prevState,
                productCategory: availableCategories[0].name, // Default to the first category
            }));
        }
    }, [availableCategories, productData.productCategory]);

    // --- Event Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevState => ({ ...prevState, [name]: value }));
        // Clear validation error on change
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            // In a real application, you would upload the file to a server or cloud storage
            // and get back a URL. This is a simulation.
            setProductData(prevState => ({
                ...prevState,
                productPhoto: `https://cdn.example.com/images/${file.name}`
            }));
        }
    };

    // --- Form Validation ---
    const validateForm = () => {
        const newErrors = {};
        if (!productData.productCode.trim()) newErrors.productCode = 'Product Code is required.';
        if (!productData.productName.trim()) newErrors.productName = 'Product Name is required.';
        if (!productData.productCategory) newErrors.productCategory = 'Please select a category.';
        if (!productData.productPrice || parseFloat(productData.productPrice) <= 0) {
            newErrors.productPrice = 'Please enter a valid price.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const authToken = getAuthToken();
            const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
            
            // Post the product data to the server
            await axiosSecure.post('products/post', productData, config);

            Swal.fire('Success!', 'Product created successfully!', 'success');

            // Reset the form to its initial state
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
            setImagePreview('https://placehold.co/400x200/e2e8f0/cbd5e0?text=Image+Preview');

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
            Swal.fire('Error!', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Breadcrumb Navigation */}
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
                                    <input type="text" id="productCode" name="productCode" value={productData.productCode} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.productCode ? 'border-red-500' : ''}`} />
                                    {errors.productCode && <p className="text-red-500 text-xs mt-1">{errors.productCode}</p>}
                                </div>
                                {/* Product Name */}
                                <div>
                                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                                    <input type="text" id="productName" name="productName" value={productData.productName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.productName ? 'border-red-500' : ''}`} />
                                    {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                                </div>
                                {/* Dynamic Category Select */}
                                <div>
                                    <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Select Category <span className="text-red-500">*</span></label>
                                    <select 
                                        id="productCategory" 
                                        name="productCategory" 
                                        value={productData.productCategory} 
                                        onChange={handleChange} 
                                        disabled={categoriesLoading}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.productCategory ? 'border-red-500' : ''}`}
                                    >
                                        <option value="" disabled>
                                            {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                                        </option>
                                        {categoriesError && <option disabled style={{color: 'red'}}>Error fetching categories</option>}
                                        {availableCategories.map((cat) => (
                                            <option key={cat._id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.productCategory && <p className="text-red-500 text-xs mt-1">{errors.productCategory}</p>}
                                </div>
                                {/* Product Price */}
                                <div>
                                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                                    <input type="number" id="productPrice" name="productPrice" value={productData.productPrice} onChange={handleChange} min="0.01" step="0.01" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.productPrice ? 'border-red-500' : ''}`} />
                                    {errors.productPrice && <p className="text-red-500 text-xs mt-1">{errors.productPrice}</p>}
                                </div>
                                {/* Other form fields remain the same... */}
                            </div>
                        </div>

                        {/* Preview and Submit Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">PRODUCT PREVIEW</h2>
                            <div className="relative h-48 rounded-lg border border-gray-200 mb-6 flex items-center justify-center">
                                <img src={imagePreview} alt="Product Preview" className="max-h-full max-w-full rounded-lg object-contain" />
                            </div>
                            <button type="submit" disabled={isLoading || categoriesLoading} className="w-full px-6 py-3 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isLoading ? 'Saving...' : 'Save and Add Product'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;

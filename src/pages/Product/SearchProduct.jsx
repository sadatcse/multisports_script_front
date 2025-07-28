import React, { useState, useCallback, useContext } from 'react';
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import { 
    HiOutlineHome, 
    HiOutlineSearch, 
    HiExclamationCircle, 
    HiLightBulb, 
    HiX,
    HiOutlineTag,
    HiOutlineDocumentText,
    HiOutlineInformationCircle
} from 'react-icons/hi';
import { AuthContext } from '../../providers/AuthProvider';

// --- Reusable Image Modal Component ---
const ImageModal = ({ isOpen, onClose, imageUrl, altText }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div className="relative max-w-3xl max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
                <img src={imageUrl} alt={altText} className="w-full h-full object-contain rounded-lg" />
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                    aria-label="Close image view"
                >
                    <HiX className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};


// --- Redesigned Product Card Component ---
const ProductCard = ({ product, onImageClick }) => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-200">
        <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/3">
                <img 
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110" 
                    src={product.productPhoto || 'https://placehold.co/500x500/E2E8F0/4A5568?text=Product'} 
                    alt={`Photo of ${product.productName}`}
                    onClick={() => onImageClick(product.productPhoto)}
                />
            </div>

            {/* Details Section */}
            <div className="p-6 md:p-8 md:w-2/3">
                {product.productCategory && (
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                        {product.productCategory}
                    </span>
                )}
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider font-mono">{product.productCode}</p>
                <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-4">{product.productName}</h1>

                <div className="flex items-center text-4xl font-light text-gray-800 mb-6">
                    <HiOutlineTag className="w-8 h-8 mr-3 text-blue-500" />
                    <span>৳{typeof product.productPrice === 'number' ? product.productPrice.toFixed(2) : 'N/A'}</span>
                </div>

                {product.productDescription && (
                    <div className="mb-5">
                        <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                           <HiOutlineDocumentText className="w-5 h-5 mr-2 text-gray-400" />
                           Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{product.productDescription}</p>
                    </div>
                )}

                {product.additionalInformation && (
                    <div>
                        <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                            <HiOutlineInformationCircle className="w-5 h-5 mr-2 text-gray-400" />
                            Additional Information
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{product.additionalInformation}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);


// --- Main Search Component ---
const SearchProduct = () => {
    // --- State ---
    const [searchCode, setSearchCode] = useState('');
    const [product, setProduct] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('Enter a product code to begin your search.');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const { user} = useContext(AuthContext);
    // --- Hooks ---
    const axiosSecure = UseAxiosSecure();

    // --- Data Fetching ---
    const performSearch = useCallback(async (code) => {
        if (!code) {
            setMessage('Please enter a product code.');
            return;
        }
        setLoading(true);
        setError(null);
        setProduct(null);
        setSuggestions([]);
        setMessage(null);

        try {
            const response = await axiosSecure.get('/products/search-by-code', { params: { code } });
            setProduct(response.data.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setMessage(err.response.data.message);
                setSuggestions(err.response.data.suggestions || []);
            } else {
                setError('An unexpected error occurred. Please try again later.');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);


    // --- Event Handlers ---
    const handleFormSubmit = (e) => {
        e.preventDefault();
        performSearch(searchCode);
    };
    
    const handleSuggestionClick = (code) => {
        setSearchCode(code); 
        performSearch(code); 
    };

    const handleImageClick = (imageUrl) => {
        if (imageUrl) {
            setModalImageUrl(imageUrl);
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <ImageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                imageUrl={modalImageUrl}
                altText={product ? `Enlarged view of ${product.productName}` : 'Enlarged product image'}
            />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
                {/* Breadcrumbs */}
                <div className="py-6">
                    <div className="flex items-center text-sm text-gray-500">
                        <HiOutlineHome className="h-5 w-5 mr-2" />
                        <span>Home / Search Product</span>
                    </div>
                </div>

                {/* Search Form Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Search Product by Code</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div className="flex items-center border-2 border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300">
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                placeholder="Enter product code "
                                className="w-full p-3 border-none focus:ring-0 bg-transparent"
                                disabled={loading} // Also disable input while loading
                            />
                            <button 
                                type="submit" 
                                className="flex items-center justify-center p-3 text-white bg-blue-500 hover:bg-blue-600 rounded-r-md disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                                disabled={loading || !searchCode}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineSearch className="w-5 h-5" />
                                        <span className="sr-only">Search</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Results Section */}
                <div className="mt-8 animate-fade-in">
                    {error && (
                        <div className="flex items-center justify-center p-4 bg-red-100 text-red-700 rounded-lg max-w-2xl mx-auto">
                            <HiExclamationCircle className="h-6 w-6 mr-3" />
                            <span>{error}</span>
                        </div>
                    )}
                    {message && !product && !suggestions.length && (
                         <div className="flex items-center justify-center p-4 bg-blue-100 text-blue-700 rounded-lg max-w-2xl mx-auto">
                            <HiLightBulb className="h-6 w-6 mr-3" />
                            <span>{message}</span>
                        </div>
                    )}
                    {product && <ProductCard product={product} onImageClick={handleImageClick} />}
                    {suggestions.length > 0 && (
                        <div className="mt-6 max-w-2xl mx-auto">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">{message} Try one of these suggestions:</h3>
                            <div className="space-y-2">
                                {suggestions.map((s, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(s.productCode)}
                                        className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-md border border-gray-200 transition-all duration-200 shadow-sm"
                                    >
                                        <span className="font-mono text-blue-600 font-semibold">{s.productCode}</span>
                                        <span className="ml-4 text-gray-600">{s.productName}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchProduct;
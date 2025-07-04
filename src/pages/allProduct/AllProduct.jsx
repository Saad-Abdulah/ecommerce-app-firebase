import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";

const AllProduct = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addToCartHandler = (product) => {
        dispatch(addToCart(product));
        toast.success("Added to cart");
    }

    const deleteFromCartHandler = (product) => {
        dispatch(deleteFromCart(product));
        toast.success("Deleted from cart");
    }

    const categories = [
        { id: "all", name: "All Products" },
        { id: "fashion", name: "Fashion" },
        { id: "shirt", name: "Shirt" },
        { id: "jacket", name: "Jacket" },
        { id: "mobile", name: "Mobile" },
        { id: "laptop", name: "Laptop" },
        { id: "shoes", name: "Shoes" },
        { id: "home", name: "Home" },
        { id: "books", name: "Books" }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(fireDB, "products"));
                const productsArray = [];
                querySnapshot.forEach((doc) => {
                    productsArray.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setProducts(productsArray);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleProductClick = (product) => {
        navigate(`/productinfo/${product.id}`, { state: { product } });
    };

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <Layout>
            <div className="container mx-auto px-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-4 justify-center my-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                selectedCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader />
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div 
                                className="cursor-pointer"
                                onClick={() => handleProductClick(product)}
                            >
                                <div className="relative h-0 pb-[100%]">
                                    <img
                                        src={product.productImageUrl}
                                        alt={product.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {product.title.substring(0, 30)}
                                    </h3>
                                    <p className="text-gray-500 mb-2">{product.category}</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        ₹{product.price}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                {cartItems?.some((p) => p.id === product.id) ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFromCartHandler(product);
                                        }}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Remove from Cart
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCartHandler(product);
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Products Found */}
                {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500">
                            Try changing your filter or check back later for new products.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default AllProduct;
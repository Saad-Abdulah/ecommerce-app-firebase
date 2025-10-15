import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";

const HomePageProductCard = ({ selectedCategory = 'all' }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addCart = (product) => {
        dispatch(addToCart(product));
        toast.success("Added to cart");
    }

    const deleteCart = (product) => {
        dispatch(deleteFromCart(product));
        toast.success("Deleted from cart");
    }

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            console.log(selectedCategory);
            try {
                let q;
                if (selectedCategory === 'all') {
                    q = query(
                        collection(fireDB, "products"),
                        orderBy("time", "desc")
                    );
                } else {
                    q = query(
                        collection(fireDB, "products"),
                        where("category", "==", selectedCategory),
                        orderBy("time", "desc")
                    );
                }

                const querySnapshot = await getDocs(q);
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
    }, [selectedCategory]);

    const handleProductClick = (product) => {
        navigate(`/productinfo/${product.id}`, { state: { product } });
    };

   
    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader /></div>;
    }

    return (
        <div className="mt-10">
            {/* Heading  */}
            <div className="">
                <h1 className="text-center mb-5 text-2xl font-semibold">
                    {selectedCategory === 'all' ? 'All Products' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
                </h1>
            </div>

            {/* main  */}
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto">
                    <div className="flex flex-wrap -m-4">
                        {products.length === 0 ? (
                            <div className="w-full text-center py-10">
                                <h2 className="text-xl text-gray-600">No products found in {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} category</h2>
                            </div>
                        ) : (
                            products.map((item) => {
                                const { productImageUrl, title, price } = item;
                                return (
                                    <div key={item.id} className="p-4 w-full md:w-1/2 lg:w-1/4">
                                        <div
                                            className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer"
                                            onClick={() => handleProductClick(item)}
                                        >
                                            <div className="relative h-0 pb-[100%]">
                                                <img
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    src={productImageUrl}
                                                    alt={title}
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                                    E-Pak
                                                </h2>
                                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                    {title.substring(0, 25)}
                                                </h1>
                                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                     {price} /-
                                                </h1>

                                                <div className="flex justify-center">
                                                    {cartItems?.some((p) => p.id === item.id) ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteCart(item);
                                                            }}
                                                            className="bg-red-600 hover:bg-red-700 w-32 text-white py-1 rounded-md text-sm font-medium transition-colors"
                                                        >
                                                            Remove from Cart
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addCart(item);
                                                            }}
                                                            className="bg-blue-600 hover:bg-blue-700 w-22 text-white py-1 rounded-md text-sm font-medium transition-colors"
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePageProductCard;
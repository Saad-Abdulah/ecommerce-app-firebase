import { useLocation, useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { Minus, Plus } from 'lucide-react';

const ProductInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > 10) {
            toast.error("Maximum quantity limit is 10");
            return;
        }
        setQuantity(newQuantity);
    };

    const addCart = (item) => {
        dispatch(addToCart({ ...item, quantity }));
        toast.success("Added to cart");
    }

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Deleted from cart");
    }

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const productDoc = await getDoc(doc(fireDB, "products", id));
                if (productDoc.exists()) {
                    setProduct({ id: productDoc.id, ...productDoc.data() });
                } else {
                    // If product doesn't exist in database
                    if (cartItems.some(item => item.id === id)) {
                        // Remove from cart if it's there
                        const cartItem = cartItems.find(item => item.id === id);
                        dispatch(deleteFromCart(cartItem));
                        toast.error("This product is no longer available and has been removed from your cart");
                    } else {
                        toast.error("This product is no longer available");
                    }
                    // Navigate back to previous page or home
                    navigate(-1);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Error loading product details");
            }
            setLoading(false);
        };

        // Always fetch fresh data from database to ensure product still exists
        fetchProduct();
    }, [id, dispatch, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen"><Loader /></div>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="h-screen flex items-center justify-center">
                    <h1 className="text-2xl font-semibold">Product not found</h1>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="py-5 lg:py-16 font-poppins">
                <div className="max-w-6xl px-4 mx-auto">
                    <div className="flex flex-wrap mb-24 -mx-4">
                        <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                            <div className="relative h-0 pb-[100%]">
                                <img
                                    className="absolute inset-0 w-full h-full object-contain rounded-lg"
                                    src={product.productImageUrl || product.image}
                                    alt={product.title}
                                />
                            </div>
                        </div>
                        <div className="w-full px-4 md:w-1/2">
                            <div className="lg:pl-20">
                                <div className="mb-6 ">
                                    <h2 className="max-w-xl mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                                        {product.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center mb-6">
                                        <ul className="flex mb-4 mr-2 lg:mb-0">
                                            <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={16}
                                                        height={16}
                                                        fill="currentColor"
                                                        className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                                                    </svg>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400 ">
                                        <span> { product.price}</span>
                                    </p>
                                </div>
                                <div className="mb-6">
                                    <h2 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">
                                        Description :
                                    </h2>
                                    <p>{product.description || product.desc}</p>
                                </div>

                                <div className="mb-6 " />
                                <div className="flex justify-center">
                                    {cartItems?.some((p) => p.id === product.id)
                                        ?
                                        <button
                                            onClick={() => deleteCart(product)}
                                            className="bg-red-600 hover:bg-red-700 w-32 text-white py-1 rounded-md text-sm font-medium transition-colors">
                                            Remove from Cart
                                        </button>
                                        :
                                        <button
                                            onClick={() => addCart(product)}
                                            className="bg-blue-600 hover:bg-blue-700 w-22 text-white py-1 rounded-md text-sm font-medium transition-colors">
                                            Add to Cart
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default ProductInfo;
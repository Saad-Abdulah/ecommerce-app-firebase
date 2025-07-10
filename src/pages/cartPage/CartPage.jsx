import Layout from "../../components/layout/Layout";
import { Trash, Minus, Plus } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { deleteFromCart, updateQuantity } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import { Navigate, useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";


const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, item: null });
    const [isProcessing, setIsProcessing] = useState(false);

    // Check if cart items still exist in database
    useEffect(() => {
        const validateCartItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(fireDB, "products"));
                const existingProductIds = new Set();
                querySnapshot.forEach((doc) => {
                    existingProductIds.add(doc.id);
                });

                // Remove items that don't exist in database
                cartItems.forEach(item => {
                    if (!existingProductIds.has(item.id)) {
                        dispatch(deleteFromCart(item));
                        toast.error(`${item.title} is no longer available and has been removed from your cart`);
                    }
                });
            } catch (error) {
                console.error("Error validating cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        validateCartItems();
    }, [dispatch]);

    // user
    const user = JSON.parse(localStorage.getItem('users'))

    // Buy Now Function
    const [addressInfo, setAddressInfo] = useState({
        name: "",
        address: "",
        pincode: "",
        mobileNumber: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });

    const buyNowFunction = async () => {
        try {
            setIsProcessing(true);
            // validation 
            if (addressInfo.name === "" || addressInfo.address === "" || addressInfo.pincode === "" || addressInfo.mobileNumber === "") {
                toast.error("All Fields are required");
                return;
            }

            if (!user) {
                toast.error("Please login to continue");
                navigate('/login');
                return;
            }

            // Get only selected items
            const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

            if (selectedCartItems.length === 0) {
                toast.error("Please select items to checkout");
                return;
            }

            // Order Info 
            const orderInfo = {
                cartItems: selectedCartItems,
                addressInfo,
                email: user.email,
                userid: user.uid,
                status: "confirmed",
                time: Timestamp.now(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                ),
                totalAmount: calculateTotal()
            };

            const orderRef = collection(fireDB, 'order');
            const docRef = await addDoc(orderRef, orderInfo);

            if (!docRef.id) {
                throw new Error("Failed to create order");
            }

            // Remove purchased items from cart
            selectedCartItems.forEach(item => {
                dispatch(deleteFromCart(item));
            });

            setAddressInfo({
                name: "",
                address: "",
                pincode: "",
                mobileNumber: "",
                time: Timestamp.now(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            });

            setSelectedItems([]);
            toast.success("Order Placed Successfully");
            
            // Navigate to orders page or show success message
            navigate('/user-dashboard');
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error(error.message || "Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Don't allow quantity less than 1
        if (newQuantity > 10) {
            toast.error("Maximum quantity limit is 10");
            return;
        }
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    };

    const calculateItemTotal = (item) => {
        return Number(item.price) * (item.quantity || 1);
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + calculateItemTotal(item), 0);
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        setSelectedItems(prev => prev.filter(id => id !== item.id));
        setDeleteConfirm({ show: false, item: null });
        toast.success("Deleted from cart");
    };

    if (loading) {
        return (
            <Layout>
                <div className="h-[80vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    if (!cartItems.length) {
        return (
            <Layout>
                <div className="h-[80vh] flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                    <p className="text-gray-600">Add items to your cart to proceed with checkout</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                        Shopping Cart
                    </h1>
                    <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === cartItems.length}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-gray-700">Select All ({cartItems.length} items)</span>
                            </div>
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="">
                                        <li className="flex py-6 sm:py-6">
                                            <div className="flex-shrink-0 mr-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => handleSelectItem(item.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="flex flex-col items-center">
                                                    <img
                                                        src={item.productImageUrl}
                                                        alt={item.title}
                                                        className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center mb-2"
                                                    />
                                                    <div className="flex items-center border rounded-md">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                                            className="p-2 hover:bg-gray-100"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="px-4 py-1 text-gray-900">
                                                            {item.quantity || 1}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                                            className="p-2 hover:bg-gray-100"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-base font-medium text-gray-900">
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                                    <div className="mt-1 flex items-center justify-between">
                                                        <p className="text-lg font-medium text-gray-900"> {item.price}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Total:  {calculateItemTotal(item).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="mb-2 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setDeleteConfirm({ show: true, item })}
                                                className="flex items-center text-sm text-red-500 hover:text-red-600"
                                            >
                                                <Trash size={16} className="mr-1" />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </section>
                        {/* Order summary */}
                        <section
                            aria-labelledby="summary-heading"
                            className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
                        >
                            <h2
                                id="summary-heading"
                                className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
                            >
                                Price Details
                            </h2>
                            <div>
                                <dl className="space-y-1 px-2 py-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">
                                            Selected Items ({selectedItems.length})
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">  {calculateTotal().toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="flex text-sm text-gray-800">
                                            <span>Delivery Charges</span>
                                        </dt>
                                        <dd className="text-sm font-medium text-green-700">Free</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-y border-dashed py-4 ">
                                        <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                        <dd className="text-base font-medium text-gray-900">  {calculateTotal().toFixed(2)}</dd>
                                    </div>
                                </dl>
                                <div className="px-2 pb-4 font-medium text-green-700">
                                    <div className="flex gap-4 mb-6">
                                        {user ? (
                                            selectedItems.length === 0 ? (
                                                <button
                                                    disabled
                                                    className="w-full px-4 py-3 text-center text-gray-500 bg-gray-200 rounded-xl cursor-not-allowed"
                                                >
                                                    Select items to checkout
                                                </button>
                                            ) : (
                                                <BuyNowModal
                                                    addressInfo={addressInfo}
                                                    setAddressInfo={setAddressInfo}
                                                    buyNowFunction={buyNowFunction}
                                                    isProcessing={isProcessing}
                                                />
                                            )
                                        ) : (
                                            <Navigate to={'/login'} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Item</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to remove this item from your cart?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, item: null })}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteCart(deleteConfirm.item)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default CartPage;
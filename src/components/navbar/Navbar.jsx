import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
    // get user from localStorage 
    const user = JSON.parse(localStorage.getItem('users'));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // navigate 
    const navigate = useNavigate();

    // logout function 
    const logout = () => {
        localStorage.clear('users');
        navigate("/login")
    }

    const cartItems = useSelector((state) => state.cart);
    // navList Data
    const navList = (
        <ul className={`lg:flex lg:space-x-6 text-white font-medium text-md ${isMenuOpen ? 'block' : 'hidden lg:flex'}`}>
            {/* Home */}
            <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                <Link to={'/'}>Home</Link>
            </li>

            {/* All Product */}
            <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                <Link to={'/allproduct'}>All Products</Link>
            </li>

            {/* Signup */}
            {!user ? (
                <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                    <Link to={'/signup'}>Sign Up</Link>
                </li>
            ) : null}

            {/* Login */}
            {!user ? (
                <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                    <Link to={'/login'}>Login</Link>
                </li>
            ) : null}

            {/* User */}
            {user?.role === "user" && (
                <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                    <Link to={'/user-dashboard'}>Dashboard</Link>
                </li>
            )}

            {/* Admin */}
            {user?.role === "admin" && (
                <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                    <Link to={'/admin-dashboard'}>Admin Panel</Link>
                </li>

            )}

            {/* Admin */}
            {user?.role === "admin" && (
                <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                    <Link to={'/addproduct'}>Add Product</Link>
                </li>

            )}


            {/* logout */}
            {user && (
                <li 
                    className="hover:text-blue-200 transition-colors duration-300 cursor-pointer py-2 lg:py-0" 
                    onClick={logout}
                >
                    Logout
                </li>
            )}

            {/* Cart */}
            <li className="hover:text-blue-200 transition-colors duration-300 py-2 lg:py-0">
                <Link to={'/cart'} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Cart ({cartItems.length})</span>
                </Link>
            </li>
        </ul>
    )

    return (
        <nav className="bg-blue-600 sticky top-0 z-50 shadow-lg">
            {/* main  */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* left  */}
                    <div className="flex-shrink-0">
                        <Link to={'/'}>
                            <h2 className="font-bold text-white text-2xl">E-Bharat</h2>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden lg:flex lg:items-center lg:justify-between flex-1 ml-10">
                        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                            <SearchBar />
                        </div>
                        <div className="ml-10">
                            {navList}
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navList}
                    </div>
                    <div className="px-2 pt-4">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
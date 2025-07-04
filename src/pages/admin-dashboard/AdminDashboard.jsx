import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';
import Layout from '../../components/layout/Layout';
import { useContext } from 'react';
import myContext from '../../context/myContext';


const AdminDashboard = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllOrder, getAllUser, getAllProduct} = context;
    console.log(getAllUser)
    useEffect(() => {
        // Check if user exists and is an admin
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') {
        return null;
    }

    const stats = [
        {
            id: 'products',
            title: 'Total Products',
            value: getAllProduct.length,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={50}
                    height={50}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m5 11 4-7" />
                    <path d="m19 11-4-7" />
                    <path d="M2 11h20" />
                    <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" />
                    <path d="m9 11 1 9" />
                    <path d="M4.5 15.5h15" />
                    <path d="m15 11-1 9" />
                </svg>
            )
        },
        {
            id: 'orders',
            title: 'Total Orders',
            value: getAllOrder.length,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={50}
                    height={50}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1={10} x2={21} y1={6} y2={6} />
                    <line x1={10} x2={21} y1={12} y2={12} />
                    <line x1={10} x2={21} y1={18} y2={18} />
                    <path d="M4 6h1v4" />
                    <path d="M4 10h2" />
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                </svg>
            )
        },
        {
            id: 'users',
            title: 'Total Users',
            value: getAllUser?.length || 0,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={50}
                    height={50}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx={9} cy={7} r={4} />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 text-center">
                            Admin Dashboard
                        </h1>
                    </div>

                    {/* Admin Profile */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col items-center">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png" 
                                alt="Admin profile" 
                                className="w-24 h-24 mb-4"
                            />
                            <div className="space-y-2 text-center">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {user.name}
                                </h2>
                                <p className="text-gray-600">{user.email}</p>
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                        Admin
                                    </span>
                                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                        Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.id}
                                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 ${
                                    activeTab === index ? 'ring-2 ring-blue-500' : 'hover:bg-blue-50'
                                }`}
                                onClick={() => setActiveTab(index)}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="text-blue-500 mb-3">
                                        {stat.icon}
                                    </div>
                                    <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                                        {stat.value}
                                    </h2>
                                    <p className="text-gray-600 font-medium">
                                        {stat.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                            <TabList className="flex border-b border-gray-200">
                                <Tab className="px-6 py-3 text-gray-600 hover:text-gray-900 cursor-pointer border-b-2 border-transparent hover:border-gray-300 transition-colors duration-200">
                                    Products
                                </Tab>
                                <Tab className="px-6 py-3 text-gray-600 hover:text-gray-900 cursor-pointer border-b-2 border-transparent hover:border-gray-300 transition-colors duration-200">
                                    Orders
                                </Tab>
                                <Tab className="px-6 py-3 text-gray-600 hover:text-gray-900 cursor-pointer border-b-2 border-transparent hover:border-gray-300 transition-colors duration-200">
                                    Users
                                </Tab>
                            </TabList>

                            <div className="p-6">
                                <TabPanel>
                                    <ProductDetail/>
                                </TabPanel>
                                <TabPanel>
                                    <OrderDetail/>
                                </TabPanel>
                                <TabPanel>
                                    <UserDetail/>
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;
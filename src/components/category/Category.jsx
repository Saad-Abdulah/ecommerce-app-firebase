// category data
const category = [
    {
        image: 'https://cdn-icons-png.flaticon.com/256/3601/3601387.png',
        name: 'all'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/4359/4359963.png',
        name: 'fashion'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/11833/11833323.png',
        name: 'shirt'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/8174/8174424.png',
        name: 'jacket'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/7648/7648246.png',
        name: 'mobile'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12142/12142416.png',
        name: 'laptop'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/10686/10686553.png',
        name: 'shoes'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12114/12114279.png',
        name: 'home'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/11946/11946316.png',
        name: 'books'
    }
]

const Category = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 lg:gap-6">
                    {category.map((item, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col items-center"
                            onClick={() => onSelectCategory(item.name)}
                        >
                            <div className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center p-4 cursor-pointer transition-colors ${selectedCategory === item.name ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'}`}>
                                <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="mt-2 text-sm md:text-base lg:text-lg text-white font-medium capitalize">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Category;
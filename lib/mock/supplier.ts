
export const mockSupplierStats = {
    totalRevenue: 125000,
    totalOrders: 45,
    activeProducts: 12,
    averageRating: 4.8,
    recentGrowth: 12.5
};

export const mockSupplierProducts = [
    {
        id: 'SP-001',
        name: 'Premium Almonds',
        category: 'Dry Fruits',
        price: 850,
        stock: 150,
        status: 'Active',
        image: '/images/products/almonds.jpg',
        sales: 45
    },
    {
        id: 'SP-002',
        name: 'Organic Cashews',
        category: 'Dry Fruits',
        price: 920,
        stock: 85,
        status: 'Active',
        image: '/images/products/cashew.jpg',
        sales: 32
    },
    {
        id: 'SP-003',
        name: 'Dried Figs (Anjeer)',
        category: 'Dry Fruits',
        price: 1200,
        stock: 0,
        status: 'Out of Stock',
        image: '/images/products/figs.jpg',
        sales: 28
    },
    {
        id: 'SP-004',
        name: 'Pistachios',
        category: 'Dry Fruits',
        price: 1400,
        stock: 200,
        status: 'Active',
        image: '/images/products/pistachio.jpg',
        sales: 15
    },
    {
        id: 'SP-005',
        name: 'Walnuts',
        category: 'Dry Fruits',
        price: 1100,
        stock: 45,
        status: 'Low Stock',
        image: '/images/products/walnut.jpg',
        sales: 60
    }
];

export const mockSupplierOrders = [
    {
        id: 'ORD-2024-001',
        customerName: 'Bakery Delights',
        date: '2024-03-15',
        amount: 4500,
        status: 'Pending',
        items: 'Almonds x 5kg'
    },
    {
        id: 'ORD-2024-002',
        customerName: 'Cafe Mocha',
        date: '2024-03-14',
        amount: 2800,
        status: 'Processing',
        items: 'Cashews x 3kg'
    },
    {
        id: 'ORD-2024-003',
        customerName: 'Healthy Bites',
        date: '2024-03-13',
        amount: 1200,
        status: 'Shipped',
        items: 'Figs x 1kg'
    },
    {
        id: 'ORD-2024-004',
        customerName: 'Grand Hotel',
        date: '2024-03-12',
        amount: 15000,
        status: 'Delivered',
        items: 'Assorted Dry Fruits x 15kg'
    },
    {
        id: 'ORD-2024-005',
        customerName: 'City Sweets',
        date: '2024-03-10',
        amount: 8500,
        status: 'Cancelled',
        items: 'Pistachios x 6kg'
    }
];

export const mockSupplierProfile = {
    name: "Nature's Best Supplies",
    email: "contact@naturesbest.com",
    phone: "+91 98765 43210",
    address: "123, Food Park, Industrial Area, Pune",
    gst: "27AAAAA0000A1Z5",
    pan: "AAAAA0000A",
    type: "Manufacturer",
    joinedDate: "Jan 2024"
};

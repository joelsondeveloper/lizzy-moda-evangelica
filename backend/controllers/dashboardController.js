const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let currentStartDate, currentEndDate;

    if (startDate && endDate) {
      currentStartDate = new Date(startDate);
      currentEndDate = new Date(endDate);
    } else {
      currentStartDate = new Date();
      currentEndDate = new Date();
      currentEndDate.setFullYear(currentEndDate.getFullYear() - 1);
    }

    const periodDurationMs = currentEndDate.getTime() - currentStartDate.getTime();

    const previousEndDate = new Date(currentStartDate.getTime());
    const previousStartDate = new Date(
        previousEndDate.getTime() - periodDurationMs
    );

    // DEBUG
    console.log('Dashboard metrics:');
    console.log('currentStartDate:', currentStartDate);
    console.log('currentEndDate:', currentEndDate);
    console.log('previousStartDate:', previousStartDate);
    console.log('previousEndDate:', previousEndDate);
    
    const calculatePeriodMetrics = async (start, end) => {
        const totalProducts = await Product.countDocuments({ createdAt: { $lte: end } });
        const totalCategories = await Category.countDocuments({ createdAt: { $lte: end } });
        const totalOrders = await Order.countDocuments({ createdAt: { $lte: end } });
        const totalUsers = await User.countDocuments({ createdAt: { $lte: end } });

        const ordersInPeriod = await Order.countDocuments({ createdAt: { $gte: start, $lte: end } });
        const pendingOrdersInPeriod = await Order.countDocuments({ status: 'Pendente', createdAt: { $gte: start, $lte: end } });

        const newUsersInPeriod = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });

        const newProductsInPeriod = await Product.countDocuments({ createdAt: { $gte: start, $lte: end } });

        return {
            totalProducts,
            totalCategories,
            totalUsers,
            ordersCount: ordersInPeriod,
            pendingOrdersCount: pendingOrdersInPeriod,
            newUsersCount: newUsersInPeriod,
            newProductsCount: newProductsInPeriod
        };
    };
    
    const currentPeriodMetrics = await calculatePeriodMetrics(currentStartDate, currentEndDate);

    const previousPeriodMetrics = await calculatePeriodMetrics(previousStartDate, previousEndDate);

    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return ((current - previous) / previous) * 100;
    };

    const metrics = {
        totalProducts: currentPeriodMetrics.totalProducts,
        totalCategories: currentPeriodMetrics.totalCategories,
        totalUsers: currentPeriodMetrics.totalUsers,
        
        ordersCount: {
            value: currentPeriodMetrics.ordersCount,
            change: calculatePercentageChange(currentPeriodMetrics.ordersCount, previousPeriodMetrics.ordersCount)
        },
        pendingOrdersCount: {
            value: currentPeriodMetrics.pendingOrdersCount,
            change: calculatePercentageChange(currentPeriodMetrics.pendingOrdersCount, previousPeriodMetrics.pendingOrdersCount)
        },
        newUsersCount: {
            value: currentPeriodMetrics.newUsersCount,
            change: calculatePercentageChange(currentPeriodMetrics.newUsersCount, previousPeriodMetrics.newUsersCount)
        },
        newProductsCount: {
            value: currentPeriodMetrics.newProductsCount,
            change: calculatePercentageChange(currentPeriodMetrics.newProductsCount, previousPeriodMetrics.newProductsCount)
        }
    };
    
    const recentOrdersData = await Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").select("items totalPrice status createdAt");

    const recentOrders = recentOrdersData.map((order) => ({
        _id: order._id,
        clientName: order.user ? order.user.name : "Desconhecido",
        clientEmail: order.user ? order.user.email : "Desconhecido",
        total: order.totalPrice,
        status: order.status,
        date: order.createdAt,
    }));

    const popularProductsAggregation = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: currentStartDate,
                    $lte: currentEndDate
                }
            }
        },
        {
            $unwind: "$items"
        },
        {
            $group: {
                _id: "$items.product",
                totalQuantitySold: { $sum: "$items.quantity" },
                totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }
        },
        {
            $sort: { totalQuantitySold: -1 }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: '$productDetails._id',
                product: "$productDetails.name",
                imageUrl: "$productDetails.imageUrl",
                totalQuantitySold: 1,
                totalRevenue: 1
            }
        }
    ]);

    const popularProducts = popularProductsAggregation.map((product) => ({
        _id: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        quantitySold: product.totalQuantitySold,
        totalRevenue: product.totalRevenue
    }));

    res.json({ metrics, recentOrders, popularProducts });

  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    res.status(500).json({ message: "Erro ao buscar dados do dashboard", error: error.message });
  }
};

module.exports = { getDashboardMetrics };

import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transtaction from "../models/Transaction.js";
import getCountryIsco3 from "country-iso-2-to-3"

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    const generatSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generatSort() : {};

    const transactions = await Transtaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })

      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transtaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIsco3(country); // Convert to ISO3 format

      if (!acc[countryISO3]) { // ✅ Fix: Check correct key
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++; // ✅ Correctly increment count
      return acc;
    }, {});

    const formattedLocation = Object.entries(mappedLocations).map(
      ([country, count]) => ({ id: country, value: count })
    );

    res.status(200).json(formattedLocation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
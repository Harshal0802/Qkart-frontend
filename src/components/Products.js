import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [items, setItems] = useState([]);
 
  const performAPICall = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setLoading(false);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredProducts(response.data);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          setFilteredProducts([]);
        }
        if (e.response.status === 500) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
          setFilteredProducts(products);
        }
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
        return null;
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timer = setTimeout(async () => {
      await performSearch(value);
    }, 500);
    setDebounceTimeout(timer);
  };

  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };

  const addToCart = async (token, productId, items, qty, products, options = { preventDuplicate: false }) => {
    if (!token) {
      enqueueSnackbar("Please Login to add item to cart", {
        variant: "warning",
      });
      return;
    }
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
    try {
      const response = await axios.post(`${config.endpoint}/cart`,
        {
          productId,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cartItems = generateCartItemsFrom(response.data, products);
      setItems(cartItems);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
      return null;
    }
  };

  useEffect(() => {
    performAPICall();
  }, []);


  useEffect(() => {
    fetchCart(token)
      .then((cartData) => generateCartItemsFrom(cartData, products))
      .then((cartItems) => setItems(cartItems));
  }, [products]);

  return (
    <div>
    <Header>
      <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          className: "search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      />
    </Header>

    <TextField
      className="search-mobile"
      size="small"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search color="primary" />
          </InputAdornment>
        ),
      }}
      placeholder="Search for items/categories"
      name="search"
      onChange={(e) => {
        debounceSearch(e, debounceTimeout);
      }}
    />
    <Grid container>
      <Grid item className="product-grid" md={token ? 9 : 12} >
        <Box className="hero">
          <p className="hero-heading">
            India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
            to your door step
          </p>
        </Box>
        {loading ? (
          <Box className="loading">
            <CircularProgress /> <h4>Loading Products...</h4>
          </Box>
        ) : (
          <Grid container spacing={2} marginY="1rem" paddingX="1rem">
            {filteredProducts.length ? (
              filteredProducts.map((prod) => (
                <Grid item key={prod._id} xs={6} md={3} sm={6}>
                  <ProductCard
                    product={prod}
                    handleAddToCart={async () => {
                      await addToCart(token, prod._id, items, 1, products, {
                        preventDuplicate: true,
                      });
                    }}
                  />
                </Grid>
              ))
            ) : (
              <Box className="loading">
                <SentimentDissatisfied color="action" />
                <h4 style={{ color: "#636363" }}>No products found</h4>
              </Box>
            )}
          </Grid>
        )}
      </Grid>
      {token ? (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart
              products={products}
              items={items}
              handleQuantity={addToCart}
            />
          </Grid>
        ) : null}
    </Grid>
    <Footer />
  </div>
  );
};

export default Products;

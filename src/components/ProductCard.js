import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  
  return (
    <CardActions className="card-actions">
    <Card className="card" >
      <CardMedia
        component="img"
        height="250"
        image={product.image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        {product.name}
        </Typography>
        <Typography variant="h6"  component="div" >
          ${product.cost} 
        </Typography>
        <Rating name="half-rating" defaultValue={product.rating} precision={0.5} readOnly/>
      </CardContent>
      <Button variant="contained" color="success" className="card-button" onClick={handleAddToCart}>ADD TO CART</Button>
      </Card>
      </CardActions>
  );
};

export default ProductCard;

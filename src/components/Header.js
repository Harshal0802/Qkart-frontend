import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
 
  if(hasHiddenAuthButtons === true){
    <Box className="header">
         <Box className="header-title">
             <img src="logo_light.svg" alt="QKart-icon"></img>
         </Box>

         <Link className="link" to="/">
           <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
          >
            Back to explore
          </Button>
        </Link>
       </Box> 
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      <Stack direction="row" spacing={1} alignItems="center">
      {localStorage.getItem("username") ? (
        <>
          <Avatar alt={localStorage.getItem("username")} src="avatar.png" />
          <p className="username-text"> {localStorage.getItem("username")}</p>
          <Link 
            className="link">
              <Button 
                variant="text" 
                onClick={() => {
                    localStorage.removeItem("username");
                    localStorage.removeItem("balance");
                    localStorage.removeItem("token");
                    history.push("/");
                    window.location.reload();
                }}
              >
                logout
              </Button>
          </Link>
        </>
      ) : (
        <>
          <Link 
            className="link"
          >
            <Button 
              className="explore-button" 
              variant="text"
              onClick={()=> {history.push("/login")}}
            >
                Login
            </Button>
          </Link>
          <Link 
            className="link"
            >
              <Button 
                variant="contained" 
                color="success"
                onClick={()=> {history.push("/register")}}
              >
                Register
              </Button>
          </Link>
        </>
      )}
      </Stack>
    </Box>
  );
};

export default Header;

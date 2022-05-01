import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import CheckOut from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `https://qkart-frontend-harshal.herokuapp.com/api/v1`,
};

function App() {
  return (
    <div className="App">
          <Router>
            <Switch>
              <Route exact path="/">
                <Products />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/checkout">
                <CheckOut />
              </Route>
              <Route path="/thanks">
                <Thanks />
              </Route>
            </Switch>
          </Router>
    </div>
  );
}

export default App;

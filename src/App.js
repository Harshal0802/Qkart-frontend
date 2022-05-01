import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
// import CheckOut from "./components/Checkout";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

{/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
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
              {/* <Route path="/checkout">
                <CheckOut />
              </Route> */}
            </Switch>
          </Router>
    </div>
  );
}

export default App;

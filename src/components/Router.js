import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../pages/Auth";
import Home from "../pages/Home";

const AppRouter = ({isLoggedIn}) => {
  
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home />
            </Route>
          </>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};
export default AppRouter;
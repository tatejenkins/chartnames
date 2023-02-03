import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import ChartName from "./components/chart-name";
import ChartNameCurve from "./components/chart-name-curve";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-brand">
          Chart Names
        </div>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/"} className="nav-link">
              Chart Name Popularity
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/similar"} className="nav-link">
              Find Similarly Popular Names
            </Link>
          </li>
        </div>
      </nav>

      <div className="container my-4">
        <Switch>
          <Route exact path={["/", "/chart-name"]} component={ChartName} />
          <Route path={"/similar"} component={ChartNameCurve} />
        </Switch>


      </div>

    </div>
  );
}

export default App;

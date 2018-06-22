import {render} from 'react-dom';
import React, { PropTypes } from 'react';
import {Link, IndexRoute, Route, Router } from "react-router";

import Home from "./views/home.js";

let routes = (
  <Router>
    <Route path="/">
      <IndexRoute component={Home}/>
    </Route>
  </Router>
)

render(routes, document.getElementById("main"));

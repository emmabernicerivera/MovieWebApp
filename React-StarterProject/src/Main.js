import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from "./App";
import MovieDetails from './MovieDetails';

const Main = () => (
  <main>
    <Switch>
        <Route exact path='/' component={App}/>
        <Route path='/movie/:id/:tconst' component={MovieDetails}/>
    </Switch>
  </main>
)

export default Main
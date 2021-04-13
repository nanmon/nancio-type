import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

function Router() {
  return (
    <HashRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch>
            <Route path="/quotes">
              <Quotes/>
            </Route>
            <Route path="/yoshi">
              <Yoshi/>
            </Route>
            <Route path="/banana">
              <Banana/>
            </Route>
            <Redirect to="/quotes"/>
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
}

export default Router;

const Quotes = React.lazy(() => import('./quotes/Quotes'));
const Yoshi = React.lazy(() => import('./yoshi/Yoshi'));
const Banana = React.lazy(() => import('./banana/Banana'));
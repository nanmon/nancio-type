import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Quotes from './quotes/Quotes';
import Yoshi from './yoshi/Yoshi';
import Cookie from './cookie/Cookie';

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/quotes">
          <Quotes/>
        </Route>
        <Route path="/yoshi">
          <Yoshi/>
        </Route>
        <Route path="/cookie">
          <Cookie/>
        </Route>
        <Redirect to="/quotes"/>
      </Switch>
    </HashRouter>
  );
}

export default Router;
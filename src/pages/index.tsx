import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Quotes from './quotes/Quotes';
import Yoshi from './yoshi/Yoshi';

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
        <Redirect to="/quotes"/>
      </Switch>
    </HashRouter>
  );
}

export default Router;
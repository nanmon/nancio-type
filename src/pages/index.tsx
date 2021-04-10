import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Quotes from './quotes/Quotes';
import Yoshi from './yoshi/Yoshi';
import Banana from './banana/Banana';

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
        <Route path="/banana">
          <Banana/>
        </Route>
        <Redirect to="/quotes"/>
      </Switch>
    </HashRouter>
  );
}

export default Router;
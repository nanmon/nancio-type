import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Quotes from './quotes/Quotes';
import Yoshi from './yoshi/Yoshi';

function Router() {
  return (
    <BrowserRouter basename="/nancio-type">
      <Switch>
        <Route path="/quotes">
          <Quotes/>
        </Route>
        <Route path="/yoshi">
          <Yoshi/>
        </Route>
        <Redirect to="/quotes"/>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
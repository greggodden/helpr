import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Nav from './Components/Nav/Nav.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Body from './Components/Body/Body.jsx';
import SignUp from './Components/SignUp/SignUp.jsx';
import Login from './Components/Login/Login.jsx';

const App = () => {
  return (
    <>
      <Nav />
      <Switch>
        <Route exact path='/' component={Body} />
        <Route exact path='/sign-up' component={SignUp} />
        <Route exact path='/login' component={Login} />
      </Switch>
      <Footer />
    </>
  );
};

export default withRouter(App);

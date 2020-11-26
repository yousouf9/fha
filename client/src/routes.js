import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Layout from './hoc/layout/layout';
import Home from './container/home_container';
import Property from './container/property_container';
import Contact from './container/contact_us_container';
import AdminDashboard from './hoc/layout/administrator/layout';
import Notifications from './components/administrator/notifications/notification_list';
import Messages from './components/administrator/messages/message_list';
import AdminAuth from './hoc/layout/administrator/auth';
import AdminLogin from './container/admin/admin_login';
import AdminLogout from './components/administrator/logout';
import Message from './components/administrator/messages/message';
import AssetsHome from './container/assets';
import AddEstate from './container/assets/estate/add';
import UpdateEstate from './container/assets/estate/update';
import ViewEstates from './container/assets/estate/view';
import AddPlot from './container/assets/plot/add';

const routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/"  exact component={Home}/>
                <Route path="/properties"  exact component={Property}/>
                <Route path="/contact"  exact component={Contact}/>
                <Route path="/admin/login" exact component={AdminAuth(AdminLogin, false)}/>
                  <AdminDashboard>
                      <Switch>
                            <Route path='/admin/notifications' exact component={AdminAuth(Notifications, true)} />
                            <Route path='/admin/messages' exact component={AdminAuth(Messages, true)} />
                            <Route path='/admin/logout' exact component={AdminAuth(AdminLogout, true)}/>
                           <Route path='/admin/message/:id' exact component={AdminAuth(Message, true)}/>
                           <Route path='/admin/assets' exact component={AdminAuth(AssetsHome, true)}/>
                           <Route path='/admin/add/estate' exact component={AdminAuth(AddEstate, true)}/>
                           <Route path='/admin/add/plot' exact component={AdminAuth(AddPlot, true)}/>
                           <Route path='/admin/view/estate' exact component={AdminAuth(ViewEstates, true)}/>
                           <Route path='/admin/view/estate/:id' exact component={AdminAuth(UpdateEstate, true)}/>


                     </Switch>
                  </AdminDashboard>
            </Switch>
        </Layout>
    );
};

//<Route path="/administrator"  exact component={AdminAuth(AdminHome, true)}/>
//<Route path='/admin/logout' exact component={AdminAuth(AdminLogout, true)}/>
//<Route path='/admin/admin' exact component={Auth(Register, true)}/>
export default routes;


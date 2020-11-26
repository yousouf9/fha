import React from 'react';
import {Route,Switch} from 'react-router-dom'
import Layout from './hoc/layout/layout';



const Routes = (props) =>  {
  

     
    return (
        <Layout>
            <Switch>
            <Route   path="/" exact component={Home} />
            <Route   path="/articles/:id" exact component={NewsArticles} />
            <Route  path="/videos/:id" exact component={VideosArticles} />
            <Route   path="/news" exact component={News} />
            <Route  path="/videos" exact component={Videos} />
            <Route   path="/sign-in" exact component={Sigin} />
            <Route   path="/dashboard" exact component={Dashboard} />
            </Switch>
        </Layout>
    );

}

export default Routes;
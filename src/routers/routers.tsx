import * as React from 'react'
import configs from '../../configs'
// 公用组件
import Header from '../containers/Index/Components/Header'
import Footer from '../containers/Index/Components/Footer'

import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom'

function Routers({
  history,
  routes,
  children,
}) {
  return (
    configs.render === 'server' ?
      <div>
        {children}
        <Switch>
          {
            routes.map(route => (
              <Route
                key={route.path}
                {...route}
              />
            ))
          }
          <Route component={() => <h1>404-Not Found</h1>} />
        </Switch>
      </div>
      :
      <BrowserRouter>
        <div>
          {children}
          <Switch>
            {
              routes.map(route => (
                <Route key={route.path}
                  path={route.path}
                  exact={route.exact}
                  strict={true}
                  render={(props) => route.noHead ? <div><route.component {...props} /></div> : <div><Header /><route.component {...props} /><Footer /></div>}
                />
              ))
            }
            <Route component={() => <h1>404-Not Found</h1>} />
          </Switch>
        </div>
      </BrowserRouter>
  )
}

export default Routers

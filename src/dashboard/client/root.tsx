import * as React from 'react';
import Helmet from 'react-helmet';

import { Redirect, Link, Route, RouteComponentProps } from 'react-router-dom';
import itemsComponent from './components/items';
import { renderRoutes, RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { MaytrixXClient } from '../../domain/MaytrixXClient';
import { StaticContext } from 'react-router';


interface Props
{
  [key : string] : any;
}


export default class extends React.Component<any, any>
{
  render()
  {
    const APP_NAME = this.props.staticContext.bot.user?.username;
    return (
      <div>
        <Helmet titleTemplate={`%s - ${APP_NAME}`} defaultTitle={APP_NAME} />
        <p><Link to='/'>Home</Link></p>
        <p><Link to='/items'>items</Link></p>
        <p><Link to='/not-found'>Not Found</Link></p>
        <hr />
        {renderRoutes(this.props.route?.routes!)}
      </div>
    )
  }
}

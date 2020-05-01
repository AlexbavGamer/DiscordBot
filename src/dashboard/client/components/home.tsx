import * as React from 'react';
import Helmet from 'react-helmet';
import { MaytrixXClient } from '../../../domain/MaytrixXClient';
import { StaticRouterContext, StaticRouterProps, StaticContext } from 'react-router';
import { RouteConfigComponentProps, RouteConfig } from 'react-router-config';

export default class Home extends React.Component<RouteConfigComponentProps<{ id : string}>>
{
  public render () {
    return (
      <div>
        <Helmet title='Home' />
        Home<br/>
      </div>
    );
  }
}

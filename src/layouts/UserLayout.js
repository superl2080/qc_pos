import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';

const { AuthorizedRoute } = Authorized;

const copyright = <div>Copyright <Icon type="copyright" /> 2018 青橙版权所有 </div>;
const logo = '/logo.png';

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '青橙合伙人平台';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 青橙合伙人平台`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>青橙合伙人平台</span>
                </Link>
              </div>
              <div className={styles.desc}></div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    authority={item.authority}
                    redirectPath="/"
                  />
                )
              )}
              <Redirect exact from="/user/guest" to="/user/guest/login" />
            </Switch>
          </div>
          <GlobalFooter links={[{
            key: '如何成为合伙人',
            title: '如何成为合伙人',
            href: 'http://www.51qingcheng.com/profit.html',
            blankTarget: true,
          }]} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

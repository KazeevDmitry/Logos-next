import React from 'react';
// import { pathToRegexp }from "path-to-regexp";
import { useRouter } from 'next/router';
import Link from 'next/link'

import { Breadcrumb } from 'antd';


function Breadcrumbs({ location }){
    const router = useRouter()
    const pathname = router.pathname;
    const pathSnippets = pathname.substring(1).split('/');
    const extraBreadcrumbItems = [];
    pathSnippets.forEach((name, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      extraBreadcrumbItems.push(<Breadcrumb.Item key={url} style={{fontSize: "14px"}}>
        
        <Link href={url} >
          <a>{name}</a>
        </Link>
      </Breadcrumb.Item>);
    });
    const BreadcrumbItems = [(
      <Breadcrumb.Item key="/" style={{fontSize: "14px"}}>
        <Link href="/" >
          <a>Home</a>
        </Link>
      </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);


  return <Breadcrumb>
      {BreadcrumbItems}
  </Breadcrumb>
}

export default Breadcrumbs;
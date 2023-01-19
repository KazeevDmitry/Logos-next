
import React, { useEffect } from 'react'
import { useRouter } from "next/router";
import { Pagination } from 'antd';



export default function MyPagination({page, pageSize, total, setPage}) {

    const router = useRouter();

    function handlePaginationChange(value) {
    
        router.query.page = value;
        const url = {
          pathname: router.pathname,
          query: router.query
        }
        router.push(url, undefined, { shallow: true });
        setPage(value);
      }

    return(
        <Pagination 
              current={page} 
              onChange={handlePaginationChange} 
              //total={  data?.info.pages} 
              total={total}
              pageSize={pageSize}
              //showLessItems={true}
              hideOnSinglePage={true} 
              //size={THEME?.id === "xs"||THEME?.id==="sm" ? "small" : "middle"}
              size="small"
        />
    )
}
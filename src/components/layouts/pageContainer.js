
import React, {useContext} from 'react';

import styles from './pageContainer.module.less';
import { Row } from 'antd';
import { ThemeContext } from '../../Providers/themeContext';

export default function PageContainer (props) {
    const theme = useContext(ThemeContext);
    const gorGutter = `${theme?.gutters.gorizontal[theme?.id]/2}px`;
return (
    <div className={styles.container}>
        <Row gutter = {[theme?.gutters.gorizontal, theme?.gutters.vertical]} style={{width: `100%+${gorGutter}`}}>
          {props.children}
          </Row>
      </div>  

)};      
import React from 'react'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

import Logo from 'components/Logo'
import SearchContainer from 'search/containers/Search'
import Footer from 'components/Footer'
import styles from './Header.module.css'

export default () => {
  const location = useLocation()
  const fullSize = location.pathname === '/'
  return (
    <header className={classNames(styles.header, fullSize ? styles.full : styles.top)}>
      <div className='layout-section'>
        <Logo className={styles.logo} fat={fullSize} />
        <SearchContainer className={styles.search} autoFocus={fullSize} fat={fullSize} />
        {fullSize &&
          <Footer />}
      </div>
    </header>
  )
}

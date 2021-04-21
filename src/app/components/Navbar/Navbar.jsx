import React from 'react'
import { Link } from 'react-router-dom'

import './style.scss'

const classes = {
  header: 'header',
  nav: 'nav',
  item: 'nav-item',
}

const Navbar = () => {
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <Link to="/" role="menuitem" className={classes.item}>
          Add ingredient
        </Link>
        <Link to="/ingredients" role="menuitem" className={classes.item}>
          Ingredients
        </Link>
        <Link to="/create-salad" role="menuitem" className={classes.item}>
          Create salad
        </Link>
        <Link to="/salads" role="menuitem" className={classes.item}>
          Salads
        </Link>
      </nav>
    </header>
  )
}

export default Navbar

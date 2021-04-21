import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import Navbar from 'components/Navbar'
import AddIngredientPage from './pages/AddIngredientPage'
import IngredientsPage from './pages/IngredientsPage'
import SaladsPage from './pages/SaladsPage'
import CreateSaladPage from './pages/CreateSaladPage'

import {
  ThemeProvider as MUIThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'

const ThemeProvider = props => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#5D7DE2',
      },
    },
  })

  return <MUIThemeProvider theme={theme}>{props.children}</MUIThemeProvider>
}

import './appStyles.scss'

const App = () => {
  return (
    <ThemeProvider>
      <div className="app-wrapper">
        <Navbar />
        <main className="main">
          <Switch>
            <Route path="/" exact component={AddIngredientPage} />
            <Route path="/ingredients" component={IngredientsPage} />
            <Route path="/salads" component={SaladsPage} />
            <Route path="/create-salad" component={CreateSaladPage} />
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    </ThemeProvider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default App

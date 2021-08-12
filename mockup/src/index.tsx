import React from 'react'
import ReactDOM from 'react-dom'
import { Web3ReactProvider } from '@web3-react/core'
import {menuConfig} from 'dapp-comp'
import { ethers } from 'ethers'
import { AppLayout } from "./components/AppLayout";
import { BrowserRouter as Router} from 'react-router-dom';
import './styles/main.scss'
import './index.css'

function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider)
  return library
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <AppLayout menuConfig={menuConfig} />
      </Router>
    </Web3ReactProvider>
  </React.StrictMode>
, document.getElementById('root'))

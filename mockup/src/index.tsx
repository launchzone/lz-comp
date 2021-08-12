import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Web3ReactProvider } from '@web3-react/core'
import DappComp from 'dapp-comp'
import { ethers } from 'ethers'
import { AppLayout } from "./components/AppLayout";
import './styles/main.scss'

function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider)
  return library
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppLayout component={DappComp}/>
    </Web3ReactProvider>
  </React.StrictMode>
, document.getElementById('root'))

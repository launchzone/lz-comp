import React, { useEffect } from 'react'

const DAPP_CONFIG = {
  name: 'Dapp Name',
  path: '/dapp',
  children: [{
    name: 'Sub Menu 1',
    path: '/dapp/sub1'
  }, {
    name: 'Sub Menu 2',
    path: '/dapp/sub2'
  }],
}

export default ({
  theme,
  useWeb3React,
  useSubPage,
  configDapp,
}: {
  theme: string
  useWeb3React: any
  useSubPage: any
  configDapp?: any
}) => {
  const { account } = useWeb3React()
  const subPage = useSubPage()

  useEffect(() => {
    configDapp(DAPP_CONFIG)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme === 'dark' ? '#000000' : '#E5E5E5',
        color: theme === 'dark' ? '#FFFFFF' : '#000000'
      }}
    >
      <p>{DAPP_CONFIG.name}</p>
      <p>Path: {subPage}</p>
      <p>Account: {account}</p>
    </div>
  )
}

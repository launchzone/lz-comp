import React from 'react'
import { ReactComponent as Icon } from './copy.svg';

const configs = {
  icon: Icon,
  name: 'Dapp',
  path: '/dapp',
  children: [
    {
      name: 'Sub Menu 1',
      path: '/dapp/sub1'
    },
    {
      name: 'Sub Menu 2',
      path: '/dapp/sub2'
    }
  ]
}

const Dapp = ({
  theme,
  useWeb3React,
  useSubPage,
}: {
  theme: string
  useWeb3React: any
  useSubPage: any
}) => {
  const { account } = useWeb3React()
  const subPage = useSubPage()

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme === 'dark' ? '#000000' : '#E5E5E5',
        color: theme === 'dark' ? '#FFFFFF' : '#000000'
      }}
    >
      <p>{configs.name}</p>
      <p>Path: {subPage}</p>
      <p>Account: {account}</p>
    </div>
  )
}

export default {
  configs,
  Dapp,
}

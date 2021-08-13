import React, { useEffect } from 'react'

const menuConfig = [
  {
    name: 'Sub menu 1',
    path: '/sub-1'
  },
  {
    name: 'Sub menu 2',
    path: '/sub-2'
  }
]
const DAPP_NAME = 'Dapp'

export default ({
  theme,
  useWeb3React,
  selectedMenu,
  initSubMenu,
  initDappName
}: {
  theme: string
  useWeb3React: any
  selectedMenu: any
  initSubMenu?: any
  initDappName?: any
}) => {
  const { account } = useWeb3React()
  const { selectedPath } = selectedMenu()

  useEffect(() => {
    initSubMenu(menuConfig)
    initDappName(DAPP_NAME)
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
      <p>Dapp page</p>
      <p>selected path: {selectedPath}</p>
      <p>Account: {account}</p>
    </div>
  )
}

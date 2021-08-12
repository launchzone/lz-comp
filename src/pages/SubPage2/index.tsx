import React, { useEffect } from 'react'

export const SubPage2 = ({
  theme,
  useWeb3React,
  selectSubMenu
}: {
  theme: string
  useWeb3React: any
  selectSubMenu: any
}) => {
  const { account } = useWeb3React()

  useEffect(() => {
    selectSubMenu()
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
      <p>Sub page 2</p>
      <p>Account: {account}</p>
    </div>
  )
}

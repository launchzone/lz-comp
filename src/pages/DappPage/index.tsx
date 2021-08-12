import React from 'react'

export const DappPage = ({
  theme,
  useWeb3React
}: {
  theme: string
  useWeb3React: any
}) => {
  const { account } = useWeb3React()

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
      <p>Account: {account}</p>
    </div>
  )
}

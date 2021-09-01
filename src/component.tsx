import React from 'react'
import './component.scss'

export default ({
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
    <div className='mockup-dapp'>
      <p>Path: {subPage}</p>
      <p>Account: {account}</p>
    </div>
  )
}

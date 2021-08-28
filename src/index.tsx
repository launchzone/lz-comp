import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ReactComponent as Icon } from './icon.svg'

const svgText = ReactDOMServer.renderToString(<Icon />)
console.log(svgText)

const configs = {
  // Any component should be ok as long as it's props respect className which is resizable by CSS
  icon: (props: any) => (
    <img
      src={`data:image/svg+xml;base64,${btoa(svgText)}`}
      {...props}
    />
  ),
  name: 'Dapp',
  path: '/dapp',
  children: [{
    name: 'Sub Menu 1',
    path: '/dapp/sub1'
  }, {
    name: 'Sub Menu 2',
    path: '/dapp/sub2'
  }],
}

const Component = ({
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
  Component,
}

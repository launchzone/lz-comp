import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import abiBroker from '../abi/Broker.abi.json'
import './component.scss'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_HASH =   '0x0000000000000000000000000000000000000000000000000000000000000000'

function useLocalStorage<T>(keyName: string, defaultValue: T) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: T) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};

export default ({
  theme,
  useWeb3React,
}: {
  theme: string
  useWeb3React: any
}) => {
  const { account, library } = useWeb3React()

  const [tokenIn, setTokenIn] = useLocalStorage<string>('tokenIn', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
  const [tokenOut, setTokenOut] = useLocalStorage<string>('tokenOut', '0x55d398326f99059fF775485246999027B3197955')
  const [valueIn, setValueIn] = useLocalStorage<Number>('valueIn', 1.23)
  const [valueOutMin, setValueOutMin] = useLocalStorage<Number>('valueOutMin', 1.24)
  const [deadline, setDeadline] = useLocalStorage<Number>('deadline', 10)

  const [provider, setProvider] = useState<ethers.providers.Provider>()
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const [broker, setBroker] = useState<ethers.Contract>()

  const BROKER = '0x11Db6ca65CB7E8854788Dd8D57D31695ba32d87c'

  useEffect(() => {
    if (!library?.provider) {
      return
    }
    const provider = new ethers.providers.Web3Provider(library.provider);
    setProvider(provider)
    setSigner(provider.getSigner())

    const broker = new ethers.Contract(BROKER, abiBroker, provider)
    setBroker(broker)
  }, [library])

  useEffect(() => {

  }, [tokenIn, ])

  const handleCreate = async() => {
    if (!signer || !broker) {
      throw 'not connected'
    }
    const order = {
      tokenIn: ethers.utils.getAddress(tokenIn),
      tokenOut: ethers.utils.getAddress(tokenOut),
      amountIn: ethers.utils.parseEther(String(valueIn)),
      amountOutMin: ethers.utils.parseEther(String(valueOutMin)),
      deadline: new Date().getTime() + Math.floor(deadline * 60),
    }
    console.log(order)

    const domain = {
      name: 'Broker',
      version: '1',
      chainId: 56,
      verifyingContract: '0x11Db6ca65CB7E8854788Dd8D57D31695ba32d87c',
    }
    const types = {
      Order: [
        {name: "tokenIn", type: "address"},
        {name: "tokenOut", type: "address"},
        {name: "amountIn", type: "uint256"},
        {name: "amountOutMin", type: "uint256"},
        {name: "deadline", type: "uint256"},
      ]
    }
    const rawSignature = await signer._signTypedData(domain, types, order)
    const signature = ethers.utils.splitSignature(rawSignature)
    console.log(rawSignature, signature)

    const res = await broker.callStatic.fill(
      order,
      signature.v, signature.r, signature.s,
      [{
        router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        amount: 0,
        path: [order.tokenIn, order.tokenOut],
      }],
      ZERO_HASH,
      ZERO_ADDRESS,
      ZERO_HASH,
    ).catch(err => console.error(err?.data?.message ?? err))
    
    console.log(res)
  }

  return (
    <div className='mockup-dapp'>
      <p>Account: {account}</p>
      <div><label>tokenIn:<input type="text" value={tokenIn} onChange={e => setTokenIn(e.target.value)} /></label></div>
      <div><label>tokenOut:<input type="text" value={tokenOut} onChange={e => setTokenOut(e.target.value)} /></label></div>
      <div><label>valueIn:<input type="text" value={valueIn} onChange={e => setValueIn(e.target.value)} /></label></div>
      <div><label>valueOutMin:<input type="text" value={valueOutMin} onChange={e => setValueOutMin(e.target.value)} /></label></div>
      <div><label>deadline:<input type="text" value={deadline} onChange={e => setDeadline(e.target.value)} /></label> minutes</div>
      <div><button onClick={handleCreate}>Create</button></div>
    </div>
  )
}

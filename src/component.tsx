import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { _TypedDataEncoder } from "@ethersproject/hash";
import Broker from '../abi/Broker.json'
import IERC20 from '../abi/IERC20.json'
import './component.scss'
const bn = ethers.BigNumber.from

const BROKER = '0x45F19b5aBA58D83CF09923b7C861Be19bDe752A1'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_HASH =   '0x0000000000000000000000000000000000000000000000000000000000000000'
const MAX_VALUE =   '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'

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

const domain = {
  name: 'Broker',
  version: '1',
  chainId: 56,
  verifyingContract: BROKER,
}
const orderTypes = {
  Order: [
    {name: "tokenIn", type: "address"},
    {name: "tokenOut", type: "address"},
    {name: "amountIn", type: "uint256"},
    {name: "amountOutMin", type: "uint256"},
    {name: "deadline", type: "uint256"},
  ]
}
const deleteTypes = {
  Cancel: [
    {name: "action", type: "string"},
    {name: "order", type: "bytes32"},
  ]
}

export default ({
  theme,
  useWeb3React,
}: {
  theme: string
  useWeb3React: any
}) => {
  const { account, library } = useWeb3React()

  const [signedOrder, setSignedOrder] = useLocalStorage<any>('signedOrder', undefined)
  const [tokenIn, setTokenIn] = useLocalStorage<string>('tokenIn', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
  const [tokenOut, setTokenOut] = useLocalStorage<string>('tokenOut', '0x55d398326f99059fF775485246999027B3197955')
  const [valueIn, setValueIn] = useLocalStorage<Number>('valueIn', 1.23)
  const [valueOutMin, setValueOutMin] = useLocalStorage<Number>('valueOutMin', 1.24)
  const [deadline, setDeadline] = useLocalStorage<Number>('deadline', 10)

  const [provider, setProvider] = useState<ethers.providers.Provider>()
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const [broker, setBroker] = useState<ethers.Contract>()

  useEffect(() => {
    if (!library?.provider) {
      return
    }
    const provider = new ethers.providers.Web3Provider(library.provider);
    setProvider(provider)
    setSigner(provider.getSigner())

    const broker = new ethers.Contract(BROKER, Broker.abi, provider.getSigner())
    setBroker(broker)
  }, [library])

  useEffect(() => {

  }, [tokenIn, ])

  function getDigest(order: Record<string, any>, types: any = orderTypes) {
    // console.error('DOMAIN_SEPARATOR', _TypedDataEncoder.hashDomain(domain))
    return _TypedDataEncoder.hash(domain, types, order)
  }

  function getOrderSlot(digest: string, maker: string, deadline: Number) {
    return ethers.utils.solidityKeccak256(['bytes32', 'address', 'uint256'], [digest, maker, deadline])
  }

  function verifyOrder(signedOrder: any) {
    const { r, s, v, ...order } = signedOrder
    const signature = { r, s, v }
    const digest = getDigest(order, orderTypes)
    const maker = ethers.utils.recoverAddress(digest, signature)
    if (maker == ZERO_ADDRESS) {
      throw 'INVALID ORDER SIGNATURE'
    }
    return maker
  }

  function getOrderMaker(signedOrder: any) {
    try {
      return verifyOrder(signedOrder)
    } catch(err) {
      return ZERO_ADDRESS
    }
  }

  function verifyDeleteOrder(value: Record<string, any>, signature: any) {
    const digest = getDigest(value, deleteTypes)
    const maker = ethers.utils.recoverAddress(digest, signature)
    console.log('deleter', maker)
    if (maker != account) {
      throw 'INVALID DELETE SIGNATURE'
    }
  }

  const handleDelete = async() => {
    if (!signer || !broker) {
      throw 'not connected'
    }

    const order = {
      tokenIn: ethers.utils.getAddress(tokenIn),
      tokenOut: ethers.utils.getAddress(tokenOut),
      amountIn: ethers.utils.parseEther(String(valueIn)),
      amountOutMin: ethers.utils.parseEther(String(valueOutMin)),
      deadline: Math.floor(new Date().getTime() / 1000) + Math.floor(deadline * 60),
    }

    const digest = getDigest(order)
    const slot = getOrderSlot(digest, account, order.deadline)

    const deleteValue = {
      action: 'CANCEL',
      order: slot,
    }

    const rawSignature = await signer._signTypedData(domain, deleteTypes, deleteValue)
    const signature = ethers.utils.splitSignature(rawSignature)
    console.log(rawSignature, signature)

    verifyDeleteOrder(deleteValue, signature)
  }

  const handleCancel = async() => {
    if (!signer || !broker) {
      throw 'not connected'
    }

    const order = {
      tokenIn: ethers.utils.getAddress(tokenIn),
      tokenOut: ethers.utils.getAddress(tokenOut),
      amountIn: ethers.utils.parseEther(String(valueIn)),
      amountOutMin: ethers.utils.parseEther(String(valueOutMin)),
      deadline: Math.floor(new Date().getTime() / 1000) + Math.floor(deadline * 60),
    }

    const digest = getDigest(order)

    try {
      const res = await broker.cancel(digest, order.deadline)
      console.log(res)
    } catch(err) {
      console.error(err?.data?.message ?? err)
    }
  }

  const handleCreate = async() => {
    if (!signer || !broker) {
      throw 'not connected'
    }

    const order = {
      tokenIn: ethers.utils.getAddress(tokenIn),
      tokenOut: ethers.utils.getAddress(tokenOut),
      amountIn: ethers.utils.parseEther(String(valueIn)),
      amountOutMin: ethers.utils.parseEther(String(valueOutMin)),
      deadline: Math.floor(new Date().getTime() / 1000) + Math.floor(deadline * 60),
    }
    console.log('order', order)

    {
      const c = new ethers.Contract(order.tokenIn, IERC20.abi, signer)
      const balance = await c.callStatic.balanceOf(account)
      if (balance.lt(order.amountIn)) {
        throw `insufficient balance: ${balance.toString()} < ${order.amountIn.toString()}`
      }
      const allowance = await c.callStatic.allowance(account, BROKER)
      if (allowance.lt(order.amountIn)) {
        console.error(`insufficient allowance: ${allowance.toString()} < ${order.amountIn.toString()}`)
        return await c.approve(BROKER, MAX_VALUE)
      }
    }

    const rawSignature = await signer._signTypedData(domain, orderTypes, order)
    const signature = ethers.utils.splitSignature(rawSignature)
    console.log(rawSignature, signature)

    const signedOrder = {
      ...order,
      r: signature.r,
      s: signature.s,
      v: signature.v,
    }

    console.log('signedOrder', signedOrder)

    const parsedOrder = await broker.callStatic.parseOrder(signedOrder)
    if (parsedOrder.maker != account) {
      console.error('parsedOrder', parsedOrder)
      throw 'invalid signature'
    }

    setSignedOrder(signedOrder)
  }

  const handleFill = async() => {
    if (!signer || !broker || !signedOrder) {
      throw 'not connected'
    }
    if (!signedOrder) {
      throw 'not signed'
    }
    const maker = verifyOrder(signedOrder)
    if (maker == account) {
      throw 'maker cannot be the same with relayer'
    }
    console.log('maker', maker)
    const { r, s, v, ...order } = signedOrder

    {
      const c = new ethers.Contract(order.tokenOut, IERC20.abi, signer)
      const allowance = await c.callStatic.allowance(account, BROKER)
      if (allowance.lt(order.amountIn)) {
        console.error(`insufficient allowance: ${allowance.toString()} < ${order.amountIn.toString()}`)
        return await c.approve(BROKER, MAX_VALUE)
      }
    }

    const profit = await broker.callStatic.fill(
      signedOrder,
      [{
        amount: order.amountIn,
        steps: [[
          '0x10ED43C718714eb63d5aA57B78B54704E256024E', // pancake2 router
          order.tokenIn,
          '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00', // entry: pairFor(BUSD, USDT)
          order.tokenOut,
          account,  // exit: recipient
        ]],
      }],
      ZERO_ADDRESS,
      ZERO_HASH,
    ).catch(err => console.error(err?.data?.message ?? err))

    console.error('profit', profit.toString())
  }

  return (
    <div className='mockup-dapp'>
      <p>Account: {account}</p>
      <div><label>tokenIn:<input type="text" value={tokenIn} onChange={e => setTokenIn(e.target.value)} /></label></div>
      <div><label>tokenOut:<input type="text" value={tokenOut} onChange={e => setTokenOut(e.target.value)} /></label></div>
      <div><label>valueIn:<input type="text" value={valueIn} onChange={e => setValueIn(e.target.value)} /></label></div>
      <div><label>valueOutMin:<input type="text" value={valueOutMin} onChange={e => setValueOutMin(e.target.value)} /></label></div>
      <div><label>deadline:<input type="text" value={deadline} onChange={e => setDeadline(e.target.value)} /></label> minutes</div>
      <div>
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleCancel}>Cancel</button>
        { signedOrder && ![ZERO_ADDRESS, account].includes(getOrderMaker(signedOrder)) && <button onClick={handleFill}>Fill</button> }
      </div>
    </div>
  )
}

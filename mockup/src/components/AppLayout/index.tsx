import React, {useEffect, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import './style.scss';
import '../../styles/main.scss'
import {WalletLogoIcon} from "../Icons";
import 'web3-react-modal/dist/index.css'
import { Web3ReactModal } from 'web3-react-modal'
import connectors from '../../utils/connectors'
import {UserWalletModal} from "../UserWalletModal";
import {shortenAddressString, weiToNumber} from "../../utils/helpers";

const LS_CONNECTOR = 'web3connector'
const LS_THEME = 'theme'

export const AppLayout = (props: any) => {
    const { activate, active, account, deactivate,  chainId, library } = useWeb3React();
    const [balance, setBalance] = useState<any>();
    const [visibleWalletModal, setVisibleWalletModal] = useState<any>();
    const [visibleUserWalletModal, setVisibleUserWalletModal] = useState<any>();
    const [theme, setTheme] = useState<any>();
    const Component = props.component;

    useEffect(() => {
        const initTheme = localStorage.getItem(LS_THEME)
        setTheme(initTheme ? initTheme : 'light')
    }, [])

    useEffect(() => {
        const initConnector = localStorage.getItem(LS_CONNECTOR)
        if (initConnector) {
            const connector = Object.values(connectors)
                .map(({connector}) => connector)
                .find(connector => connector?.constructor?.name == initConnector)
            if (connector) {
                activate(connector)
            }
        }
    }, [])

    useEffect(() => {
        if (!!account && !!library) {
            library
                .getBalance(account)
                .then((balance: any) => {
                    setBalance(weiToNumber(balance))
                })
                .catch(() => {
                    setBalance(null)
                })
            setBalance(undefined)
        }
    }, [account, library, chainId])

    return <div className={`body ${theme ? theme : 'light'}`}>
        <aside className="sidebar">
            <div className="connect-wallet ">
                {
                    active ? (
                        <span
                            className='short-address-box'
                            onClick={() => setVisibleUserWalletModal(true)}
                        >
                                <span>
                                    {shortenAddressString(account ? account : '')}
                                </span>
                                <WalletLogoIcon/>
                            </span>
                    ) : (
                        <span
                            className="short-address-box"
                            onClick={() => setVisibleWalletModal(true)}
                        >
                            Login
                        </span>
                    )
                }
            </div>
            <div className='swith-theme'>
                <span>Dark Theme</span>
                <input
                  type='checkbox'
                    onChange={(e) => {
                      let themeToSet = e.target.checked ? 'dark' : 'light'
                      localStorage.setItem(LS_THEME, themeToSet)
                      setTheme(themeToSet)
                    }}
                  checked={theme === 'dark'}
                />
            </div>
        </aside>
        <section className='layout'>
            <main className='main container'>
              <Component theme={theme} useWeb3React={useWeb3React}/>
            </main>
        </section>
        <Web3ReactModal
            visible={visibleWalletModal}
            setVisible={setVisibleWalletModal}
            providerOptions={connectors}
            onConnect={(connector: any) => {
                activate(connector)
                const name = connector?.constructor?.name
                if (name) {
                    localStorage.setItem(LS_CONNECTOR, name)
                }
            }}
        />
        <UserWalletModal
            visible={visibleUserWalletModal}
            setVisible={setVisibleUserWalletModal}
            deactivate={() => {
                deactivate()
                localStorage.removeItem(LS_CONNECTOR)
            }}
            balance={balance ? balance : ''}
            account={account ? account : ''}
        />
    </div>
}

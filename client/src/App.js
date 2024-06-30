// src/App.js

import React, { useState, useEffect } from "react";
// import InputLabel from "./Components/InputLabel";
// import TextInput from "./Components/TextInput";
import MainLayout from "./Layouts/MainLayout";
import WalletInfo from "./Layouts/WalletInfo";
import Modal from "./Pages/Modal";
import { getWeb3, getContract } from "./getWeb3";

const App = () => {
  // const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curPrice, setCurPrice] = useState(1)
  const [balanceEth, setBalanceEth] = useState(0)
  const [address, setAddress] = useState('')

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Instance = await getWeb3();
      const accounts = await web3Instance.eth.getAccounts();
      const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether')

      setAddress(accounts[0])
      setBalanceEth(parseFloat(balanceEth).toFixed(2))
    }
    initWeb3()
  }, []);

  const initWeb3 = async () => {
    try {
      const web3Instance = await getWeb3();
      const contract = await getContract(web3Instance);

      // setWeb3(web3Instance)
      setContract(contract)
      const rate = parseFloat(await contract.methods.getRate().call())

      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      const ethPrice = parseFloat(data.ethereum.usd)

      setCurPrice(ethPrice / rate)

      const accounts = await web3Instance.eth.getAccounts();
      const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether')

      setAddress(accounts[0])
      setBalanceEth(parseFloat(balanceEth).toFixed(2))

    } catch (error) {
      console.error("Error connecting to web3", error);
    }
  };

  const onConnect = (e) => {
    e.preventDefault()

    initWeb3();
  }

  const onBuyToken = (e) => {
    e.preventDefault()

    setIsModalOpen(true)

  }

  return (
    <MainLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Token DApp
          </h2>
          <div className="mt-4 text-right">
            {contract ?
              (<button onClick={onBuyToken}
                className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 mr-2"
              >
                Buy Green Token
              </button>) : (
                <button onClick={onConnect}
                  className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 mr-2"
                >
                  Participate in ICO
                </button>
              )}
          </div>
        </div>
      }
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <WalletInfo address={address} balanceEth={balanceEth}>
              <Modal isOpen={isModalOpen} price={curPrice} onCloseFunc={setIsModalOpen} />
            </WalletInfo>
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default App;

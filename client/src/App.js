// src/App.js

import React, { useState } from "react";

// import InputLabel from "./Components/InputLabel";
// import TextInput from "./Components/TextInput";

import MainLayout from "./Layouts/MainLayout";
import WalletInfo from "./Layouts/WalletInfo";
import Projects from "./Layouts/Projects";

import Modal from "./Modals/BuyToken";
import Claim from "./Modals/Claim";
import Add from "./Modals/Add";

import { getWeb3, getContract, getVotingContract, getTokenContract } from "./getWeb3";

const App = () => {
  const [contract, setContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isClainOpen, setIsClaimOpen] = useState(false);
  const [curPrice, setCurPrice] = useState(1)
  const [balanceEth, setBalanceEth] = useState(0)
  const [balanceGet, setBalanceGet] = useState(0)
  const [address, setAddress] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('---');
  const [projectList, setProjectList] = useState([]);

  const initWeb3 = async () => {
    try {



      const web3Instance = await getWeb3();

      const accounts = await web3Instance.eth.getAccounts();
      const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether')

      setAddress(accounts[0])
      setBalanceEth(parseFloat(balanceEth).toFixed(2))






      const tokenContract = await getTokenContract(web3Instance);

      const balanceToken = await tokenContract.methods.balanceOf(accounts[0]).call();
      const balanceGet = web3Instance.utils.fromWei(balanceToken, 'ether')
      setBalanceGet(balanceGet)





      
      const votingContract = await getVotingContract(web3Instance);
      const contract = await getContract(web3Instance);
      setContract(contract)

      // because i transfer ownership from votingContract to tokenContract
      const owner = await contract.methods.owner().call();
      setOwnerAddress(owner);

      const projectCount = await votingContract.methods.projectCount().call();
      const projects = [];
      for (let i = 0; i < projectCount; i++) {
        const project = await votingContract.methods.getProject(i).call();
        projects.push(project);
      }
      setProjectList(projects);






      const rate = parseFloat(await contract.methods.getRate().call())

      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      const ethPrice = parseFloat(data.ethereum.usd)

      setCurPrice(ethPrice / rate)
    } catch (error) {
      console.error("Error connecting to web3", error);
    }
  }

  const getProjects = async () => {
    try {
      const web3Instance = await getWeb3();
      const votingContract = await getVotingContract(web3Instance);

      const projectCount = await votingContract.methods.projectCount().call();
      const projects = [];
      for (let i = 0; i < projectCount; i++) {
        const project = await votingContract.methods.getProject(i).call();
        projects.push(project);
      }
      setProjectList(projects);
    } catch (error) {
      console.error("Error connecting to web3", error);
    }
  }

  const getBalance = async () => {
    try {
      const web3Instance = await getWeb3();

      const accounts = await web3Instance.eth.getAccounts();
      const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether')

      setAddress(accounts[0])
      setBalanceEth(parseFloat(balanceEth).toFixed(2))

      const tokenContract = await getTokenContract(web3Instance);

      const balanceToken = await tokenContract.methods.balanceOf(accounts[0]).call();
      const balanceGet = web3Instance.utils.fromWei(balanceToken, 'ether')
      setBalanceGet(balanceGet)
    } catch (error) {
      console.error("Error connecting to web3", error);
    }
  }

  const onConnect = (e) => {
    e.preventDefault()

    initWeb3();
  }

  const onBuyToken = (e) => {
    e.preventDefault()

    setIsModalOpen(true)
  }

  const onAddModal = (e) => {
    e.preventDefault()
    setIsAddOpen(true)
  }

  const onClaimModal = (e) => {
    e.preventDefault()
    setIsClaimOpen(true)
  }

  return (
    <MainLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Token DApp
          </h2>
          <div className="mt-4 text-right">
            {(ownerAddress === address) && (
              <button onClick={onAddModal}
                className="bg-blue-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-blue-600 mr-2">
                Add Project
              </button>
            )}
            {(balanceGet !== 0) && (
              <button onClick={onClaimModal}
                className="bg-cyan-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-cyan-600 mr-2">
                Claim Dividend
              </button>
            )}
            {contract ?
              (<button onClick={onBuyToken}
                className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 mr-2"
              >
                Buy Green Token
              </button>) : (
                <button onClick={onConnect}
                  className="bg-cyan-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-cyan-600 mr-2"
                >
                  Participate in ICO
                </button>
              )}
          </div>
        </div>
      }
    >
      <div className="py-4 mt-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <Modal isOpen={isModalOpen} price={curPrice} onCloseFunc={setIsModalOpen} refresh={getBalance} />
            <Claim isOpen={isClainOpen} onCloseFunc={setIsClaimOpen} refresh={getBalance} />
            <WalletInfo address={address} balanceEth={balanceEth} balanceGet={balanceGet} />
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <Add isOpen={isAddOpen} onCloseFunc={setIsAddOpen} refresh={getProjects} />
            <Projects projects={projectList} isOwner={ownerAddress === address} refresh={getProjects} refreshAccount={getBalance} />
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default App;

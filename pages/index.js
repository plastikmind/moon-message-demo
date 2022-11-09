import abi from "../utils/MoonMessage.json";
import { ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useState } from "react";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0xeeB73293Ee03e6D2E65b240521b64280458b08e2";
  const contractABI = abi.abi;

  const chainId = "0x5";
  const chainName = "Goerli test network";
  const rpcUrls = "https://rpc.goerli.mudit.blog/";
  const blockExplorerUrls = "https://goerli.etherscan.io";
  const currencyName = "Görli Ether";
  const currencySymbol = "ETH";

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [isSent, setIsSent] = useState(false);
  const [ether, setEther] = useState(true);

  // Wallet connection logic
  const isWalletConnected = async (ethereum) => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
        setEther(false);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x5",
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendToMoon = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const moonMessage = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..");
        const moonTxn = await moonMessage.sendToMoon(
          name ? name : "anon",
          message ? message : "Enjoy!",
          { value: ethers.utils.parseEther("0.001") }
        );

        await moonTxn.wait();

        console.log("mined ", moonTxn.hash);

        console.log(" purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const moonMessage = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await moonMessage.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let moonMessage;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      moonMessage = new ethers.Contract(contractAddress, contractABI, signer);

      moonMessage.on("NewMemo", onNewMemo);
    }

    return () => {
      if (moonMessage) {
        moonMessage.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  return (
    <div className="bg-star bg-cover flex flex-col min-w-full overflow-x-hidden ">
      <Head>
        <title>Moon Message</title>
        <meta name="description" content="Send your message to the moon!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen">
        <div className="mt-10 flex justify-center w-full">
          {currentAccount ? (
            <div className="flex justify-center text-center">
              <form onSubmit={() => setIsSent((current) => !current)}>
                <div className="mt-20">
                  <p className="text-white text-4xl mb-20">
                    Send a Message <br />{" "}
                    <span className="text-2xl">0.001 ETH</span>
                  </p>
                  <label className="text-white">Name</label>
                  <br />
                  <input
                    id="name"
                    type="text"
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="bg-opacity-0 bg-black border border-blue-500 text-gray-200 mt-4 md:w-60 px-4 py-2 text-center"
                  />
                </div>
                <br />
                <div>
                  <label className="text-white">Message</label>
                  <br />

                  <textarea
                    rows={3}
                    id="message"
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    className="bg-opacity-0 bg-black border border-purple-500 text-gray-200 mt-4 p-2 md:w-60 lg:w-72 xl:h-52 2xl:p-4 2xl:h-72 2xl:w-[480px] text-center"
                  ></textarea>
                </div>
                <div className="pt-10">
                  <button
                    type="button"
                    onClick={sendToMoon}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Send to the Moon!
                    </span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <p className="text-white text-2xl sm:text-5xl uppercase font-extralight tracking-[.5em] sm:tracking-[.8em] text-center leading-normal lg:pt-10">
                Moon Message
              </p>
              {/* <div className='mt-40 animate-[spin_30s_linear_infinite]'>

                <img src='/monkeyastronaut.png' className='h-80'></img>
              </div> */}
              <div className="mt-40 flex">
                <img
                  src="/monkeyastronaut.png"
                  className="h-48 dortyuz:mt-52  sm:h-60 md:h-72 lg:h-80 mt-32 animate-turning ml-8 sm:left-20 xl:ml-0"
                ></img>
                <img
                  src="/moon.png"
                  className="h-48 sm:h-80 lg:h-[480px] right-8 top-48 md:right-20 lg:right-28 2xl:right-80 2xl:h-[550px] absolute animate-[spin_260s_linear_infinite]"
                ></img>
              </div>
              <div className="text-white mt-20 px-2 flex justify-center text-center tracking-wider font-extralight lg:text-xl">
                <p>
                  Maybe ethereum isn't on the moon yet. <br />
                  But your message can be. <br />
                  Let's send your message to the Moon!{" "}
                </p>
              </div>

              {/* <div className="mt-12 flex justify-center">
                <button
                  onClick={connectWallet}
                  className="relative inline-flex items-center justify-center p-0.5 mb-16 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#151515] rounded-md group-hover:bg-opacity-0">
                    Connect Your Wallet
                  </span>
                </button>
              </div> */}

              {ether ? (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={connectWallet}
                    className="relative inline-flex items-center justify-center p-0.5 mb-16 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#151515] rounded-md group-hover:bg-opacity-0">
                      Connect Your Wallet
                    </span>
                  </button>
                </div>
              ) : (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={connectWallet}
                    className="relative inline-flex items-center justify-center p-0.5 mb-16 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#151515] rounded-md group-hover:bg-opacity-0">
                      Please Install Metamask
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* <div className="flex justify-center w-full text-white">selam</div> */}

        {/* {currentAccount && (<h1>Memos received</h1>)}

        {currentAccount && (memos.map((memo, idx) => {
          return (
            <div key={idx} style={{ border: "2px solid", "borderRadius": "5px", padding: "5px", margin: "5px" }}>
              <p style={{ "fontWeight": "bold" }}>"{memo.message}"</p>
              <p>From: {memo.name} at {memo.timestamp.toString()}</p>
            </div>
          )
        }))} */}
      </div>
    </div>
  );
}

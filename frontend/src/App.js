import './css/App.css';
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Contract from "./contracts/contracts/NFTCollectible.sol/NFTCollectible.json";
import Footer from './Components/Footer';
import { ethers } from "ethers";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import SquirrelsSvg from "./assets/rinkeby_squirrels.gif";
import View from './Components/View';
import paymentButton from './assets/paymentButton.png';
import { Button } from '@mui/material';
import superAgent from 'superagent';

// コントラクトのアドレスとABIを設定
const CONTRACT_ADDRESS = [
  "0xDFb533125a3Fdde24c1cdCe563aa7bEBaAd5A1Cd",
  "0xAa363921A48Eac63F802C57658CdEde768B3DAe1",
  "0xAa363921A48Eac63F802C57658CdEde768B3DAe1",
  "0xd36dbfb7Cb30167A92650A00Ca460d0EDd834780",
  "0x336709CAbCB19362Bf9374aE4811FF934E9626B6"
];
const ABI = Contract.abi;
const MAX_SUPPLY = 30;
const POLYGONSCAN_LINK = `https://mumbai.polygonscan.com/address/${CONTRACT_ADDRESS[0]}`;
const BLOCKSCOUT_LINK = `https://blockscout.com/shibuya/address/${CONTRACT_ADDRESS[1]}/transactions`;
const BLOCKSCOUT_LINK2 = `https://blockscout.com/shiden/address/${CONTRACT_ADDRESS[2]}/transactions`;
const ETHERSCAN_LINK = `https://goerli.etherscan.io/address/${CONTRACT_ADDRESS[3]}`;
const SNOWTRACE_LINK = `https://testnet.snowtrace.io/address/${CONTRACT_ADDRESS[4]}`;
const OPENSEA_LINK = "https://testnets.opensea.io/account";

// スピナー用の変数
const override = css`
  display: block;
  margin: 0 auto;
`;

/**
 * StyledPaperコンポーネント
 */
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 600,
  height: 400,
  backgroundColor: '#fde9e8',
}));

/**
 * Appコンポーネント
 */
function App() {
  // ステート変数
  const [supply, setSupply] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [mintingFlg, setMintingFlg] = useState(false);
  const [networkId, setNetworkId] = useState(null);
  const [contractAddr, setContractAddr] = useState(null);
  const [count, setCount] = useState(1);
  const [viewFlg, setViewFlg] = useState(false);
  const [baseURI, setBaseURI] = useState(null);
  const [baseApiUrl, setBaseApiUrl] = useState("http://localhost:8080");
  const [basePrice, setBasePrice] = useState(100);
  const [paymentUrl, setPaymentUrl] = useState("");

  /**
   * ウォレットの接続状態を確認するメソッド
   */
  const checkWalletIsConnected = async() => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
       // 接続しているチェーンが Rinkebyであることを確認する。
       let chainId = await ethereum.request({ method: "eth_chainId" });
       if (chainId === "0x13881" || "0x51" || "0x150" || "0x5" || "0xa869") {
        setNetworkId(chainId);
        // ネットワークによってセットするコントラクトのアドレスを変更する。
        if (chainId === "0x13881") { // Munbai network
          setContractAddr(CONTRACT_ADDRESS[0]);
        } else if (chainId === "0x51") { // Shibuya network
          setContractAddr(CONTRACT_ADDRESS[1]);
        } else if (chainId === "0x150") { // Shiden network
          setContractAddr(CONTRACT_ADDRESS[2])
        } else if (chainId === "0x5") { // Goerli network
          setContractAddr(CONTRACT_ADDRESS[3])
        } else if (chainId === "0xa869") { // Avalanche Fuji Chain
          setContractAddr(CONTRACT_ADDRESS[4])
        }

        // アカウント情報を要求する
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account);
          setCurrentAccount(account);
          // 発行数を取得する。
          let totalSupply = await getTotalSupply();
          setSupply(totalSupply);
        } else {
          console.log("No authorized account found");
        }
       } else {
        alert("You are not connected to the Polygon Test Network!");
       } 
    }
  };

  /**
   * ウォレットを接続するためのイベントハンドラー
   */
  const connectWalletHandler = async() => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
    } else {
      // 接続しているチェーンが Rinkebyであることを確認する。
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("chain id", chainId);
      if (chainId === "0x13881" || "0x51" || "0x150" || "0x5" || "0xa869") {
        setNetworkId(chainId);
        // ネットワークによってセットするコントラクトのアドレスを変更する。
        if (chainId === "0x13881") { // Munbai network
          setContractAddr(CONTRACT_ADDRESS[0]);
        } else if (chainId === "0x51") { // Shibuya network
          setContractAddr(CONTRACT_ADDRESS[1]);
        } else if (chainId === "0x150") { // Shiden network
          setContractAddr(CONTRACT_ADDRESS[2])
        } else if (chainId === "0x05") { // Goerli network
          setContractAddr(CONTRACT_ADDRESS[3])
        } else if (chainId === "0xa869") { // Avalanche Fuji Chain
          setContractAddr(CONTRACT_ADDRESS[4])
        }

        try {
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          console.log("Found an account! Address: ", accounts[0]);
          // アカウント情報をステート変数にセットする。
          setCurrentAccount(accounts[0]);
          // 発行数を取得する。
          let totalSupply = await getTotalSupply();
          setSupply(totalSupply);
        } catch (err) {
          console.log(err);
        }
      } else {
        alert("You are not connected to the Polygon Test Network!");
      }
    }
  };

  /**
   * NFTの発行数を取得するメソッド
   */
  const getTotalSupply = async() => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        // コントラクトにアクセスするための準備
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddr, 
          ABI, 
          signer
        );
  
        // 発行数を取得する。
        let totalSupply = await nftContract.totalSupply();
        // get baseURI
        let baseUri = await nftContract.baseTokenURI();
        setBaseURI(baseUri);

        return totalSupply.toNumber();
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  };

  /**
   * NFTを実際にMintするためのメソッド
   */
  const mintNftHandler = async() => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        // コントラクトにアクセスするための準備
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddr, 
          ABI, 
          signer
        );
  
        console.log("Initialize payment");
        // value 
        var value = (0.01 * count).toString();
        // NFTを一つMintする。
        let nftTxn = await nftContract.mintNFTs(count, {
          value: ethers.utils.parseEther(value),
          gasLimit: 500_000,
        });
  
        setCount(1);
        setMintingFlg(true);
        await nftTxn.wait();
  
        console.log(`Mined, see transaction: ${nftTxn.hash}`);
        setMintingFlg(false);
        alert("Mint Success!!")
      } else {
        console.log("Ethereum object does not exist");
        alert("Mint failed...");
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Connect Walletボタンコンポーネント
   */
  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  /**
   * 決済用のURLを取得するためのメソッド
   */
  const getUrl = async() => {
    // create encode data
    const extReserved = {
      types: ['uint'],
      params: [count]
    }

    const encodedExtReserved = ethers.utils.defaultAbiCoder.encode(
      extReserved.types,
      extReserved.params
    );
    
    console.log(`extReserved: ${encodedExtReserved}`)
      
    // 決済用のURLを取得するためのAPIを呼び出す。  
    await superAgent
      .post(baseApiUrl + "/getUrl")
      .type('form')
      .send({
        amount: `${basePrice * count}`, 
        extReserved: encodedExtReserved
      })
      .set({ 
        Accept: 'application/json',
      })
      .end((err, res) => {
        if (err) {
          console.log("決済用URL取得中にエラー発生", err)
          return err;
        }
        console.log("決済用URL取得成功！：", res.body.url);
        setPaymentUrl(res.body.url);
        setMintingFlg(true)
      });
      
  };

  /**
   * NFTMintボタンコンポーネント
   */
  const mintNftButton = () => {
    return (
      <>
        <Box sx={{ flexGrow: 1, overflow: "hidden", mt: 1, my: 1}}>
          <Stack 
            direction="row" 
            justifyContent="center" 
            alignItems="center" 
            spacing={1}
          >
            <IconButton 
              aria-label="remove"
              size='large' 
              onClick={() => setCount(count - 1)}
            >
              <RemoveCircleIcon/>
            </IconButton>
            <TextField
              id="outlined-number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={count}
            />
            <IconButton 
              aria-label="add" 
              size='large' 
              onClick={() => setCount(count + 1)}
            >
              <AddCircleIcon/>
            </IconButton>
          </Stack>
        </Box>
        <Button
          onClick={getUrl}
        >
          <img 
            src={paymentButton} 
            alt="paymentButton" 
            height={50} 
          />
        </Button>
      </>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
    setMintingFlg(false);
  }, [contractAddr]);

  useEffect(() => {
    checkWalletIsConnected();
    setMintingFlg(false);
  }, [networkId]);

  return (
    <div className="main-app">
      { viewFlg ? (
        <>
          <h1>NFT View</h1>
          <Box sx={{ flexGrow: 1, mt: 2, my: 1}}>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
              >
                <View 
                  address={contractAddr} 
                  networkId={networkId}
                  baseURI={baseURI}
                />
            </Grid>
          </Box>
          <button 
            className="opensea-button cta-button"
            onClick={() => { setViewFlg(false) }}
          >
            NFTを発行する
          </button>
          <Footer/>
        </>
      ) : (
        <>
          <h1>Let's Mint NFT! 1個1,00円です。</h1>
            <Box sx={{ flexGrow: 1, overflow: "hidden", mt: 4, my: 2}}>
              <strong>
                contract address : 
                {(networkId === "0x13881") && (
                  <a href={POLYGONSCAN_LINK}>
                    {contractAddr}
                  </a>
                )} 
                {(networkId === "0x51") && (
                  <a href={BLOCKSCOUT_LINK}>
                    {contractAddr}
                  </a>
                )} 
                {(networkId === "0x150") && (
                  <a href={BLOCKSCOUT_LINK2}>
                    {contractAddr}
                  </a>
                )} 
                {(networkId === "0x5") && (
                  <a href={ETHERSCAN_LINK}>
                    {contractAddr}
                  </a>
                )} 
                {(networkId === "0xa869") && (
                  <a href={SNOWTRACE_LINK}>
                    {contractAddr}
                  </a>
                )} 
              </strong>
            </Box>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, mt: 10}}>
                <StyledPaper sx={{my: 1, mx: "auto", p: 0, paddingTop: 2, borderRadius: 4}}>  
                  <Box sx={{ flexGrow: 1, overflow: "hidden", mt: 1, my: 1}}>
                    <strong>発行状況：{supply} / {MAX_SUPPLY}</strong>
                  </Box>
                  <img src={SquirrelsSvg} alt="Polygon Squirrels" height="40%" /><br/>
                  { mintingFlg ?
                    (
                      <div>
                        <div className="spin-color">
                          Click this link !
                        </div>
                        <a href={paymentUrl}>magic link</a>
                      </div>
                    ) :( 
                    <>
                      { currentAccount ? mintNftButton() : connectWalletButton()}
                    </>
                    )
                  }
                </StyledPaper>
                <button 
                  className="opensea-button cta-button"
                  onClick={() => { setViewFlg(true) }}
                >
                  NFTを確認する
                </button>
                <Footer/>
              </Box>
            </Grid>
        </>
      )}
    </div>
  );
}

export default App;

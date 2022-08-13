import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import store_abi from "./store_abi.json";
import React, { useState } from "react";
import { ethers } from "ethers";

const SimpleStrore = () => {
  const contratAddress = "0x87A3c93eB1691173cAb1E0F7d6b9C323cc278234";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedhandler(result[0]);
          setConnButtonText("Wallet Connected");
        });
    } else {
      setErrorMessage("Need to install MetaMask");
    }
  };

  const accountChangedhandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider =new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(contratAddress, store_abi, tempSigner);
    setContract(tempContract);
  };

  const getCurrentVal = async () => {
    let val = await contract.get();
    setCurrentContractVal(val);
  };

  const setHandler = (event) => {
    event.preventDefault();
    console.log('sending ' + event.target.standardPsw.value + ' to the contract');
    contract.set(event.target.standardPsw.value);
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="wrap"
      >
        <Grid item xs={6}>
          <Button variant="text" color="primary" onClick={connectWalletHandler}>
            {connButtonText}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <h3>{defaultAccount}</h3>
          {errorMessage}
        </Grid>
        <Grid item xs={2}>
          <TextField id="standard-basic" label="Site" variant="standard" />
        </Grid>
        <Grid item xs={2}>
          <TextField id="standard-basic" label="User" variant="standard" />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={3}>
          <form onSubmit={setHandler}>
            <TextField id="standardPsw" label="Password" variant="standard" />
            <Button type={"submit"} variant="text" color="primary">
              Add To BlockChain
            </Button>
          </form>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Button onClick={getCurrentVal} variant="text" color="primary">
            Get from blockchain
          </Button>
        </Grid>
        <Grid item xs={4}>
          <h3>{currentContractVal}</h3>
        </Grid>
      </Grid>

     
		<h3>	{errorMessage}</h3>

    </Container>
  );
};

export default SimpleStrore;

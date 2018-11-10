const initWeb3 = async (window) => {
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          await ethereum.enable();
      } catch (error) {
          console.error(error)
      }
  } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
  } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

window.addEventListener('load', async () => {
  await initWeb3(window)

  const account = web3.eth.accounts[0]

  web3.eth.getBalance(account, (_, wei) => {
    const balance = web3.fromWei(wei)

    alert(`Balance: ${balance.toFixed(3)}`)
  })

});

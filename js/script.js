window.addEventListener('load', async () => {
  const web3 = await initWeb3(window)

  const wallet = new Wallet(web3)
  window.wallet = wallet

  const tokenAddress = "0xD1128c7fc833A420772169dF922b8B1bE0455f4f"

  const noxonToken = new Token(web3, tokenAddress)
  await wallet.addToken(noxonToken)

  $('.token_balance').attr("href", "https://rinkeby.etherscan.io/address/" + tokenAddress)

  window.buyStarterPack = () => {
    const { current_load, promised_load, percent } = updateOrderForm()

    console.log(`Deploy contract with params ${ { current_load, promised_load, percent } }`)
    // .........
    //
    // const params = { ... }
    // const schneider_contract = Contract.deploy(web3, _SCHNEIDER_BIN, _SCHNEIDER_ABI, ...params)
    //
    // const token = noxonToken
    // token.transfer(wallet.account.address, contract.address, )
    // new Contract(...)
    // wallet.deploy contract
  }

  window.updateBalance = async () => {
    const wei = await wallet.getBalance()
    const balance = web3.utils.fromWei(wei)

    const tokenBalance = await wallet.getTokenBalance(noxonToken)

    console.log(`updateBalance() ---> Balance: ${Number(balance).toFixed(3)}`)
    console.log(`updateBalance() ---> NOXON Balance: ${Number(tokenBalance).toFixed(3)}`)

    const noxonTokenName = await noxonToken.getSymbol()

    $('.token_balance').text( Number(tokenBalance).toFixed(2) + ' ' + noxonTokenName)

    return true
  }

  window.updateBalance()
});

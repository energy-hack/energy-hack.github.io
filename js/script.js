window.addEventListener('load', async () => {
  const web3 = await initWeb3(window)

  const wallet = new Wallet(web3)
  window.wallet = wallet

  const noxonToken = new Token(web3, '0xD1128c7fc833A420772169dF922b8B1bE0455f4f')
  await wallet.addToken(noxonToken)

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

window.addEventListener('load', async () => {
  const web3 = await initWeb3(window)

  const wallet = new Wallet(web3)
  window.wallet = wallet

  const noxonToken = new Token(web3, '0x60c205722c6c797c725a996cf9cCA11291F90749')
  await wallet.addToken(noxonToken)

  const wei = await wallet.getBalance()
  const balance = web3.utils.fromWei(wei)

  const tokenBalance = await wallet.getTokenBalance(noxonToken)

  console.log(`Balance: ${Number(balance).toFixed(3)}`)
  console.log(`NOXON Balance: ${Number(tokenBalance).toFixed(3)}`)

  const noxonTokenName = await noxonToken.getName()

  $('.token_balance').text( Number(tokenBalance).toFixed(2) + ' ' + noxonTokenName)

  console.log('Done')
});

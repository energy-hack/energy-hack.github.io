window.addEventListener('load', async () => {
  const web3 = await initWeb3(window)

  const wallet = new Wallet(web3)
  window.wallet = wallet

  const noxonToken = new Token(web3, '0xD1128c7fc833A420772169dF922b8B1bE0455f4f')
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

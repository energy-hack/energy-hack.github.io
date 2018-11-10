const initWeb3 = async (window, defaultPrivateKey) => {
  const privateKey = defaultPrivateKey || "0xd63264601ef2d420fe05decf1e3f7756b2826d69c33d16b7dd1fb5b0d79fe91d"

  let web3

  if (window.ethereum) {
      web3 = new Web3(window.ethereum)
      try {
          await window.ethereum.enable()
      } catch (error) {
          console.error(error)
      }
  } else
  if (window.web3) {
      web3 = new Web3(window.web3.currentProvider)
  } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')

      const infuraProvider = 'https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl'
      const web3provider = new Web3.providers.HttpProvider(infuraProvider)

      web3 = new Web3(web3provider)
  }

  web3.eth.accounts.wallet.add(privateKey)

  window.web3 = web3

  return web3
}

class Contract {
  constructor(web3, address, abi) {
    this.isContract = true
    this.address = address
    this.contract = new web3.eth.Contract(abi, address)

    if (!this.contract)
      throw new Error(`Cant init contract`, address)
  }

  call(method, ...params) {
    const _method = this.contract.methods[method]
    if (!_method) throw new Error(`No such method: ${method} at contract ${this.address}`)

    console.log(`Calling .${method} with (${params.join(', ')})`)

    return _method(...params).call()
  }

  async send(method, from, ...params) {
    const _method = this.contract.methods[method]
    if (!_method) throw new Error(`No such method: ${method} at contract ${this.address}`)

    console.log(`Calling .${method} with (${params.join(', ')})`)

    const estimatedGas = await _method(...params).estimateGas()

    return _method(...params).send({
      from,
      gasLimit: estimatedGas || 1e5
    })
    .on('transactionHash', hash => console.log('tx hash', hash))
    .then(tx => {
      console.log('tx receipt', receipt)
      return res
    })
  }
}

class Token extends Contract {
  constructor(web3, address, abi = _ERC20ABI) {
    super(web3, address, abi)

    this.isToken = true
  }

  getName() {
    return this.call('name')
  }

  transfer(from, to, value) {
    this.send("transfer", from, to, value)
    //
    // const estimatedGas = await this.contract.methods.transfer(to, value).estimateGas()
    //
    // return this.contract.methods.transfer(to, value).send({
    //   from,
    //   gasLimit: estimatedGas || 1e5
    // })
    // .on('transactionHash', hash => console.log('tx receipt', hash))
  }

  getBalance(address) {
    return this.call("balanceOf", address)
  }
}

class Wallet {
  constructor (web3) {
    this.web3 = web3
    this.account = web3.eth.accounts.wallet[0]
    this.tokens = []
  }

  async addToken(token) {
    if (!token || !token.isToken)
      throw new Error(`Can't add token`, token)

    const tokenName = await token.getName()
    this.tokens[tokenName] = token
  }

  getBalance(address) {
    address = address || this.account.address

    return this.web3.eth.getBalance(this.account.address)
  }

  getTokenBalance(token, address) {
    address = address || this.account.address

    return token.getBalance(address)
  }
}

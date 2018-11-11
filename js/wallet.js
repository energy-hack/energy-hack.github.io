const initWeb3 = async (window, defaultPrivateKey) => {
  const privateKey = defaultPrivateKey || "0xd63264601ef2d420fe05decf1e3f7756b2826d69c33d16b7dd1fb5b0d79fe91d"

  let web3

  console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')

  const infuraProvider = 'https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl'
  const web3provider = new Web3.providers.HttpProvider(infuraProvider)

  web3 = new Web3(web3provider)

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

  static async deploy(web3, abi, { data, value, from }, ...params) {
    const Factory = new web3.eth.Contract(abi);

    const deploy = Factory.deploy({ data, arguments: params }).encodeABI();

    const nonce = await web3.eth.getTransactionCount(from, 'pending')

    let transactionObject = {
      from,
      nonce,
      data: deploy,
    };

    console.log('tx object', transactionObject)

    const estimateGas = await web3.eth.estimateGas(transactionObject)

    transactionObject.gas = estimateGas

    console.log('estimateGas', estimateGas)

    const signedTx = await web3.eth.accounts.signTransaction(transactionObject, wallet.account.privateKey)

    const tx = web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    tx.on('transactionHash', hash => console.log('tx hash', hash))

    const receipt = await tx

    console.log('tx receipt', receipt)

    const address = receipt.contractAddress

    console.log('Contract mined! address: ' + address + ' transactionHash: ' + receipt.transactionHash);

    return new Contract(web3, contract.address, abi);
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

  getDecimals() {
    return this.call('decimals')
  }

  getName() {
    return this.call('name')
  }

  getSymbol() {
    return this.call('symbol')
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

    const tokenName = await token.getSymbol()
    this.tokens[tokenName] = token
  }

  getBalance(address) {
    address = address || this.account.address

    return this.web3.eth.getBalance(this.account.address)
  }

  async getTokenBalance(token, address) {
    address = address || this.account.address

    const balance = await token.getBalance(address)
    const _decimals = await token.getDecimals()
    const decimals = parseInt(_decimals) || 18
    return balance / (10**decimals)
  }
}

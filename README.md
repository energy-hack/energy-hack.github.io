# Schneider Electric counter

A setup for trustless monthly payment settlement

# The Problem

Schneider Electric is a electricity consulting company. They can help their clients reduce electricity bill via upgrading their hardware.

1. SE reviews infrastructure and decides on a percent they aim to reduce (e.g. 27%)
2. Client sets up smart contract at https://energy-hack.github.io/order.html#starter, locking payment for SE services.
3. Smart contract updates electricity counter data from the API using Oraclize.
4. Parties track status at https://energy-hack.github.io/status.html#0xF7BCcF0032f5357c7A563ba8e5A14d43092d230e: current usage, current estimated usage.
5. After the end of the period, contract decides on the outcome and unlocks the amount of tokens:
 - if savings had taken place, SE receives payment for services in full
 - if the numbers are lower, SE receives only a fraction of their check
6. On the result page, all the info is given:
 - https://energy-hack.github.io/result#0xF7BCcF0032f5357c7A563ba8e5A14d43092d230e

# Why blockchain?

Neither SE nor client trust each other enough. Currently this data is being processed manually. Using blockchain, we can make this trustless enough, so they can trust the outcome.

Blockchain also stores all the historical values. One can check that they are in sync with real-world data. Oraclize also stores proofs in IPFS.

# Improvements
 - alerts when usage peaks above steady growth
 - more complicated formulae
 - fiat settlement is possible

# Usage

If you are interested in connecting this to your workflow, contact me at https://t.me/caffeinum or https://bykhun.com

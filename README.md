# Decentralized Lottery

## A Decentralized Lottery Smart Contract 

An application that allows users completetly decentralized access to a fair and verifiably random lottery. Blockchain technology offers the lottery industry a needed boost of transparency since it is an open-source, public ledger that makes it easy for anyone to check the exact workings of the lottery. It also reduces inefficiency and fraud as it minimizes or entirely removes human error during transactions. Alongside this, automated systems can be used to ensure that luck has less of a role in deciding who wins and who loses. 

![Dapp preview](/imgs/contract.png?raw=true )


### Benefits of Decentralization

* Transparency and Fairness
* Security
* Instant Payouts
* Winner anonymity is guaranteed

### Features of the Application

1. Enter the Raffle
This function is used to register a new user to the raffle. It does not take parameters but it does take the senders (user) account address.

2. Choose a random winner
this function is used to choose a random lottery winner by utilizing the chainlink vrfCoordinator.

/**
    @param requestId The ID value returned from calling the chainLink vrfcoordinator contract 

    @param randomWords The verified random number that we use to choose a winner from our players array
*/

3. Get player address
this function helps to view the address of an individual player. it returns the following:
/**
    @return s_player[index] **address** of the players account
*/

4. Get entrance fee
This function helps the application get the required amount of Ethereum to enter the raffle.
/**
    @return i_entranceFee **uint356** returns the amount of Ethereum required to enter the raffle.
 */

5. Get Numer of players
This function helps retrieve the number of players in the lottery

/**
    @return s_players.length **uint256** the number of players in the lottery
*/

6. Get most recent winner
This funtion gets the most recent winners address.
/** 

    @return s_recentWinner **address** The account address of the most recent winner

*/
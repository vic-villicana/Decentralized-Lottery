//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

error Raffle__notEnoughEthEntered();
error Raffle__TransferFailed();
error Raffle__NotOpen();
error Raffle__upkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    /* Type Declarations */
    enum RaffleState {
        OPEN,
        CALCULATING
    }
    
    /* state variables */

    //immutable types are cheaper on gas
    address payable[] private s_players;
    uint256 private immutable i_entranceFee;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    /* Lottery variables*/
    address private s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimestamp;
    uint256 private immutable i_interval;
    /* Events */

    event RaffleEnter(address indexed player);
    event RequestRaffleWinner(uint256 indexed requestId);
    event Winner__Picked(address indexed winner);

    constructor(
        address vrfCoordinatorV2, //contract address
        uint256 entranceFee, 
        bytes32 gasLane,
        uint64  subscriptionId,
        uint32  callbackGasLimit,
        uint256 interval 
    ) VRFConsumerBaseV2(vrfCoordinatorV2){
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimestamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() public payable{
        if(msg.value < i_entranceFee){
            revert Raffle__notEnoughEthEntered();
        }
        if(s_raffleState != RaffleState.OPEN){
            revert Raffle__NotOpen();
        }

        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender);
    }

    //will be called by the chainlink keepers network.
    //external keyword makes our function inaccsesible to our contract...
    //... therefore making it cheaper.

    function checkUpkeep(
        bytes memory /*performData */
    )     
        public 
        override 
        returns (
            bool upkeepNeeded,
            bytes memory /* performdata*/
        )
    {
            bool isOpen = (RaffleState.OPEN == s_raffleState);
            bool timepassed = ((block.timestamp - s_lastTimestamp)   > i_interval);
            bool hasPlayer = (s_players.length > 0);
            bool hasBalance = address(this).balance > 0;
            upkeepNeeded = (isOpen && timepassed && hasPlayer && hasBalance);
    }

    function performUpkeep(bytes calldata /*performdata*/) external override{
        (bool upkeepNeeded, ) = checkUpkeep("");

        if(!upkeepNeeded){
            revert Raffle__upkeepNotNeeded(
                address(this).balance,
                s_players.length, 
                uint256(s_raffleState)
            );
        }
        s_raffleState = RaffleState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {

        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimestamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if(!success){
            revert Raffle__TransferFailed();
        }
        emit Winner__Picked(recentWinner);
    }

    /* view/pure funtions */
    function getRaffleState() public view returns (RaffleState){
        return s_raffleState;
    }
    
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers(uint256 index) public view returns (address){
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view  returns(uint256) {
        return s_players.length;
    }
    
    function getLatestTimestamp() public view returns(uint256) {
        return s_lastTimestamp;
    }

    function getRequestConfirmation() public pure returns(uint256){
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }
    

}   
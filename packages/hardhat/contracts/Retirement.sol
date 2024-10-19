// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Retirement is ReentrancyGuard, Ownable, Pausable {
	IERC20 public immutable token;

	struct Transaction {
		uint256 date;
		uint256 amount;
		string txType; // "deposit" or "withdrawal"
	}

	mapping(address => uint256) public balances;
	mapping(address => uint256) public lastProofOfLife;
	mapping(address => address) public fallbackWallets;
	mapping(address => Transaction[]) public transactionHistory;

	uint256 public constant MIN_FALLBACK_PERIOD = 90 days;

	event Deposit(address indexed sender, uint256 amount);
	event Withdrawal(address indexed sender, uint256 amount);
	event ProofOfLifeUpdated(address indexed sender, uint256 timestamp);
	event FallbackWalletSet(
		address indexed sender,
		address indexed fallbackWallet
	);
	event FallbackTransfer(
		address indexed from,
		address indexed to,
		uint256 amount
	);

	constructor(address _token, address initialOwner) Ownable(initialOwner) {
		token = IERC20(_token);
	}

	function deposit(uint256 _amount) external nonReentrant whenNotPaused {
		require(_amount > 0, "Amount must be greater than 0");

		token.transferFrom(msg.sender, address(this), _amount);

		balances[msg.sender] += _amount;

		_updateProofOfLife(msg.sender);
		_recordTransaction(msg.sender, _amount, "deposit");

		emit Deposit(msg.sender, _amount);
	}

	function setFallbackWallet(address _fallbackWallet) external {
		require(_fallbackWallet != address(0), "Invalid fallback wallet");

		fallbackWallets[msg.sender] = _fallbackWallet;

		emit FallbackWalletSet(msg.sender, _fallbackWallet);
	}

	function withdraw(uint256 _amount) external nonReentrant whenNotPaused {
		require(_amount > 0, "Amount must be greater than 0");
		require(balances[msg.sender] >= _amount, "Insufficient balance");

		balances[msg.sender] -= _amount;

		token.transfer(msg.sender, _amount);

		_updateProofOfLife(msg.sender);
		_recordTransaction(msg.sender, _amount, "withdrawal");
		emit Withdrawal(msg.sender, _amount);
	}

	function transferToFallback(
		address _user
	) external nonReentrant whenNotPaused {
		require(
			block.timestamp > lastProofOfLife[_user] + MIN_FALLBACK_PERIOD,
			"Fallback period not reached"
		);
		address fallbackWallet = fallbackWallets[_user];
		require(fallbackWallet != address(0), "No fallback wallet set");

		uint256 amount = balances[_user];
		require(amount > 0, "No balance to transfer");

		balances[_user] = 0;
		token.transfer(fallbackWallet, amount);

		_recordTransaction(_user, amount, "fallback transfer");

		emit FallbackTransfer(_user, fallbackWallet, amount);
	}

	function updateProofOfLife() external whenNotPaused {
		_updateProofOfLife(msg.sender);
	}

	function _updateProofOfLife(address _sender) internal {
		lastProofOfLife[_sender] = block.timestamp;

		emit ProofOfLifeUpdated(_sender, block.timestamp);
	}

	function _recordTransaction(
		address _user,
		uint256 _amount,
		string memory _type
	) internal {
		transactionHistory[_user].push(
			Transaction(block.timestamp, _amount, _type)
		);
	}

	function getTransactionHistory(
		address _user
	) external view returns (Transaction[] memory) {
		return transactionHistory[_user];
	}

	function pause() external onlyOwner {
		_pause();
	}

	function unpause() external onlyOwner {
		_unpause();
	}
}

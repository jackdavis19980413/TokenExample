// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GreenEnergyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenEnergyProjectVoting is Ownable {
    GreenEnergyToken public token;

    struct Project {
        string description;
        uint256 voteCount;
        bool funded;
    }

    Project[] public projects;
    mapping(address => mapping(uint256 => bool)) public votes;

    // Track total dividends distributed
    uint256 public totalDividends;
    mapping(address => uint256) public claimedDividends;

    event ProjectAdded(uint256 projectId, string description);
    event Voted(address indexed voter, uint256 indexed projectId);
    event ProjectFunded(uint256 projectId, uint256 amount);
    event DividendsDistributed(uint256 amount);

    constructor(GreenEnergyToken _token) Ownable(msg.sender) {
        token = _token;
    }

    function addProject(string memory description) public onlyOwner {
        projects.push(Project({
            description: description,
            voteCount: 0,
            funded: false
        }));
        emit ProjectAdded(projects.length - 1, description);
    }

    function vote(uint256 projectId) public {
        require(projectId < projects.length, "Project does not exist");
        require(!votes[msg.sender][projectId], "Already voted for this project");

        uint256 voterBalance = token.balanceOf(msg.sender);
        require(voterBalance > 0, "No tokens to vote with");

        projects[projectId].voteCount += voterBalance;
        votes[msg.sender][projectId] = true;

        emit Voted(msg.sender, projectId);
    }

    function fundProject(uint256 projectId, uint256 amount) public onlyOwner {
        require(projectId < projects.length, "Project does not exist");
        require(!projects[projectId].funded, "Project already funded");
        require(address(this).balance >= amount, "Insufficient balance to fund project");

        projects[projectId].funded = true;

        distributeDividends(amount);

        emit ProjectFunded(projectId, amount);
    }

    function distributeDividends(uint256 amount) internal {
        totalDividends += amount;
        emit DividendsDistributed(amount);
    }

    function claimDividends() public {
        uint256 owed = calculateDividends(msg.sender);
        require(owed > 0, "No dividends to claim");

        claimedDividends[msg.sender] += owed;
        payable(msg.sender).transfer(owed);
    }

    function calculateDividends(address account) public view returns (uint256) {
        uint256 totalSupply = token.totalSupply();
        if (totalSupply == 0) {
            return 0;
        }
        uint256 balance = token.balanceOf(account);
        uint256 totalClaimed = claimedDividends[account];

        return (totalDividends * balance / totalSupply) - totalClaimed;
    }

    receive() external payable {}
}

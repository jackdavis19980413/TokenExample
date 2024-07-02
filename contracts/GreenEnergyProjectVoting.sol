// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GreenEnergyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenEnergyProjectVoting is Ownable {
    GreenEnergyToken public token;

    struct Project {
        string name;
        string description;
        uint256 voteCount;
        bool funded;
    }

    Project[] public projects;
    address[] public purchasers;
    mapping(address => mapping(uint256 => bool)) public votes;
    mapping(address => uint256) public dividends;

    // Track total dividends distributed
    uint256 public totalDividends;
    mapping(address => uint256) public claimedDividends;

    event ProjectAdded(uint256 projectId, string description);
    event Voted(address indexed voter, uint256 indexed projectId);
    event ProjectFunded(uint256 projectId, uint256 amount);
    event DividendsDistributed(uint256 amount);
    event PurchaserAdded(address purchaser);

    constructor(GreenEnergyToken _token) Ownable(msg.sender) {
        token = _token;
    }

    function addPurchaser(address purchaser) public onlyOwner {
        for (uint256 i = 0; i < purchasers.length; i++) {
            if (purchasers[i] == purchaser) {
                return;
            }
        }
        purchasers.push(purchaser);
        emit PurchaserAdded(purchaser);
    }

    function addProject(
        string memory name,
        string memory description
    ) public onlyOwner {
        projects.push(
            Project({
                name: name,
                description: description,
                voteCount: 0,
                funded: false
            })
        );
        emit ProjectAdded(projects.length - 1, description);
    }

    function vote(uint256 projectId) public {
        require(projectId < projects.length, "Project does not exist");
        require(
            !votes[msg.sender][projectId],
            "Already voted for this project"
        );

        uint256 voterBalance = token.balanceOf(msg.sender);
        require(voterBalance > 0, "No tokens to vote with");

        projects[projectId].voteCount += voterBalance;
        votes[msg.sender][projectId] = true;

        emit Voted(msg.sender, projectId);
    }

    function fundProject(uint256 projectId) public payable onlyOwner {
        require(projectId < projects.length, "Project does not exist");
        require(!projects[projectId].funded, "Project already funded");
        require(msg.value > 0, "No Ether sent");

        projects[projectId].funded = true;
        distributeDividends(msg.value);

        emit ProjectFunded(projectId, msg.value);
    }

    function distributeDividends(uint256 amount) internal {
        totalDividends += amount;
        for (uint256 i = 0; i < purchasers.length; i++) {
            dividends[purchasers[i]] += calculateDividends(
                purchasers[i],
                amount
            );
        }
        emit DividendsDistributed(amount);
    }

    function claimDividends() public {
        uint256 owed = dividends[msg.sender];
        require(owed > 0, "No dividends to claim");

        dividends[msg.sender] = 0;
        claimedDividends[msg.sender] += owed;
        payable(msg.sender).transfer(owed);
    }

    function calculateDividends(
        address account,
        uint256 amount
    ) internal view returns (uint256) {
        uint256 totalSupply = token.totalSupply();
        if (totalSupply == 0) {
            return 0;
        }
        uint256 balance = token.balanceOf(account);

        return (amount * balance) / totalSupply;
    }

    receive() external payable {}

    fallback() external payable {}

    function projectCount() public view returns (uint256) {
        return projects.length;
    }

    function getProject(
        uint256 projectId
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            uint256 voteCount,
            bool funded
        )
    {
        require(projectId < projects.length, "Project does not exist");
        Project memory project = projects[projectId];
        return (
            project.name,
            project.description,
            project.voteCount,
            project.funded
        );
    }

    function getDividend(address user) public view returns (uint256) {
        return claimedDividends[user];
    }
}

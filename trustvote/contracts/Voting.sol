// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Voter {
        bytes32 hashedBiometric;
        bool registered;
        bool voted;
        uint256 votedFor;
    }

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public admin;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint256 public votingEndTime;
    bool public votingActive;

    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter, uint256 candidateId);
    event VotingEnded(uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        require(block.timestamp <= votingEndTime, "Voting has ended");
        _;
    }

    constructor() {
        admin = msg.sender;
        votingActive = false;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
    }

    function startVoting(uint256 _durationInMinutes) public onlyAdmin {
        require(!votingActive, "Voting is already active");
        votingActive = true;
        votingEndTime = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    function registerVoter(address _voter, bytes32 _hashedBiometric) public onlyAdmin {
        require(!voters[_voter].registered, "Voter already registered");
        voters[_voter] = Voter({
            hashedBiometric: _hashedBiometric,
            registered: true,
            voted: false,
            votedFor: 0
        });
        emit VoterRegistered(_voter);
    }

    function vote(uint256 _candidateId, bytes32 _hashedBiometric) public votingIsActive {
        require(voters[msg.sender].registered, "Voter not registered");
        require(!voters[msg.sender].voted, "Already voted");
        require(_candidateId < candidates.length, "Invalid candidate");
        require(voters[msg.sender].hashedBiometric == _hashedBiometric, "Biometric verification failed");

        voters[msg.sender].voted = true;
        voters[msg.sender].votedFor = _candidateId;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function endVoting() public onlyAdmin {
        require(votingActive, "Voting is not active");
        votingActive = false;
        emit VotingEnded(block.timestamp);
    }

    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    function getVoterStatus(address _voter) public view returns (bool registered, bool voted, uint256 votedFor) {
        Voter memory voter = voters[_voter];
        return (voter.registered, voter.voted, voter.votedFor);
    }

    function getVotingStatus() public view returns (bool active, uint256 endTime, uint256 timeLeft) {
        return (votingActive, votingEndTime, votingEndTime > block.timestamp ? votingEndTime - block.timestamp : 0);
    }
} 
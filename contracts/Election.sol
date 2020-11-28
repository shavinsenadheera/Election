pragma solidity ^0.5.16;

contract Election
{
    mapping(address => User) user;
    mapping(uint => Candidate) candidate;
    address ownerAddress;
    address userAddress;
    uint candidateCount;
    uint totVotes;


    struct Candidate
    {
        uint _id;
        string _name;
        uint _count;
    }

    struct User
    {
        address _address;
        bool _check;
    }

    constructor() public
    {
        ownerAddress = msg.sender;
        candidateCount=0;
        totVotes = 0;
    }

    modifier isowner()
    {
        require(msg.sender==ownerAddress, "You are not the onwer!");
        _;
    }

    modifier isvoted()
    {
        require(user[msg.sender]._check==false);
        _;
    }

    function addCandidate(string memory _name) isowner public
    {
        candidate[candidateCount] = Candidate(candidateCount,_name,0);
        candidateCount++;
    }

    function getCandidate(uint _id) public view returns(uint,string memory, uint)
    {
        return (candidate[_id]._id, candidate[_id]._name, candidate[_id]._count);
    }

    function destroyCandidate(uint _id) isowner public
    {
        delete candidate[_id];
    }

    function getCandidateCount() public view returns(uint)
    {
        return candidateCount;
    }

    function getTotVotes() public view returns(uint)
    {
        return totVotes;
    }

    function voting(uint _id) isvoted public
    {
        candidate[_id]._count++;
        totVotes++;
        user[msg.sender]._check = true;
    }
}
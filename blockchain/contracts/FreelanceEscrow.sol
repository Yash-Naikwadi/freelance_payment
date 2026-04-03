// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserRegistry.sol";

contract FreelanceEscrow {
    UserRegistry public userRegistry;

    // Struct to hold job details
    struct Job {
        address payable client;
        address payable freelancer;
        uint256 amount;
        string description;
        bool fundsDeposited;
        bool workSubmitted;
        bool paymentReleased;
        bool cancelled;
    }

    // Mapping to store jobs, using a unique job ID
    mapping(uint256 => Job) public jobs;
    uint256 public nextJobId;

    // Events to log important actions
    event JobPosted(uint256 indexed jobId, address indexed client, string description, uint256 amount);
    event FundsDeposited(uint256 indexed jobId, address indexed client, uint256 amount);
    event WorkSubmitted(uint256 indexed jobId, address indexed freelancer);
    event PaymentReleased(uint256 indexed jobId, address indexed client, address indexed freelancer, uint256 amount);
    event JobCancelled(uint256 indexed jobId, address indexed client);

    constructor(address _userRegistryAddress) {
        require(_userRegistryAddress != address(0), "UserRegistry address cannot be zero");
        userRegistry = UserRegistry(_userRegistryAddress);
        nextJobId = 1;
    }

    // Function for the client to post a new job
    function postJob(address _freelancer, string memory _description, uint256 _amount) public {
        require(userRegistry.isClient(msg.sender), "Only registered clients can post jobs");
        require(userRegistry.isFreelancer(_freelancer), "Freelancer must be registered");
        require(_freelancer != address(0), "Freelancer address cannot be zero");
        require(_amount > 0, "Job amount must be greater than zero");

        jobs[nextJobId] = Job({
            client: payable(msg.sender),
            freelancer: payable(_freelancer),
            amount: _amount,
            description: _description,
            fundsDeposited: false,
            workSubmitted: false,
            paymentReleased: false,
            cancelled: false
        });

        emit JobPosted(nextJobId, msg.sender, _description, _amount);
        nextJobId++;
    }

    // Function for the client to deposit funds into the contract for a specific job
    function depositFunds(uint256 _jobId) public payable {
        require(userRegistry.isClient(msg.sender), "Only registered clients can deposit funds");
        require(jobs[_jobId].client == msg.sender, "Only the client can deposit funds for this job");
        require(!jobs[_jobId].fundsDeposited, "Funds already deposited for this job");
        require(msg.value == jobs[_jobId].amount, "Deposited amount must match job amount");

        jobs[_jobId].fundsDeposited = true;
        emit FundsDeposited(_jobId, msg.sender, msg.value);
    }

    // Function for the freelancer to submit work
    function submitWork(uint256 _jobId) public {
        require(userRegistry.isFreelancer(msg.sender), "Only registered freelancers can submit work");
        require(jobs[_jobId].freelancer == msg.sender, "Only the freelancer can submit work for this job");
        require(jobs[_jobId].fundsDeposited, "Funds must be deposited before work can be submitted");
        require(!jobs[_jobId].workSubmitted, "Work already submitted for this job");

        jobs[_jobId].workSubmitted = true;
        emit WorkSubmitted(_jobId, msg.sender);
    }

    // Function for the client to release payment to the freelancer
    function releasePayment(uint256 _jobId) public {
        require(userRegistry.isClient(msg.sender), "Only registered clients can release payment");
        require(jobs[_jobId].client == msg.sender, "Only the client can release payment for this job");
        require(jobs[_jobId].workSubmitted, "Work must be submitted before payment can be released");
        require(!jobs[_jobId].paymentReleased, "Payment already released for this job");

        jobs[_jobId].paymentReleased = true;
        jobs[_jobId].freelancer.transfer(jobs[_jobId].amount);
        emit PaymentReleased(_jobId, msg.sender, jobs[_jobId].freelancer, jobs[_jobId].amount);
    }

    // Function for the client to cancel a job and get funds back if work not submitted
    function cancelJob(uint256 _jobId) public {
        require(userRegistry.isClient(msg.sender), "Only registered clients can cancel jobs");
        require(jobs[_jobId].client == msg.sender, "Only the client can cancel this job");
        require(jobs[_jobId].fundsDeposited, "Funds must be deposited to cancel the job");
        require(!jobs[_jobId].workSubmitted, "Cannot cancel job after work has been submitted");
        require(!jobs[_jobId].paymentReleased, "Payment already released");
        require(!jobs[_jobId].cancelled, "Job is already cancelled");

        jobs[_jobId].cancelled = true;
        jobs[_jobId].client.transfer(jobs[_jobId].amount);
        emit JobCancelled(_jobId, msg.sender);
    }

    // Fallback function to receive Ether
    receive() external payable {
        // This contract is not intended to receive direct Ether transfers without a function call.
        // Any direct transfers will be rejected.
        revert("Direct Ether transfers not allowed without a function call");
    }

    // Function to get job details (read-only)
    function getJob(uint256 _jobId) public view returns (
        address client,
        address freelancer,
        uint256 amount,
        string memory description,
        bool fundsDeposited,
        bool workSubmitted,
        bool paymentReleased,
        bool cancelled
    ) {
        Job storage job = jobs[_jobId];
        return (
            job.client,
            job.freelancer,
            job.amount,
            job.description,
            job.fundsDeposited,
            job.workSubmitted,
            job.paymentReleased,
            job.cancelled
        );
    }
}

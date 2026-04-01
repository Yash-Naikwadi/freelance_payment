// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistry {
    enum UserRole { None, Client, Freelancer }

    mapping(address => UserRole) public userRoles;

    event UserRegistered(address indexed user, UserRole role);

    function registerClient() public {
        require(userRoles[msg.sender] == UserRole.None, "User already registered");
        userRoles[msg.sender] = UserRole.Client;
        emit UserRegistered(msg.sender, UserRole.Client);
    }

    function registerFreelancer() public {
        require(userRoles[msg.sender] == UserRole.None, "User already registered");
        userRoles[msg.sender] = UserRole.Freelancer;
        emit UserRegistered(msg.sender, UserRole.Freelancer);
    }

    function isClient(address _user) public view returns (bool) {
        return userRoles[_user] == UserRole.Client;
    }

    function isFreelancer(address _user) public view returns (bool) {
        return userRoles[_user] == UserRole.Freelancer;
    }
}

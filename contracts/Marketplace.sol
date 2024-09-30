// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Service {
        uint id;
        string name;
        string description;
        uint price; // in wei
        address payable provider;
        bool isPurchased;
        string ipfsHash; // New field for IPFS hash
    }

    uint public serviceCount = 0;
    mapping(uint => Service) public services;
    mapping(address => bool) public authenticatedUsers;

    event ServiceListed(
        uint id,
        string name,
        string description,
        uint price,
        address provider,
        string ipfsHash
    );

    event ServicePurchased(
        uint id,
        string name,
        uint price,
        address provider,
        address buyer
    );
    
    event UserAuthenticated(address user);

    modifier onlyAuthenticated() {
        require(authenticatedUsers[msg.sender], "User not authenticated");
        _;
    }

    function listService(string memory _name, string memory _description, uint _price, string memory _ipfsHash) public onlyAuthenticated {
        require(bytes(_name).length > 0, "Service name required");
        require(bytes(_description).length > 0, "Service description required");
        require(_price > 0, "Price must be greater than zero");

        serviceCount++;
        services[serviceCount] = Service(serviceCount, _name, _description, _price, payable(msg.sender), false, _ipfsHash);

        emit ServiceListed(serviceCount, _name, _description, _price, msg.sender, _ipfsHash);
    }

    function purchaseService(uint _id) public payable onlyAuthenticated {
        Service storage _service = services[_id];
        require(_service.id > 0 && _service.id <= serviceCount, "Service not found");
        require(msg.value == _service.price, "Incorrect payment amount");
        require(!_service.isPurchased, "Service already purchased");

        _service.provider.transfer(msg.value);
        _service.isPurchased = true;

        emit ServicePurchased(_id, _service.name, _service.price, _service.provider, msg.sender);
    }

    function authenticate() public {
        require(!authenticatedUsers[msg.sender], "User already authenticated");
        authenticatedUsers[msg.sender] = true;
        emit UserAuthenticated(msg.sender);
    }

    function isAuthenticated(address _user) public view returns (bool) {
        return authenticatedUsers[_user];
    }

    function getService(uint _id) public view returns (Service memory) {
        require(_id > 0 && _id <= serviceCount, "Service not found");
        return services[_id];
    }
}
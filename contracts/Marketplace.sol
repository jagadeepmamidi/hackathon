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
    }

    uint public serviceCount = 0;
    mapping(uint => Service) public services;
    mapping(address => bool) public authenticatedUsers; // New mapping for authenticated users

    event ServiceListed(
        uint id,
        string name,
        string description,
        uint price,
        address provider
    );

    event ServicePurchased(
        uint id,
        string name,
        uint price,
        address provider,
        address buyer
    );
    
    event UserAuthenticated(address user); // Event for user authentication

    // Provider lists a service/product
    function listService(string memory _name, string memory _description, uint _price) public {
        require(bytes(_name).length > 0, "Service name required");
        require(bytes(_description).length > 0, "Service description required");
        require(_price > 0, "Price must be greater than zero");

        serviceCount++;
        services[serviceCount] = Service(serviceCount, _name, _description, _price, payable(msg.sender), false);

        emit ServiceListed(serviceCount, _name, _description, _price, msg.sender);
    }

    // Patient purchases a service/product
    function purchaseService(uint _id) public payable {
        Service memory _service = services[_id];
        require(_service.id > 0 && _service.id <= serviceCount, "Service not found");
        require(msg.value == _service.price, "Incorrect payment amount");
        require(!_service.isPurchased, "Service already purchased");

        _service.provider.transfer(msg.value);  // Transfer funds to provider
        services[_id].isPurchased = true;  // Mark as purchased

        emit ServicePurchased(_id, _service.name, _service.price, _service.provider, msg.sender);
    }

    // New function to authenticate the user
    function authenticate() public {
        require(!authenticatedUsers[msg.sender], "User already authenticated");
        authenticatedUsers[msg.sender] = true;
        emit UserAuthenticated(msg.sender); // Emit event on successful authentication
    }

    // Function to check if the user is authenticated
    function isAuthenticated(address _user) public view returns (bool) {
        return authenticatedUsers[_user];
    }
}

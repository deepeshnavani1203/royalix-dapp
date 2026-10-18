// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RoyaliX {
    struct Royalty {
        address creator;
        uint256 totalRevenue;
        uint256 creatorShare;
        uint256 platformShare;
        bool active;
    }

    address public owner;
    uint256 public royaltyCount;
    mapping(uint256 => Royalty) public royalties;

    event RoyaltyCreated(
        uint256 indexed royaltyId,
        address indexed creator,
        uint256 creatorShare,
        uint256 platformShare
    );
    event RevenueAdded(uint256 indexed royaltyId, address indexed sender, uint256 amount);
    event RoyaltyDistributed(
        uint256 indexed royaltyId,
        uint256 creatorAmount,
        uint256 platformAmount
    );

    constructor() {
        owner = msg.sender;
    }

    function createRoyalty(
        uint256 creatorShare,
        uint256 platformShare
    ) external returns (uint256 royaltyId) {
        require(creatorShare <= 100 && platformShare <= 100, "Share cannot exceed 100");
        require(creatorShare + platformShare == 100, "Shares must total 100");

        royaltyId = royaltyCount;
        royalties[royaltyId] = Royalty({
            creator: msg.sender,
            totalRevenue: 0,
            creatorShare: creatorShare,
            platformShare: platformShare,
            active: true
        });
        royaltyCount += 1;

        emit RoyaltyCreated(royaltyId, msg.sender, creatorShare, platformShare);
    }

    function addRevenue(uint256 royaltyId) external payable {
        require(royaltyId < royaltyCount, "Invalid royalty");
        require(royalties[royaltyId].active, "Royalty is inactive");
        require(msg.value > 0, "Revenue must be greater than zero");

        royalties[royaltyId].totalRevenue += msg.value;
        emit RevenueAdded(royaltyId, msg.sender, msg.value);
    }

    function getRoyalty(
        uint256 royaltyId
    )
        external
        view
        returns (
            address creator,
            uint256 totalRevenue,
            uint256 creatorShare,
            uint256 platformShare,
            bool active
        )
    {
        require(royaltyId < royaltyCount, "Invalid royalty");
        Royalty storage royalty = royalties[royaltyId];
        return (
            royalty.creator,
            royalty.totalRevenue,
            royalty.creatorShare,
            royalty.platformShare,
            royalty.active
        );
    }

    function distributeRoyalty(uint256 royaltyId) external {
        require(royaltyId < royaltyCount, "Invalid royalty");
        Royalty storage royalty = royalties[royaltyId];
        require(royalty.active, "Royalty is inactive");

        uint256 revenue = royalty.totalRevenue;
        require(revenue > 0, "No revenue to distribute");

        uint256 creatorAmount = (revenue * royalty.creatorShare) / 100;
        uint256 platformAmount = revenue - creatorAmount;

        royalty.totalRevenue = 0;

        if (creatorAmount > 0) {
            (bool creatorPaid, ) = payable(royalty.creator).call{value: creatorAmount}("");
            require(creatorPaid, "Creator payout failed");
        }
        if (platformAmount > 0) {
            (bool platformPaid, ) = payable(owner).call{value: platformAmount}("");
            require(platformPaid, "Platform payout failed");
        }

        emit RoyaltyDistributed(royaltyId, creatorAmount, platformAmount);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

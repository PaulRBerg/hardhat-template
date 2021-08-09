// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// import "hardhat/console.sol";

/**
 * @dev {ERC721} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - owner can mint new pets
 *  - owner can set the price of pet
 *  - user can buy pet with ether
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract Petshop is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    // tokenId tracker using lib
    Counters.Counter private _tokenIdTracker;

    // baseURI for metadata
    string private _baseTokenURI;

    // Token prices
    mapping(uint256 => uint256) public tokenPrices;

    // Boolean values either pets are on sale or not
    mapping(uint256 => bool) public petsOnSale;

    event PetCreated(
        address indexed owner,
        uint256 tokenId,
        uint256 price,
        string tokenURI
    );

    event PetPurchase(
        address indexed prevOwner,
        address indexed newOwner,
        uint256 tokenId,
        uint256 price
    );

    event PetDeleted(uint256 tokenId);

    event PetPriceChanged(uint256 tokenId, uint256 prevPrice, uint256 newPrice);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;

        // start from tokenId 1
        _tokenIdTracker.increment();
    }

    receive() external payable {
        revert();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Creates a new token to 'to_'. Its token ID will be automatically
     * assigned (and available on the emitted {IERC721-Transfer} event), and the token
     * URI will be set
     *
     * @param to_ the address to which pet is minted to
     * @param price_ the price of the pet
     * @param tokenURI_ the token URI of the pet
     *
     * Requirements:
     *
     * - the caller must have be the owner of Petshop
     */
    function createPet(
        address to_,
        uint256 price_,
        string memory tokenURI_
    ) public virtual onlyOwner() returns (uint256) {
        uint256 tokenId_ = _tokenIdTracker.current();

        // mint pet
        _safeMint(to_, tokenId_);

        // set tokenURI of pet
        _setTokenURI(tokenId_, tokenURI_);

        // set the price of pet
        tokenPrices[tokenId_] = price_;

        // set onsale to true
        petsOnSale[tokenId_] = true;

        // increment the tokenId
        _tokenIdTracker.increment();

        // emit event
        emit PetCreated(to_, tokenId_, price_, tokenURI_);

        // new tokenId
        return tokenId_;
    }

    function deletePet(uint256 tokenId_) public virtual returns (uint256) {
        // burn tokenId
        _burn(tokenId_);

        // emit event
        emit PetDeleted(tokenId_);

        // deleted tokenId
        return tokenId_;
    }

    /**
     * @dev Anyone can buy pet by giving the amount of ether
     *
     * @param tokenId_ the tokenId to be bought
     *
     * Requirements:
     *
     * - the caller must provide ether price of pet
     */
    function buyPet(uint256 tokenId_) public payable returns (bool) {
        require(
            tokenId_ > 0 && _exists(tokenId_),
            "Petshop: tokenId not valid"
        );
        address prevOwner = ownerOf(tokenId_);
        require(
            msg.sender != owner() && msg.sender != prevOwner,
            "Petshop: Owner can't call"
        );
        require(
            msg.value >= tokenPrices[tokenId_],
            "Petshop: Provide valid price for pet"
        );

        // transfer funds to owner
        payable(prevOwner).transfer(msg.value);

        // transfer pet to new user (clears approvals too)
        _safeTransfer(
            prevOwner,
            msg.sender,
            tokenId_,
            "Petshop: user buying owner's pet"
        );

        emit PetPurchase(prevOwner, msg.sender, tokenId_, msg.value);

        // purchase successful
        return true;
    }

    /**
     * @dev Anyone can buy pet by giving the amount of ether
     *
     * @param tokenId_ the tokenId to be bought
     * @param price_ price value to be changed
     *
     * Requirements:
     *
     * - the caller must be the owner or isApproved of the pet
     */
    function changePetPrice(uint256 tokenId_, uint256 price_) public {
        require(
            tokenId_ > 0 && _exists(tokenId_),
            "Petshop: tokenId not valid"
        );
        require(
            _isApprovedOrOwner(_msgSender(), tokenId_),
            "ERC721: transfer caller is not owner nor approved"
        );

        // console.log("change token %s price to %s", tokenId_, price_);

        uint256 prevPrice_ = tokenPrices[tokenId_];
        tokenPrices[tokenId_] = price_;

        emit PetPriceChanged(tokenId_, prevPrice_, price_);
    }
}

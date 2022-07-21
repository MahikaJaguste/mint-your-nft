// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error Max_NFT_Limit_Reached();
error NFT_Not_Owned();

contract YourNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private constant MAX_TOKEN_LIMIT = 3000;

    constructor() ERC721("YourNFT", "YNFT") {}

    function mint(address to, string memory tokenURI) public {

        // mint only if limit not reached
        if(_tokenIds.current() == MAX_TOKEN_LIMIT){
            revert Max_NFT_Limit_Reached();
        }

        // tokenId should start from 1
        _tokenIds.increment();
        uint256 itemId = _tokenIds.current();

        // mint
        _mint(to, itemId);

        // set token URI to user's image choice
        _setTokenURI(itemId, tokenURI);
    }

    function updateTokenURI(uint256 tokenId, string memory tokenURI) public {
        // only holder of nft can change uri
        if(ownerOf(tokenId) != msg.sender){
            revert NFT_Not_Owned();
        }

        // update token URI to user's image choice
        _setTokenURI(tokenId, tokenURI);
    }
}
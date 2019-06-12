pragma solidity ^0.4.23;

import "./mvc.sol";
import "./kccToken.sol";

contract crowdFunding {
    kccToken kcc;
    mvcCrowd mvc;
    
    address public owner;
    uint public kccUint; // 1000kcc -> 100mvc
    uint public mvcUint;
    
    constructor(uint _kccUint, uint _mvcUint) public {
        kcc = new kccToken(21000000, msg.sender);
        mvc = new mvcCrowd(msg.sender, "yaoshen", 10000);
        kccUint = _kccUint;
        mvcUint = _mvcUint;
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require( msg.sender == owner);
        _;
    }
    
    function setAddr(address kccaddr, address mvcaddr) onlyOwner public {
        kcc = kccToken(kccaddr);
        mvc = mvcCrowd(mvcaddr);
    }
    
    function getAddress() view public returns(address _kcc, address _mvc) {
        _kcc = kcc.getAddress();
        _mvc = mvc.getAddress();
        return (_kcc, _mvc);
    }
}
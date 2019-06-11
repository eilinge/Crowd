pragma solidity ^0.4.23;

import "./mvc.sol";
import "./kccToken.sol";

// solidity 支持面向对象编程
contract crowdFunding {
    kccToken kcc;
    mvcCrowd mvc;
    
    address owner;
    uint public kccUint; // 1000kcc -> 100mvc
    uint public mvcUint;
    
    constructor(uint _kccUint, uint _mvcUint) public {
        kcc = new kccToken(21000000, msg.sender); // 构造
        mvc = new mvcCrowd(msg.sender, "yaoshen", 10000);
        kccUint = _kccUint;
        mvcUint = _mvcUint;
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require( msg.sender == owner );
        _;
    }
    
    // 重新获取新的合约地址, 完成合约升级
    function setAddr(address kccaddr, address mvcaddr) onlyOwner public {
        kcc = kccToken(kccaddr); // 合约地址加载
        mvc = mvcCrowd(mvcaddr);
    }
    // 生成合约地址, 将未部署的合约部署在该地址中, 完成合约间的调用
    function getAddress() view public returns(address _kcc, address _mvc) {
        _kcc = kcc.getAddress();
        _mvc = mvc.getAddress();
        return (_kcc, _mvc);
    }
}
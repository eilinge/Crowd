pragma solidity ^0.4.23;
import "./ERC20.sol";


contract kccToken is ERC20 {
    string public name = "kccb";
    string public symbol = "kcc";
    
    address public fundation;
    uint private _totalSupply;
    
    uint public totalAirDrop;
    
    mapping(address=>uint) _balance;
    mapping(address=>mapping(address=>uint)) _allowance; // 授权余额
    
    constructor(uint totalSupply, address _owner) public {
        _totalSupply = totalSupply;
        fundation = _owner;
        _balance[fundation] = totalSupply * 20 / 100;
    }
    
    function totalSupply() constant public returns (uint totalsupply) { // 获取总的发行量
        totalsupply = _totalSupply;
        return;
    }
    
    function airDrop(address _to, uint _value) public returns(bool success) {
        require( msg.sender == fundation);
        if (totalAirDrop + _value + _balance[fundation] > 0 && totalAirDrop + _value + _balance[fundation] <= _totalSupply && address(0) != _to) {
            _balance[_to] += _value;
            totalAirDrop += _value;
            return true;
        } else {
            return false;
        }
    }
    function balanceOf(address _owner) constant public returns (uint balance){ // 查询账户余额
        balance = _balance[_owner];
        return;
    }
    function transfer(address _to, uint _value) public returns(bool success){ // 发送Token到某个地址(转账)
        if (_balance[msg.sender] >= _value && _balance[_to]+_value > 0) {
            _balance[msg.sender] -= _value;
            _balance[_to] += _value;
            emit Transfer(msg.sender, _to, _value);
            return true;
        } else {
            return false;
        }
    }
    
    function transferFrom(address _from, address _to, uint _value) public returns (bool success){ // 从地址from 发送token到to地址
        // if (_balance[_from] >= _value && _balance[_to]+_value > 0 && address(0) != _to && _allowance[_from][_to] >= _value) {
            if ( _balance[_to]+_value > 0 && address(0) != _to && _allowance[_from][_to] >= _value) {
            // _balance[_from] -= _value;
            _balance[_to] += _value;
            _allowance[_from][_to] -= _value;
            emit Transfer(_from, _to, _value);
            return true;
        } else {
            return false;
        }

    }
    
    function approve(address _spender, uint _value) public returns(bool success){ // 允许_spender从你的账户转出token
        if (_balance[msg.sender] >= _value && address(0) != _spender) {
            _allowance[msg.sender][_spender] = _value;
            emit Approval(msg.sender, _spender, _value);
            return true;
        } else {
            return false;
        }
    }
    
    function allowance(address _owner, address _spender) constant public returns (uint remaining) { // 询允许spender转移的Token数量
        remaining = _allowance[_owner][_spender];
        return;
    }
    
    function getAddress() view public returns(address) {
        return address(this);
    }
    
}
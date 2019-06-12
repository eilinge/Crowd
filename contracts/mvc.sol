pragma solidity ^0.4.23;

contract mvcCrowd {
    string public desc;
    bool public isFinished;
    
    address public owner;
    uint public totalSupply;
    uint public totalCrowd;
    
    struct CrowdInfo {
        address _addr;
        uint _amount;
        uint _crowdTime;
    }
    
    uint16 public userCount;
    CrowdInfo[1000] public info;
    mapping(address=>uint16 ) public userId;
    
    event addCount(address _addr, uint _account);
    event onairDrop(address _addr, uint _acounnt);
    event onIsFinished();
    event onticketBooking();
    event onCrowInfo(address _owner, uint _value, uint _id);
    
    constructor(address _owner, string _desc, uint _total) public {
        desc = _desc;
        totalSupply = _total;
        owner = _owner;
        uint _amount = totalSupply*10/100;
        info[0] = CrowdInfo(owner, _amount, now);
        totalCrowd += info[0]._amount;
        // userid = info(num) = userCount--
        // userCount++ = 1
        // userId[_owner] = 0 ?
        userId[_owner] = userCount++;
        emit addCount(_owner, userId[_owner]);
    }
    // 将剩余的kccToken提取到其他账户, 并且加入到info数组中(不需要付出任何代价)
    // 2中token间的关系: 通过已有的kccToken, 替换成买票需要mvcToken
    function airDrop(address _to, uint _value) public returns (bool success) {
        require(!isFinished);
        require( msg.sender == owner);
        require( _to != msg.sender);
        if ( address(0) != _to && totalCrowd + _value > 0 && totalCrowd + _value <= totalSupply) {
            uint16 id = userId[_to];
            if ( id >0 && id < userCount ){
                // update
                info[id]._amount += _value;
                info[id]._crowdTime = now;
            } else {
                // insert
                id = userCount++;
                userId[_to] = id;
                info[id]._addr = _to;
                info[id]._amount = _value;
                info[id]._crowdTime = now;
            }
            assert (id < 1000);
            totalCrowd += _value;
            if ( totalCrowd == totalSupply) {
                isFinished = true;
                emit onIsFinished();
            }
            emit onairDrop(_to, userCount);
            return true;
        } else {
            return false;
        }
    }
    
    function CrowInfo(address _owner) view public returns (uint _amount, uint _crTime) {
        // userAddress -> userId -> info[userId]
        uint16 id = userId[_owner];
        // id=0: 未添加至userid的mapping中, 查询_owner不为owner
        if (id == 0 && _owner != owner) {
            return (0, 0)
        }
        _amount = info[id]._amount;
        _crTime = info[id]._crowdTime;
        emit onCrowInfo(_owner, _amount, _crTime);
        return (_amount, _crTime);
    }
    // 根据每个基金会会员的所占股份, 进行分成
    function ticketBooking() payable public returns (bool success) {
        require(isFinished);
        require(msg.value >= 100);
        for (uint i = 0; i < userCount; i++ ){
            info[i]._addr.transfer(msg.value * info[i]._amount / totalSupply);
        }
        emit onticketBooking();
        return true;
    }

    function contractBalance() view public returns(uint) {
        return address(this).balance;
    }
    
    function getAddress() view public returns(address) {
        return address(this);
    }
}
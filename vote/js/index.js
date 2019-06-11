$(function(){
   var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
   web3.eth.getAccounts(function (e, r) {
      console.log(e, r);
   });
   var contractAddr = "0xe3883a9499465c405c45878b804161f439f7f0c7";
   var instance = new web3.eth.Contract(crowAbi, contractAddr);
   var owner = "0xA401d7209196122DFAa9C83a492F92a257F6B2b5"; // ?
   var acctAddr;
   var kccInstance;
   var kccAddr;
   var mvcInstance;
   var mvcAddr;

   console.log(instance)
   $("#myModal").modal()
   // 登录
   $(".Login").on("click", function(){
      acctAddr = $("#addressId").val()
      console.log(acctAddr)
      $(".close_win").click()
   })
   // 充值
   $(".Recharge").on("click", function(){
      //1. 获得kcc合约地址
      
      instance.methods.getAddress().call(function(e, r){
         // console.log("recharge")
         if (!e) {
            kccAddr = r._kcc
            mvcAddr = r._mvc
            console.log(kccAddr, mvcAddr)

            //2. 获取kcc合约对象
            kccInstance = new web3.eth.Contract(kccAbi, kccAddr)
            //3. 调用kcc->airDrop方法
            kccInstance.methods.airDrop(acctAddr, 1000).send({
               from: owner,
               gas: 300000
            }, function (e, r) {
               if (!e) {
                  alert("Recharge success")
               } else {
                  alert("Recharge failed")
               }
            })
         } else {
            console.log("recharge failed", e)
         }
      })
   })
   // 投票
   $(".Vote").on("click", function(){
      //1. 构造mvc对象
      mvcInstance = new web3.eth.Contract(mvcAbi, mvcAddr)
      //2. 调用kcc转账给owner, 至少1000kcc
      kccInstance.methods.transfer(owner, 1000).send({ // ?
         from: acctAddr,
         gas: 300000
      }, function(e, r){
         if(!e) {
            alert("vote success")
            //3. 调用mvc的空投给acctAddr
            mvcInstance.methods.airDrop(acctAddr, 100).send({ // ?
               from: owner,
               gas: 300000
            }, function(e, r){
               if(!e) {
                  alert("airDrop success")
               } else {
                  alert("airDrop failed")
               }
            })
         } else {
            alert("vote failed", e)
         }
      })
      
   })
})
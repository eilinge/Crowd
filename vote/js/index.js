$(function(){
   var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
   web3.eth.getAccounts(function (e, r) {
      console.log(e, r);
   });
   var contractAddr = "0x8169aaa3bdb0cc90c371935b3da15ce12677bd0a";
   var instance = new web3.eth.Contract(crowdAbi, contractAddr);
   var owner;
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
      // console.log(acctAddr)
      instance.methods.owner().call(function (e, r) {
         if(!e) {
            owner = r
            console.log(owner)
            alert("welcome: "+ acctAddr)
            $(".close_win").click()
         } else {
            console.log("get owner failed: ", e)
         }
      })
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
            //3. 收取相应手续费
            var weiNum = $(".getWei").val()
            console.log(typeof (parseInt(weiNum)))
            kccInstance.methods.fee().send({
               from: acctAddr,
               value: parseInt(weiNum),
               gas: 3000000
            },function(e, r){
               if(!e){
                  console.log("fee success")
                  //4. 调用kcc->airDrop方法
                  console.log(parseInt(weiNum) * 100)
                  kccInstance.methods.airDrop(acctAddr, parseInt(weiNum) * 100).send({
                     from: owner,
                     gas: 3000000
                  }, function (e, r) {
                     if (!e) {
                        alert("Recharge success")
                     } else {
                        alert("Recharge failed: "+ e)
                     }
                  })
               } else {
                  console.log("fee failed", e)
               }
            })
         } else {
            console.log("recharge failed", e)
         }
      })
   })
   // 投票: 1000kcc转换成100mvc(众筹的份额)
   $(".Vote").on("click", function(){
      //1. 构造mvc对象
      mvcInstance = new web3.eth.Contract(mvcAbi, mvcAddr)
      //2. 调用kcc转账给owner, 至少1000kcc
      var kccNum = $(".getKccToken").val()
      kccInstance.methods.transfer(owner, kccNum).send({
         from: acctAddr,
         gas: 3000000
      }, function(e, r){
         if(!e) {
            // alert("vote success")
            //3. 调用mvc的空投给acctAddr, mvc: 众筹份额 100kcc = 1000mvc
            mvcInstance.methods.airDrop(acctAddr, kccNum / 10).send({
               from: owner,
               gas: 3000000
            }, function(e, r){
               if(!e) {
                  alert("vote success")
               } else {
                  alert("vote failed")
               }
            })
         } else {
            alert("vote failed", e)
         }
      })
      
   })
})
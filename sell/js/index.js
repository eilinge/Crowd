$(function () {
   var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
   web3.eth.getAccounts(function (e, r) {
      console.log(e, r);
   });
   var contractAddr = "0xd62ea51ab7f3e66322affef9cae2975c96ff9908";
   var instance = new web3.eth.Contract(crowdAbi, contractAddr);
   var owner;
   var acctAddr;
   var kccAddr;
   var mvcInstance;
   var mvcAddr;

   console.log(instance);
   $("#myModal").modal();
   // 登录
   $(".Login").on("click", function () {
      acctAddr = $("#addressId").val();
      // console.log(acctAddr)
      instance.methods.owner().call(function (e, r) {
         if (!e) {
            owner = r;
            console.log(owner);
            alert("welcome: " + acctAddr);
            $(".close_win").click();
         } else {
            console.log("get owner failed: ", e);
         }
      });
   });
   // 分账
   $(".Buy").on("click", function(){
      instance.methods.getAddress().call(function (e, r) {
      // console.log("recharge")
      if (!e) {
         kccAddr = r._kcc;
         mvcAddr = r._mvc;
         console.log(kccAddr, mvcAddr);

         //2. 获取mvc合约对象
         mvcInstance = new web3.eth.Contract(mvcAbi, mvcAddr);
         //3. 进行分成
         var expre2 = ".movie ul li.MoviePrice span";
         var te = $(expre2).text();
         var gre = /.*\:(\d\.\d\d).*/;
         var fares = gre.exec(te)[1];
         console.log(fares);
         mvcInstance.methods.ticketBooking().send({
            from: acctAddr,
            value: fares*1000000000000000000,
            gas: 3000000
         }, function (e, r) {
            if (!e) {
               alert("buy success");
            } else {
               alert("buy failed" + e);
            }
         });
      } else {
         console.log("getAddress failed", e);
      }
      });
   });
});
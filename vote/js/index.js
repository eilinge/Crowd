$(function(){
   var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
   web3.eth.getAccounts(function (e, r) {
      console.log(e, r);
   });
   var contractAddr = "0xd62ea51ab7f3e66322affef9cae2975c96ff9908";
   var instance = new web3.eth.Contract(crowdAbi, contractAddr);
   var owner;
   var acctAddr;
   var kccInstance;
   var kccAddr;
   var mvcInstance;
   var mvcAddr;

   var mvcRate;
   var mvcTotalSupply;
   var mvcCrowd;
   var kccBalance;

   console.log(instance);
   $("#myModal").modal();
   // 登录
   $(".Login").on("click", function(){
      acctAddr = $("#addressId").val();
      console.log(acctAddr);
      instance.methods.owner().call(function (e, r) {
         if(!e) {
            owner = r;
            console.log(owner);
            alert("welcome: "+ acctAddr);
            $(".close_win").click();
         } else {
            console.log("get owner failed: ", e);
         }
      });
   });
   // 充值
   $(".Recharge").on("click", function(){
      //1. 获得kcc合约地址
      instance.methods.getAddress().call(function(e, r){
         if (!e) {
            kccAddr = r._kcc;
            mvcAddr = r._mvc;
            console.log(kccAddr, mvcAddr);

            //2. 获取kcc合约对象
            kccInstance = new web3.eth.Contract(kccAbi, kccAddr);
            //3. 收取相应手续费
            var weiNum = $(".getWei").val();
            kccInstance.methods.fee().send({
               from: acctAddr,
               value: parseInt(weiNum),
               gas: 3000000
            },function(e, r){
               if(!e){
                  console.log("fee success");
                  //4. 调用kcc->airDrop方法
                  kccInstance.methods.airDrop(acctAddr, weiNum * 100).send({
                     from: owner,
                     gas: 3000000
                  }, function (e, r) {
                     if (!e) {
                        web3.eth.getBlockNumber(function(e, r){
                           if(!e){
                              var block = r;
                              console.log(block);
                              kccInstance.getPastEvents('allEvents', {
                                    filter: {},
                                    fromBlock: block,
                                    // toBlock: 'latest'
                                 }, function (error, events) {
                                    if (!error){
                                       if (events[0].event == "onAirDrop") {
                                          alert("Recharge success");
                                       } else {
                                          console.log("Recharge failed: " + error)
                                       }
                                    } else {
                                       console.log(error);
                                    }
                                 });
                           } else {
                              alert("Recharge failed: "+ e);
                           }
                        });
                     };
                     })
                  } else {
                     console.log("fee failed");
                  }
               });
            }
         });
   });
   // 投票: 1000kcc转换成100mvc(众筹的份额)
   $(".Vote").on("click", function(){
      //1. 构造mvc对象
      mvcInstance = new web3.eth.Contract(mvcAbi, mvcAddr);
      //2. 调用kcc转账给owner, 至少1000kcc
      var kccNum = $(".getKccToken").val();
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
                  web3.eth.getBlockNumber(function (e, r) {
                     if (!e) {
                        var block = r;
                        mvcInstance.getPastEvents('allEvents', {
                           filter: {},
                           fromBlock: block,
                           // toBlock: 'latest'
                        }, function (error, events) {
                           if (!error) {
                              console.log(events)
                              if (events[0].event == "onairDrop") {
                                 alert("vote success");
                              } else {
                                 console.log("vote failed: " + error)
                              }
                           } else {
                              console.log(error);
                           }
                        });
                     } else {
                        alert("Recharge failed: " + e);
                     }
                  });
               }
            });
         } else {
            alert("vote failed", e);
         }
      });
   });
   // refresh
   $(".Refresh").on("click", function () {
      $(".Account").children(":eq(1)").text(acctAddr);
      mvcInstance.methods.desc().call(function(e , Name){
         if(!e) {
            $(".MovieName").children(":eq(1)").text(Name);
         }
      });
      kccInstance.methods.balanceOf(acctAddr).call(function (e, balance) {
         if (!e) {
            kccBalance = balance;
            $(".KCC").children(":eq(1)").text(kccBalance);
         }
      });
      mvcInstance.methods.isFinished().call(function (e, istrue) {
         if (!e) {
            $(".Finish").children(":eq(1)").text(istrue);
         }
      });
      mvcInstance.methods.totalSupply().call(function(e, total){
         if(!e) {
            mvcTotalSupply = total;
            mvcInstance.methods.CrowInfo(acctAddr).call(function (e, bal) {
               if (!e) {
                  var crTime = bal._crTime;
                  mvcCrowd = bal._amount;
                  mvcRate = bal._amount / mvcTotalSupply * 100;
                  $(".MVC").children(":eq(1)").text(mvcCrowd);
                  $(".zhanbi").children(":eq(1)").text(mvcRate.toFixed(2) + "%");
                  $(".Time").children(":eq(1)").text(crTime);
                  mvcInstance.methods.totalCrowd().call(function(e, r){
                     if(!e) {
                        var sumRate = r / mvcTotalSupply * 100;
                        $(".sumRate").children(":eq(1)").text(sumRate.toFixed(2) + "%");
                     }
                  });
               }
            });
         }
      });
   });
});
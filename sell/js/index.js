$(function () {
   var web3 = new Web3(new Web3.providers.HttpProvider("http://loaclhost:8545"))
   web3.eth.getAccounts(function (e, r) {
      console.log(r)
   })
   var contractAddr = "0xa399aa8c4e881b1047d46697bcab584a252009b0";
   var instance = new web3.eth.Contract(crowdAbi, contractAddr);
   console.log("instance: ", instance)
})
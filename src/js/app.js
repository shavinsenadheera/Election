App = {
  web3Provider: null,
  contracts: {},
  account : "0x0",

  init: async function()
  {
    return await App.initWeb3();
  },

  initWeb3: async function()
  {
    if(typeof web3 != 'undefined')
    {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else
    {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("../Election.json", function(Election){
      App.contracts.Election = TruffleContract(Election);
      App.contracts.Election.setProvider(App.web3Provider);
    }).done(function(){
      App.getCandidates();
      App.getInfo();
      return App.bindEvents();
    });
  },

  addCandidate : async function(name)
  {
    let instance = await App.contracts.Election.deployed();
    instance.addCandidate(name, { from:App.accounts }).then(function(){
      alert("Add a person!");
    });
  }
  ,

  getCandidates : async function()
  {
    let instance = await App.contracts.Election.deployed();
    var count = await instance.getCandidateCount();
    if(parseInt(count)!=0)
    {
      for (var i = 0; i < count; i++)
      {
        var candidate = await instance.getCandidate(i);
        document.getElementById('getData').innerHTML += "<tr><td>" + candidate[0] + "</td><td>" + candidate[1] + "</td><td>" + candidate[2] + "</td></tr>";
      }
    }
    else
    {
      document.getElementById('getData').innerHTML += "<tr><td>No Data</td><td>No Data</td><td>No Data</td></tr>";
    }
  }
  ,

  vote: async function()
  {
    var _id = document.getElementById('voteFor').value;
    if(_id!="") {
      let instance = await App.contracts.Election.deployed();
      await instance.voting(_id, {from: App.accounts}).then(function () {
        document.getElementById('getData').innerHTML = "";
        App.getCandidates();
        App.getInfo();
      });
    }
    else
    {
      alert("Vote for someone");
    }
  }
  ,

  getInfo : async function()
  {
    let instance = await App.contracts.Election.deployed();
    var _totCandidates = await instance.getCandidateCount();
    var _totVotes = await instance.getTotVotes();
    document.getElementById('voteCount').innerHTML = "<span class='text-danger'><i class='fas fa-users'></i> Total Candidates : "+ _totCandidates +" | <i class='fas fa-vote-yea'></i> Total Votes : "+_totVotes+ " | <i class='fas fa-user'></i> User Address : "+ App.accounts +"</span>";
  }

  ,

  bindEvents: function() {

    web3.eth.getCoinbase(function(err, account){
      if(err==null){
        App.accounts = account;
      }
    });

  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

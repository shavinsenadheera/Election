App = {
  web3Provider: null,
  contracts: {},
  account : "0x0",
  candidateCount:0,

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

  addCandidate : async function()
  {
      var _name = document.getElementById('candidateName').value;
      if(_name==="")
      {
        alert("Enter candidate name");
      }
      else
      {
        let instance = await App.contracts.Election.deployed();
        await instance.addCandidate(_name, {from: App.accounts}).then(function () {
          App.getCandidates();
          App.getInfo();
        });
      }
  }
  ,

  getCandidates : async function()
  {
    let instance = await App.contracts.Election.deployed();
    var count = await instance.getCandidateCount();
    document.getElementById('getData').innerHTML = "";
    var _totCandidates=0;
    if(parseInt(count)!==0)
    {
      for (var i = 0; i < count; i++)
      {
        var candidate = await instance.getCandidate(i);
        if(parseInt(candidate[0])!==0)
        {
          document.getElementById('getData').innerHTML += "<tr><td>" + candidate[0] + "</td><td>" + candidate[1] + "</td><td>" + candidate[2] + "</td></tr>";
          _totCandidates++;
        }
      }
      document.getElementById('totCandidate').innerHTML = "<span class='text-danger'><i class='fas fa-users'></i> Total Candidates : "+ _totCandidates +"</span>";

    }
    else
    {
      document.getElementById('getData').innerHTML += "<tr><td>No Data</td><td>No Data</td><td>No Data</td></tr>";
    }
  }
  ,

  destroyCandidate : async function()
  {
    var _id = document.getElementById('candidateID').value;

    if(_id==="")
    {
      alert("Enter candidate id");
    }
    else
    {

      let instance = await App.contracts.Election.deployed();
      await instance.destroyCandidate(parseInt(_id), {from: App.accounts}).then(function () {
        App.getCandidates();
        App.getInfo();
      });
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
    document.getElementById('totVotes').innerHTML = "<span class='text-warning'><i class='fas fa-vote-yea'></i> Total Votes : "+_totVotes+ "</span>";
    document.getElementById('accountNo').innerHTML = "<span class='text-success'><i class='fas fa-user'></i> "+ App.accounts +"</span>";
    if(App.accounts==='0xc1ccf8d544a8c5a1eaeafe19e1cc9a43387a07ef') {
       document.getElementById("adminSection").style.display = "block";
    }
    else
    {
       document.getElementById("adminSection").style.display="none";
    }
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

    if(window.location.href==="http://localhost:3000/admin" || window.location.href==="http://localhost:3000/ui/admin/index.html"){
        var _pwd = prompt("Enter the password: ");
        if(_pwd==="1998#@shavind") {
            return window.location = "http://localhost:3000/ui/admin/index.html";
        }
    }

  $(window).load(function() {
    App.init();

  });
});

const {Election,Vote}=require("../models/Election.js");
const moment=require("moment");


module.exports.renderNewElectionForm=(req,res)=>{
    res.render("election/createElection.ejs");
};


module.exports.createElection=async (req, res) => {
    const { title, description, options } = req.body;
    const createdBy = {
      id: req.user._id,
      username: req.user.username
  };
    const newElection = new Election({
        title,
        description,
        options,
        createdBy
    });
    await newElection.save();
    req.flash('success', 'Election created successfully');
    res.redirect('/');
};

module.exports.renderEditForm=async(req,res)=>{
    const election = await Election.findById(req.params.id);
    if (election.createdBy.id.equals(req.user._id))
      {
        return res.render("election/edit.ejs",{election});
      }
      else{
        req.flash('error', "you don't have permission to edit this election");
        return res.redirect('/');
      }
  };

module.exports.UpdateElection=async (req, res) => {
    let{title,description,options}=req.body;
    let{id}=req.params;
    let election=await Election.findById(id).populate("votes");
    if (!election) {
      req.flash('error', 'Election not found.');
      return res.redirect('/');
  }
  if (election.createdBy.id.equals(req.user._id))
    {
      await Vote.deleteMany({ _id: { $in: election.votes } });
      election.title = title;
      election.description = description;
      election.options = options;
      election.votes = []; 
      election.createdAt=new Date();
      await election.save();
      req.flash('success', 'Election updated successfully and previous votes were deleted.');
      res.redirect("/");
    }
    else{
      req.flash('error', "you don't have permission to edit this election");
        return res.redirect('/');
  
    }
};

module.exports.deleteElection=async(req,res)=>{
    const election = await Election.findById(req.params.id).populate("votes");
    if (!election) {
      req.flash('error', 'Election not found.');
      return res.redirect('/');
  }
  if (election.createdBy.id.equals(req.user._id))
    {
    await Vote.deleteMany({ _id: { $in: election.votes } });
    await Election.deleteMany({ _id: { $in: election} });
    req.flash('success', "Election deleted successfully!");
    res.redirect("/");
  
    }
    else{
      req.flash('error', "you don't have permission to edit this election");
      return res.redirect('/');
    }
    
  };

  module.exports.getVoteForm=async (req, res) => {
    const election = await Election.findById(req.params.id);
    if (!election) {
        req.flash('error', 'Election not found.');
        return res.redirect("/");
    }
    const voteCounts = {};
    election.options.forEach(option => {
        voteCounts[option] = election.votes.filter(vote => vote.selectedOption === option).length;
  
    });
    const createdat=moment(election.createdAt).format('MMMM Do YYYY, h:mm:ss a')
    res.render('election/vote.ejs', { election, voteCounts,createdat });
  };

  
module.exports.addVote=async (req, res) => {
    const { selectedOption } = req.body;
    const election = await Election.findById(req.params.id);
  
    if (!election) {
      req.flash('error', 'Election not found.');
      return res.redirect(res.locals.redirectUrl);
  }
    const existingVote = await Vote.findOne({ user: req.user._id, election: req.params.id });
    if (existingVote) {
        req.flash('error', 'You have already voted in this election.check for result!');
        return res.redirect(`/elec/vote/${req.params.id}`);
    }
  
    // Create a new vote
    const newVote = new Vote({
        user: req.user._id,
        election: req.params.id,
        selectedOption
    });
    election.votes.push(newVote);
    await newVote.save();
    await election.save();
    req.flash('success', 'Your vote has been cast successfully.');
    res.redirect(`/elec/vote/${req.params.id}`);
  };


module.exports.result=async (req, res) => {
    const election = await Election.findById(req.params.id).populate('votes');
  
    if (!election) {
        req.flash('error', 'Election not found.');
        return res.redirect('/');
    }
  
    // Calculate the number of votes for each option
    const voteCounts = {};
    election.options.forEach(option => {
        voteCounts[option] = election.votes.filter(vote => vote.selectedOption === option).length;
    });
  
    res.render('election/results.ejs', { election, voteCounts });
  };
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, saveRedirectUrl}=require("../middleware/auth.js");
const {validateElection,validateVote}=require("../middleware/validate.js");
const electionController=require("../controllers/electionController.js")


//create election
router.route("/createElection")
.get(isLoggedIn,(electionController.renderNewElectionForm))
.post(validateElection, wrapAsync(electionController.createElection));

//edit form and updateElection
router.route("/edit/:id")
.get(isLoggedIn,wrapAsync(electionController.renderEditForm))
.put(isLoggedIn,validateElection, wrapAsync(electionController.UpdateElection));

//delete election
router.route("/delete/:id")
.delete(isLoggedIn,wrapAsync(electionController.deleteElection));

// get vote form and Handle Vote Form Submission
router.route('/vote/:id')
.get(isLoggedIn, wrapAsync(electionController.getVoteForm))
.post(isLoggedIn,validateVote,wrapAsync(electionController.addVote));

//result
router.route('/result/:id')
.get(isLoggedIn, wrapAsync(electionController.result));

module.exports=router;

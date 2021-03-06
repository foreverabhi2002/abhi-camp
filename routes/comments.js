const express    = require("express"),
      router     = express.Router({mergeParams:true}),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn,function(req,res)
{
    //Find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id,function(err,campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new",{campground:campground});
        }
    });
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req,res)
{
    //look campgrounds using id
    Campground.findById(req.params.id,function(err,campground)
    {
        if(err)
        {
            console.log(err);
            redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment)
            {
                if(err)
                {
                    req.flash("error","Something Went Wrong")
                    console.log(err);
                }
                else
                {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comments to campground
                    //redirect camgrounds show page
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success","Successfully Added Comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res)
{
    Comment.findById(req.params.comment_id,function(err,foundComment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","Successfully Updated Comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res)
{
    //findbyidandremove
    Comment.findByIdAndRemove(req.params.comment_id,function(err)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","Successfully Destroyed Comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router; 
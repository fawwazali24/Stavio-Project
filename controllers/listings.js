const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const { category } = req.query;

    let listings;
    if (category) {
        listings = await Listing.find({ category });
    } else {
        listings = await Listing.find({});
    }

    res.render("listings/index.ejs", { listings, category });
};

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing  = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    };
    //console.log(listing);
    res.render("listings/show.ejs" , {listing});
};

module.exports.createListing = async (req,res, next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        //console.log(url,",,",filename);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    };

module.exports.renderEditform = async (req,res) => { 
    let {id} = req.params;
    const listing  = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    //console.log(originalImageUrl);
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req,res) => {
        let {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        
        if(typeof req.file!= "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image= {url,filename};
            await listing.save();
        }

        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    };

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedLisitng);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchListing = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.redirect("/listings"); // or render all listings
  }

  // Case-insensitive search in title and description
  const regex = new RegExp(query, 'i');
  const listings = await Listing.find({
    $or: [
      { title: regex },
      { description: regex },
      { location: regex },
      { country : regex },
      { category: regex }
    ]
  });

  res.render("listings/search.ejs", { listings, searchQuery: query });
};

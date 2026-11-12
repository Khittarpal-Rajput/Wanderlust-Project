// const Listing = require("../models/listing.js");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.renderNewForm = (req, res) => {
//   res.render("listings/new.ejs");
// };

// module.exports.showListing = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id)
//   .populate({
//     path: "reviews", 
//     populate: {
//       path: "author",
//     },
//   })
//   .populate("owner");
//   if(!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     res.redirect("/listings");
//   }
//   console.log(listing);
//   res.render("listings/show.ejs", { listing });
// };

// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;
  
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = {url, filename};
//     await newListing.save(); 
//     req.flash("success", "New Listing Created");
//     res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   if(!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     res.redirect("/listings");
//   }
//   let OriginalImageUrl = listing.image.url;
//   OriginalImageUrl = OriginalImageUrl.replace("/upload", "/upload/w_250");
//   res.render("listings/edit.ejs", { listing, OriginalImageUrl });
// };

// module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if(typeof req.file !== "undefined") {
//   let url = req.file.path;
//   let filename = req.file.filename;
//   listing.image = {url, filename};
//   await listing.save();
//   }
//   req.flash("success", "Listing Updated");
//   res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   req.flash("success", "Listing Deleted");
//   res.redirect("/listings");
// };





const Listing = require("../models/listing.js");

// All Listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// New Listing Form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show Individual Listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Create Listing
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

// Edit Form
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    let OriginalImageUrl = listing.image?.url || "";

    if (OriginalImageUrl) {
        OriginalImageUrl = OriginalImageUrl.replace(
            "/upload",
            "/upload/w_250"
        );
    }

    res.render("listings/edit.ejs", {
        listing,
        OriginalImageUrl
    });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};

// All Listings Map
module.exports.map = async (req, res) => {
    const listings = await Listing.find({
        latitude: { $type: "number" },
        longitude: { $type: "number" }
    });

    const mapListings = listings
        .filter(listing =>
            Number.isFinite(listing.latitude) &&
            Number.isFinite(listing.longitude) &&
            listing.latitude >= -90 &&
            listing.latitude <= 90 &&
            listing.longitude >= -180 &&
            listing.longitude <= 180
        )
        .map(listing => ({
            id: listing._id.toString(),
            title: listing.title,
            location: listing.location,
            country: listing.country,
            latitude: listing.latitude,
            longitude: listing.longitude,
            price: listing.price,
            image: listing.image?.url || ""
        }));

    const mapListingsJson = JSON.stringify(mapListings)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

    res.render("maps/index.ejs", {
        mapListingsJson
    });
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({ // This is a subdocument schema.
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function () { // This is a virtual property.
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } }; // This is an option that we will pass into our schema.

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"], // "location.type" must be "Point".
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: { // This is an object that contains the user's _id and username.
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [ // This is an array of review IDs.
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () { // This is a virtual property.
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) { // This is a mongoose middleware function that runs after a campground is deleted.
    if (doc) { // If a campground was deleted, then doc will be defined.
        await Review.deleteMany({ // Delete all reviews whose _id is in the campground's reviews array.
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
// Path: models\index.js
// This file is used to export all of our models.
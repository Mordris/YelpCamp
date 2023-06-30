const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");


mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "64986777ecc925364fe04da2",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            description: "Lorem ipsum dolor sit amet conse ctetur adipisicing elit",
            price,
            images: [
                {
                    url: "https://res.cloudinary.com/dttm5spoc/image/upload/v1687799435/YelpCamp/ujinyidvtww05mpmtw6s.jpg",
                    filename: "YelpCamp/ujinyidvtww05mpmtw6s"
                },
                {
                    url: "https://res.cloudinary.com/dttm5spoc/image/upload/v1687799434/YelpCamp/bqwnxtfnqje8rc4y9puh.jpg",
                    filename: "YelpCamp/bqwnxtfnqje8rc4y9puh"
                }
            ],


        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
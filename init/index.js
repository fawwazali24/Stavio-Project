const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing  = require("../models/listing.js");
const MongoStore = require("connect-mongo");

const dbUrl = ""; //not required after initialisation

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err) =>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const categories = [
    "Cities",
    "Mountains",
    "Beaches",
    "Pools",
    "Farms",
    "Resorts",
    "Forests",
    "Heritage",
    "Arctic",
    "Premium",
    "Others"
];

const initDB = async () => {
    await Listing.deleteMany({});

    initdata.data = initdata.data.map((obj) => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        return {
            ...obj,
            owner: "6867d5a84b2b5df77574cab8",
            category: randomCategory
        };
    });

    await Listing.insertMany(initdata.data);
    console.log("Data was initialised");
};

initDB();

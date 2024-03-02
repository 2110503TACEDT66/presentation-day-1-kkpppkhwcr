const mongoose = require("mongoose")
const {timeRegex,invalidTimeMsg} = require("../config/constants")
const PeriodSubSchema = require("./Period")
const Reservation = require("./Reservation")
const Restaurant = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        unique: true,
        minLength: 1
    },
    address:{
        type: String,
        unique: true,
        required:true
    },
    menu:{
        type: [String]
    },
    openingHours:{
        type: String,
        match: [timeRegex,invalidTimeMsg]
    },
    closingHours:{
        type: String,
        match: [timeRegex,invalidTimeMsg]
    },
    availableReservationPeriod:{
        type: [PeriodSubSchema],
        minLength:1
    }
})
Restaurant.pre("deleteOne",{document:true, query:false},async function(next){
    const result = await Reservation.deleteMany({
        restaurantId: this._id
    });
    next()
})
Restaurant.virtual("reservations",{
    ref:"Reservation",
    localField:"_id",
    foreignField:"restaurantId",
    justOne:false
})
module.exports=mongoose.model("Restaurant",Restaurant)
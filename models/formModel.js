 const mongoose = require('mongoose');
 var Schema = mongoose.Schema;

const formSchema = new mongoose.Schema(
    {
        answer: [{ response:Schema.Types.Mixed, date: Date }],
        text : {type:String},
        type : {type:String, required: true},
        multiple:{
         first: {type:String},
         second: {type:String},
         third : {type:String},
        },
        owner : {type :Schema.Types.ObjectId, ref: "User", required : true},
    },
);
module.exports = mongoose.model('Forms', formSchema);

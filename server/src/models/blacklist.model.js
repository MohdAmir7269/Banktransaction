const mongoose =require('mongoose')




const tokenBlackListschema =new mongoose.Schema({
    token:{
        type:String,
        require:[true, "Token is required to blacklist"],
        unique:[true, "token is already balcklisted"]
    }
},{
    timestamps :true
})

tokenBlackListschema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3 //3 days
});

const tokenBlackListModel =mongoose.model("tokenBlackList",tokenBlackListschema);

module.exports=tokenBlackListModel;
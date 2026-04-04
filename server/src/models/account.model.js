
// const mongoose = require("mongoose");
// const ledgerModel = require("./ladger.model");

// const accountSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//         required: [true, "Account must be associated with a user"],
//         balance: { type: Number, default: 1000 }, // ✅ Initial balance set to 1000
//         index: true
//     },
//     status: {
//         type: String,
//         enum: {
//             values: ["ACTIVE", "FROZEN", "CLOSED"],
//             message: "status can be either ACTIVE, FROZEN or CLOSED"
//         },
//         default: "ACTIVE"
//     },
//     currency: {
//         type: String,
//         required: [true, "Currency is required for creating an account"],
//         default: "INR"
//     },
//       balance: {                 // ✅ YE MISSING THA
//         type: Number,
//         default: 1000
//     }
// }, {
//     timestamps: true
// });

// accountSchema.index({ user: 1, status: 1 });

// accountSchema.methods.getBalance = async function () {
//     const balanceData = await ledgerModel.aggregate([
//         { $match: { account: this._id } },
//         {
//             $group: {
//                 _id: null,
//                 totalDebit: {
//                     $sum: {
//                         $cond: [
//                             { $eq: ["$type", "DEBIT"] }, // ✅ comma added
//                             "$amount",
//                             0
//                         ]
//                     }
//                 },
//                 totalCredit: {                           // ✅ fixed typo
//                     $sum: {
//                         $cond: [
//                             { $eq: ["$type", "CREDIT"] }, // ✅ comma added
//                             "$amount",
//                             0
//                         ]
//                     }
//                 }
//             }
//         },
//         {
//         $project: {
//             _id: 0,
//             balance:{
//                 $subtract: ["$totalCredit","$totalDebit"]
//             }
//         }
//         }
//     ]);

//     if(balanceData.length ===0){
//         return 0
//     }
//     return balanceData [0].balance

//     const result = balanceData[0] ?? { totalDebit: 0, totalCredit: 0 };
//     return result.totalCredit - result.totalDebit; // ✅ actually returns the balance
// };

// const accountModel = mongoose.model("account", accountSchema);

// module.exports = accountModel;



const mongoose = require("mongoose");
const ledgerModel = require("./ladger.model"); // Spelling check: ladger vs ledger

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "FROZEN", "CLOSED"],
        default: "ACTIVE"
    },
    currency: {
        type: String,
        default: "INR"
    },
    balance: {
        type: Number,
        default: 1000 // Initial Signup Bonus
    }
}, {
    timestamps: true
});

// Indexing for performance
accountSchema.index({ user: 1, status: 1 });

// ✅ Improved getBalance Method
accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0]
                    }
                }
            }
        }
    ]);

    // Agar ledger khali hai, toh current balance return karein (default wala)
    if (balanceData.length === 0) {
        return this.balance;
    }

    const { totalCredit, totalDebit } = balanceData[0];
    
    // Note: Agar aapne starting 1000 ledger mein nahi dale hain, 
    // toh logic balance check karne ka change karna padega.
    return totalCredit - totalDebit;
};

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://chaitanyakhairmodedelxn_db_user:root%40123@cluster0.2muyghy.mongodb.net/?appName=Cluster0";

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");
        
        const phone = "8421121743";
        const variations = [phone, "+91" + phone, "91" + phone];
        
        // Use a generic schema since we just want to see the data
        const CustomerSchema = new mongoose.Schema({}, { strict: false, collection: 'customers' });
        const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
        
        const customer = await Customer.findOne({ phone: { $in: variations } }).lean();
        console.log("CUSTOMER_RESULT:", JSON.stringify(customer, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err);
        process.exit(1);
    }
}

check();

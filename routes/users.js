const express = require("express");

const {users} = require("../data/users.json");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: users,
        
    })
})

router.get("/:id", (req,res)=>{
    const {id} =req.params;
    const user= users.find((each)=> each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found"
        })
    }
    return res.status(200).json({
        success:true,
        data: user
    });
})

router.post("/", (req, res) => {
    const {id, name, surname, email, subscriptionType, subscriptionDate} =
        req.body;
    const user= users.find((each)=> each.id === id);
    if ( user) {
        return res.status(404).json({
            success: false,
            message: "user exist with that id"
        })
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    })
    return res.status(200).json({
        success:true,
        data: users
    });
})

router.put("/:id", (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;
    const user= users.find((each)=> each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found"
        })
    }

    const updatedUser = users.map((each)=>{
        if(each.id === id){
            return {
                ...each,
                ...data

            };
        }

        return each;
    })
    return res.status(200).json({
        success:true,
        data: updatedUser
    });
})

router.delete("/:id", (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;
    const user= users.find((each)=> each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found"
        })
    }

    const index = users.indexOf(user);
    users.splice(index, 1);
    return res.status(202).json({success: true, data: users});
})

router.get("/subsciption-details/:id", (req,res)=>{
    const {id} =req.params;
    const user= users.find((each)=> each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found"
        })
    }

    const getDateInDays = (data = "") =>{

        let date;
        if(data === ""){
            date = new Date(); //current date
        } else{
            data =new Date(data); //getting date on basis of data variable
        }

        let days = Math.floor(data / (1000 * 60 * 60 * 24));
        return days;

    }

    const subscriptionType = (date) => {

        if(user.subscriptionType === "Basic"){
            date = date + 90;
        }
        else if(user.subscriptionType === "Standard")
        {
            date = date + 180;
        }
        else if(user.subscriptionType === "Premium")
        {
            date = date + 365;
        }

        return date;



    } 
    // Subscrption expiration calculation
    // Januray 1, 1970, UTC //milliseconds

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysleftforExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration-currentDate,
        fine: 
        returnDate < currentDate ?
            subscriptionExpiration<=currentDate ? 200 : 100
        :0,
    };
    return res.status(200).json({
        success:true,
        data,
    });
})



module.exports = router;
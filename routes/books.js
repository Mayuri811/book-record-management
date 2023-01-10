const express = require("express");

const {users} = require("../data/users.json");
const {books} = require("../data/books.json");

const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200).json({sucess:true, data:books});
})

router.get('/:id', (req,res)=>{
    const {id} =req.params;
    const book= books.find((each)=> each.id === id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "book not found"
        })
    }
    return res.status(200).json({
        success:true,
        data: book
    });
    
})

router.get('/issued/books', (req,res)=>{
    
    const userswithIssuedbooks= users.filter((each)=> 
    {
        if(each.issuedBook) return each;
    });

    const issuedbooks = [];

    userswithIssuedbooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook)

        book.issuedby = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedbooks.push(book);
        
    });
    if (issuedbooks.length==0) {
        return res.status(404).json({
            success: false,
            message: "no book found"
        })
    }

    return res.status(200).json({
        success:true,
        data: issuedbooks
    });
    
})

router.post("/", (req, res)=>{
    const {data} = req.body;

    if(!data) {
        
        return res.status(404).json({
        success: false,
        message: "no data provided"
    })
    

    }
    const book= books.find((each)=> each.id === data.id);
    if (book) {
        return res.status(404).json({
            success: false,
            message: "Book already exists with this id, please use a unique id"
        })
    }

    const allBooks =[...books, data];
    return res.status(200).json({
        success:true,
        data: allBooks
    });
    
})

router.put('/:id', (req,res)=>{
    const {id} =req.params;
    
    const {data} = req.body;
    const book= books.find((each)=> each.id === id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "book not found"
        })
    }

    const updatedBooks = books.map((each)=>{
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
        data: updatedBooks

    });
    
})







module.exports = router
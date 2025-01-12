const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors({
    origin:["https://next-new-1.vercel.app"]
}))

try{
    mongoose.connect("mongodb+srv://arjuntudu9163:fv9FIKG1eb8UKcee@cluster0.cq6wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}catch(e){
    console.log(e)
}

const Admin = mongoose.model("people2",{
     
    username:String,
    password:String,
    tables:[]

})

const Table = mongoose.model("table",{
    admin:String,
    name:String,
    date:String,
    time:String,
    number_of_guests:Number,
    contacts_of_guests:[]

})

app.post("/reservation_create",async(req,res)=>{
     
    console.log(req.body);
    const adminId = req.body.admin

    try{
        const response = await Table.create(req.body);
        console.log(response,"<========== table creation response")

        const response2 = await Admin.find({_id:adminId})
        const table_list = response2[0].tables
        const new_table_list = [...table_list,response]
        console.log(new_table_list)
        const response3 = await Admin.findOneAndUpdate({_id:adminId},{$set:{
            tables:new_table_list
        }})
        console.log(response3)
    
    }catch(e){
        console.log(e)
    }
})

app.get("/get_tables",async(req,res)=>{
    
    try{
        const response = await Table.find({})
        
        res.json(response)
    }catch(e){
        if(e){
            console.log(e)
        }
    }

})

app.get("/get_table_object",async(req,res)=>{
    const id = req.body.id
    try{
        const response = await Table.find({_id:id})
        console.log(response)
        res.json(response[0])
    }catch(e){
        if(e){
            console.log(e)
        }
    }

})

app.post("/searchTable",async(req,res)=>{
    
    const starting = parseInt(req.body.starting.split(":").join(""))
    const ending =  parseInt(req.body.ending.split(":").join(""))
    
    const starting_1 = req.body.starting.split(":")[0]
    const starting_2 = req.body.starting.split(":")[1]

    const ending_1 = req.body.ending.split(":")[0]
    const ending_2 = req.body.ending.split(":")[1]

    let time_1_1 ;
    let time_1_2 ;

    let ending_1_1;
    let ending_1_2;

    if(starting_1>12){
        time_1_1 = starting_1-12
    }else if(starting_1<12){
        time_1_1 = starting_1
    }
    
    if(ending_1>12){
        ending_1_1 = ending_1-12
    }else if(ending_1<12){
        ending_1_1 = ending_1
    }


    console.log(time_1_1,ending_1_1)
    try{
       
        const response = await Table.find({}) 
        const all_time = []
        const result = []

        response.map((x)=>{
            const time = parseInt(x.time.split(":")[0])
            if(time>12){
                all_time.push({
                    id:x,
                    time:time
                })
            }
            if(time<=12){
                all_time.push({
                    id:x,
                    time:time
                })
            }
            
        })

        console.log(all_time)
        
        

        all_time.map((x)=>{
            
            if(x.time>=starting_1 && x.time<=ending_1){
                console.log(time_1_1,"=",ending_1_1,"-",x.time)
                result.push(x.id)
            }

        })

        const new_result = []
        result.map((x)=>{
            new_result.push(x)
        })

        res.json(new_result)




    }catch(e){}

})

app.post("/registerAdmin",async(req,res)=>{
     
    const username = req.body.username 
    const password = req.body.password 
    const re_password = req.body.password

    console.log(username,password , "< ===== register details" )

    try{
          
         if(password === re_password){
             
            const response = await Admin.create({username:username,password:password})
            console.log(response)
            res.json(response)
         }

    }catch(e){}
 
})

app.post("/loginAdmin",async(req,res)=>{ 
      
    console.log(req.body, "===== login request")
    const username = req.body.username  
    const password = req.body.password

    try{
        
        const response = await Admin.find({username:username,password:password})
        console.log(response)
        res.json(response)

    }catch(e){}

})

app.post("/getAdminTables",async(req,res)=>{
     
    const id = req.body.id 

    try{
         const response = await Admin.find({_id:id})
         const tables = response[0].tables
         res.json(tables)
    }catch(e){

    }

})



app.post("/add_name",async(req,res)=>{
     
    const id = req.body.id 
    const name = req.body.name

    console.log(id,name)

     try{
        const response = await Table.find({_id:id}) 
        
        const list = response[0].contacts_of_guests
      
        const new_list = [...list,name]
      
        const update = await Table.findOneAndUpdate({_id:id},{$set:{contacts_of_guests:new_list}})
       
        res.json(update)
     }catch(e){

     }
})



app.get("/",async (req,res)=>{
     
    res.json("started")

})

app.listen(5000)

const express=require('express')
const users=require('./MOCK_DATA.json')
const fs=require('fs')
const mongoose=require('mongoose')


const app=express()
const port=8000




app.use(express.urlencoded({extended:false}))

app.get('/api' ,(req,res)=>{
res.setHeader('X-Application','Anything')
    return res.json(users)
}
)

app.get('/api/users',(req,res)=>{

    const html=`
    <ul>
    ${users.map((users)=>`<li> ${users.first_name}`).join('')}

    </ul>
    `
    res.send(html)
})

app.get('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id)
    const user=users.find((user)=>user.id===id)
   if(!user) return res.status(404).json({error:'User Not Found '})
    return res.json(user)


})


app.post("/api/users",(req,res)=>{
    
    const body=req.body;
    if(!body || !body.first_name ||!body.last_name ||!body.gender||!body.email||!body.brand){
        return res.status(400).json({error:'All Fieldsare must required'})
    }
    users.push({...body,id:users.length+1})
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.status(201).json({status:"succesful",id:users.length})
    })

})
app.listen(port,()=>console.log(`New server Created:${port}`))



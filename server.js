const express=require('express'),fs=require('fs'),path=require('path'),F=path.join(__dirname,'orders.json'),app=express();
const rd=()=>{try{return JSON.parse(fs.readFileSync(F))}catch{return[]}};
app.use(express.json());app.use(express.static(__dirname));
app.post('/api/orders',(q,s)=>{const o={id:'LP'+Date.now(),...q.body,status:'placed',createdAt:new Date().toISOString()},a=rd();a.push(o);fs.writeFileSync(F,JSON.stringify(a,null,2));s.status(201).json(o)});
app.get('/api/orders/:id',(q,s)=>{const o=rd().find(x=>x.id===q.params.id);o?s.json(o):s.status(404).json({error:'not found'})});
app.get('/api/orders',(q,s)=>s.json(rd()));
app.listen(process.env.PORT||3000,()=>console.log('La Perlyn running on http://localhost:3000'));


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodeParser=bodyParser.urlencoded({extended:false})

const MongoControl = require('./databasecontrol').MongoControl

const contactControl = new MongoControl('classTest','contact')

app.use(express.static('./static'))

var handle500=function(res){
    res.status(500).send('你的服务器崩溃了')
}
app.get('/getAllcontact',function(req,res){
    contactControl.find({},function(err,result){
        if(err){ 
        handle500(res)
        return
        }
        res.send(result)
    })
})
app.get('/search',function(req,res){
    var wd= req.query.wd
    var reg=new RegExp(wd,'i')
    contactControl.find(
        {
            $or:[
                {name:{$regex:reg}},
                {phonenumber:{$regex:reg}}
            ]
        },function(err,result){
            if(err)
            {  
                console.log(err)
                return handle500(res)
            }
            res.send(result)
        }
    )
})

app.get('/removeContact',function(req,res){
    var _id=req.query._id
    contactControl.removeById(_id,function(err,result){ 
        if(err)
         return handle500(res)
        res.send(result)
})
})


app.post('/addContact',urlencodeParser,function(req,res){
    var {name,phonenumber}=req.body
    var docs={
        name:name ,
        phonenumber:phonenumber
    }
    contactControl.insert(docs,function(err,result){
        if(err)
        return handle500(res)

        res.send({result:'ok'})
    })
})

app.post('/reviseContact',urlencodeParser,function(req,res){
    var {_id,name,phonenumber}=req.body
    contactControl.insert(
        {
            name:name ,
            phonenumber:phonenumber 
        },function(err,result){
            if(err){ 
            handle500(res)
            console.log('修改联系人插入出错')
            return
            }
    
        contactControl.removeById(_id,function(error,result){
            if(error){
                handle500(res)
                console.log('修改联系人删除旧数据出错')
                return
            }
            res.send({result:'ok'})
        })
    }
    )
})

app.listen(3007)

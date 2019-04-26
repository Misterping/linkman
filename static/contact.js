var contactList = $('#contact-List')
var addContactButton = $('#add-contact-button')
var addContactMOdal = $('#add-contact-modal')

var addContactSubmit = $('#add-contact-submit')
var addContactNameInput = $('#add-contact-name')
var addContactPhonenumber = $('#add-contact-phonenumber')
var removeBtn = $('.remove-btn')

var reviseModal=$("#revise-modal")
var reviseSubmit=$('#revise-submit')
var reviseName=$("#revise-name")
var revisePhoneNumber=$("#revise-phonenumber")

var revise_id=''

var searchInput=$('#search-input')
var killSearch=$('#kill-search')


var contact={
    arr:[] ,
    getContactById:function(_id){
    for(var i=0;i<this.arr.length;i++){
        if(this.arr[i]._id ==_id){
            return this.arr[i]
        }
    }
    return null
    }
}

var addEventListener = function () {
    var removeBtn = $('.remove-btn')
    removeBtn.on('click', function () {
        // console.log($(this).attr('data-_id'))
        removeContact($(this).attr('data-_id'))
    })
    $('.revise-btn').on('click',function(){
         reviseModal.modal('show')
         revise_id=$(this).attr('data-_id')
         var nowRevise=contact.getContactById(revise_id)
         if(nowRevise){
             reviseName.val(nowRevise.name)
             revisePhoneNumber.val(nowRevise.phonenumber)
         }
    })
}

//将联系人填充到页面
var fillData = function (arr) {
    var html = ''
    arr.forEach(element=>{
        // console.log(element)   
         html +=`
            <li class="list-group-item">
               <h2>${element.name}</h2>
              <p>${element.phonenumber}</p>
            <div class="btn-group" role="group" aria-label="...">
        <a type="button" href="tell:${element.phonenumber}" class="btn btn-default btn btn-success glyphicon glyphicon-earphone">拨号</a>
        <button type="button" class="btn btn-default revise-btn btn btn-warning glyphicon glyphicon-pencil" data-_id="${element._id}">修改</button>
        <button type="button" class="btn btn-default  remove-btn btn btn-danger glyphicon glyphicon-trash" data-_id="${element._id}">删除</button>
      </div>
        </li>`    
    })
    contactList.html(html)
    addEventListener()
}
//获取全部联系人
var getAllContact = function () {
    $.ajax({
        type: 'GET',
        url: '/getAllContact',
        data: {
        },
        success: function (result) {
            contact.arr=result
            fillData(result)
            // console.log(result)
        }
    })
}
//获取一个联系人
// app.get('/getContact',function(req,res){
//     var _id=rq.query._id
//     contactList.findById(_id,function (err,result){
//         if(err){
//             handle500(res)
//             return
//         }
//         res.send(result)
//     })
// })

//添加联系人
var addContact = function (name, phonenumber) {
    $.ajax({
        type: 'POST',
        url: '/addContact',
        data: {
            name: name,
            phonenumber: phonenumber
        },
        success: function (result) {
            getAllContact()
        }

    })
}
//删除联系人
var removeContact = function (_id) {
    $.ajax({
        type: 'GET',
        url: '/removeContact',
        data: {
            _id: _id
        }, success: function () {
            getAllContact()
        }
    })
}

//修改联系人
var reviseContact=function(_id,name,phonenumber){
    $.ajax( { 
        type:'POST',
        url:'/reviseContact',
        data:{
            _id:_id,
            name:name,
            phonenumber:phonenumber
        },success:function(){
             getAllContact()
        }
    })
}

//搜索联系人
var search=function(wd){
    $.ajax({
        type:'GET' ,
        url:'/search' ,
        data:{
           wd:wd
        },success:function(e){
        //  console.log(e)
        fillData(e)
        }
    })
}

var initListener = function () {
    addContactButton.on('click', function () {
        addContactMOdal.modal('show')
        // console.log('你好')

    })

    addContactSubmit.on('click', function () {
        var name = addContactNameInput.val()
        addContactNameInput.val('')
        var phonenumber = addContactPhonenumber.val()
        addContactPhonenumber.val('')
        addContact(name, phonenumber)
        addContactMOdal.modal('hide')
    })

    reviseSubmit.on('click',function(){
       var name=reviseName.val()
       reviseName.val('')
       var phonenumber=revisePhoneNumber.val()
       revisePhoneNumber.val('')
       var _id=revise_id
       revise_id=''
       reviseContact(_id,name,phonenumber)
       reviseModal.modal('hide')
    })
    searchInput.on('input',function(){
        // console.log($(this).val())
        var searchresult=$(this).val()
        search(searchresult)
        // fillData(searchresult)
    })
    killSearch.on('click',function(){
        searchInput.val('')
    })
}
var main = function () {
    getAllContact()
    initListener()
}
main()
const mongoose = require('mongoose');

const crypto = require('crypto');

const uuidv1 = require('uuid/v1');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    name : {
        type : String,
        required:true,
        maxlength:32,
        trim:true,

    },
    lastname : {
        type : String,
        maxlength:32,
        trim : true
    },
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true,
    },
    userInfo : {
        type : String,
        trim : true,
    },
    encry_password : {
        type : String,
        required : true
    },
    salt:String,
    role : {
        //the higher the number the higher the role.
        type : Number,
        default : 0
    },
    purchease : {
        type : Array,
        default : []
    }
  },{timestamps : true});


  userSchema.virtual("password")
  .set(function(password){
      this._password = password;
      this.salt = uuidv1();
      this.encry_password = this.securePassword(password)
  })
  .get(function(){
      return this._password
  })

  userSchema.method = {
    securePassword : function(plainPassword){
          if(!encry_password)
          {
              return ""
          }
          try {
              return crypto.createHmac('sha256',this.salt)
                            .update(plainPassword)
                            .digest('hex')
          } catch (err) {
              return " "
          }
    }, 
    authenticate : function(plainPassword){
        return this.securePassword(plainPassword) === this.encry_password;
    }
  }

  module.exports = mongoose.model("User", userSchema) 
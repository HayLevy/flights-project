
const util = require("util");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userSchema");

//import { TokenData, TokenResponse } from "Token";
const { to } = require('await-to-js');

// const SECRET_KEY = config.JWT_Token.secretKey;
const SECRET_KEY = "TOMTOMTOMTOMKEY12345";

const authService = {
	logout: async function (username) {
		console.log("logging out " + username)
		if (loggedUsers>0)
		{
			console.log("logout : before loggedUsers = " + loggedUsers);
			loggedUsers= loggedUsers-1;
			console.log("logout : afer loggedUsers = " + loggedUsers);
		}
		return {result: true};	
	},
	login: async function (username, password) {
		const result= {
			accessToken: null,
			userID: null,
			username: null,
			firstname:null,
			lastname:null,
			email:null,
			isAdmin:null
		};

		[err, found] = await to(this.findByCredentials(username,password));
				
		if (found && found.userName) {
			// Data to encrypt in the token
			const data = {
				 username: found.username,
			};
			accessToken = this.generateToken(data);
			result.accessToken = accessToken;
			result.userID = found.id;
			result.username = found.userName;
			result.firstname = found.firstName;
			result.lastname = found.lastName;
			result.email = found.email;
			result.isAdmin = found.isAdmin;
			
			console.log("login : before loggedUsers = " + loggedUsers);
			loggedUsers=loggedUsers+1;
			console.log("login : after loggedUsers = " + loggedUsers);
		}


		
		if(err)
		   throw err;

		return result;
	},


	findByCredentials: async function(username,password){
		 var query = { userName: username, password:password };

		[err, found] = await to(User.findOne(query));
		
		if(found)
		   return found;
		
		throw new Error('User or password is not correct');
	},
	generateToken: function (data) {
		// const EXPIRED_IN = config.JWT_Token.expirationIn;
		const EXPIRED_IN = 100000;

		const tokenObj = {
			"access_token": null,
			"expires_in": EXPIRED_IN
		};
		const token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + EXPIRED_IN,
			data: data
		}, SECRET_KEY);
		tokenObj.access_token = token;
		return tokenObj;
	},

};

module.exports = authService;
import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendmail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data:any, userType: "user" | "seller") => {
    const{name,email,password, phone_number,country,pic_of_id,short_face_video} = data;
    if(
        !name || !email || !password || (userType === "seller" && (!country || !phone_number || !pic_of_id || !short_face_video))
    ){
        throw new ValidationError(`Missing required fields!`)
    } 

    if(!emailRegex.test(email)){
        throw new ValidationError(`Invalid email format`);
    }
};

export const checkOtpRestrictions = async(email:string,next:NextFunction) => {
    if(await redis.get(`otp_lock:${email}`)){
        return next(new ValidationError("Account is locked due to multiple failure attempts! Try again after 30minutes"));  
    }
    if(await redis.get(`otp_spam_lock:${email}`)) {
        return next(new ValidationError("Too many OTP requests! Please wait 1hour before requesting again."));
    }
    if(await redis.get(`otp_cooldown:${email}`)){
        return next(new ValidationError("Please wait 1minutes before requesting a new OTP!"));
    }  
};

export const trackOtpRequests = async(email:string,next:NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

    if(otpRequests >= 2){
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
        return next(new ValidationError("Too many OTP requests. Please wait 1hour before requesting again."));
    }

    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); //Track request
};

export const sendOtp = async(name:string,email:string,template: string) => {
    const otp = crypto.randomInt(1000,9999).toString();
    await sendEmail(email, "Verify Your Email", template, {name, otp});
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};


export const verifyOtp = async(email:string,otp:string,next:NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);
    if(!storedOtp){
        return next(new ValidationError("Invalid or expired OTP!"));
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0")

    if(storedOtp != otp){
        if(failedAttempts >= 2){
            await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
            await redis.del(`otp:${email}`, failedAttemptsKey);
            return next(new ValidationError("Too many failed attempts. Your account is locked for 30minutes"));
        }
        await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
        return next(new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempts left.`));
    }

    await redis.del(`otp:${email}`, failedAttemptsKey);
};
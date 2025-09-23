export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message:string,statusCode:number, isOperational = true, details?:any){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

//Not found error
export class NotFoundError extends AppError{
    constructor(message= "Resources not Found"){
        super(message, 404);
    }
}

//Validation Error
export class ValidationError extends AppError {
    constructor(message = "Invalid request data", details?: any){
        super(message, 400, true, details);
    }
}

//Auth Error
export class AuthError extends AppError{
    constructor(message = "Unauthized"){
        super(message, 401);
    }
}

//ForbiddenError
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden Access"){
        super(message, 403);
    }
}

//Database Error
export class DatabaseError extends AppError {
    constructor(message = "Database Error", details?: any){
        super(message, 500, true, details);
    }
}

//RateLimit Error
export class RateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later"){
        super(message, 429);
    }
}
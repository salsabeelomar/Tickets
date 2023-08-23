import {
    IsEmail,
    IsString,
    IsNotEmpty,
  } from 'class-validator';
  
  export class activeStaff {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    activeToken: string;

    @IsString()
    @IsNotEmpty()
    declineToken: string;
  }
  
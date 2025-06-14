import { Gender } from "../enums/gender.enum";

export interface IUser {
    id: number;
    email: string;
    password: string;
    name: string;
    gender: Gender;
    profilePicture?: string;
    phoneNumber?: string;
    birthDate?: Date;
    address?: string;
    isDeleted: boolean;
    roles: string[];
}

export interface IUserRequest extends Omit<IUser, 'id'>{}

export interface IUserResponse {
    accessToken: string;
    user: IUser;
}
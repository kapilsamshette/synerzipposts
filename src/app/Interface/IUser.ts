import { IUserDetail } from "./IUserDetail";

export interface IUser {
    Status?:string,
    Message:string,
    Data:IUserDetail
}
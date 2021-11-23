export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface resetPwdInput {
  email: string;
  password: string;
  newpassword: string;
}
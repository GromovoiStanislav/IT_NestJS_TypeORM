export class CreateUserDto {
  id: string;
  login: string;
  password: string;
  email: string;
  createdAt: string;

  confirmationCode: string;
  isEmailConfirmed: boolean = false;

  recoveryCode: string = "";
  isRecoveryCodeConfirmed: boolean = false;

  isBanned: boolean = false;
  banDate: string = null;
  banReason: string = null;
}
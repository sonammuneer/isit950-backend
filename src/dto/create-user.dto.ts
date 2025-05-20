export class CreateUserDto {
  id: string;
  email: string;
  password: string;
  name: string;
  phonenumber: string;
  dateofbirth: string;
  role: string;
  rating: number = 0;
  ratingCount: number = 0;
}

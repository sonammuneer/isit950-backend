export class CreateHotelDto {
  id: string;
  adminemail: string;
  name: string;
  place: string;
  description: string;
  tags: string[];
  rating: number = 0;
}

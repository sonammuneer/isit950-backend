export class CreateHotelDto {
  id: string;
  adminemail: string;
  name: string;
  place: string;
  description?: string;
  rating: number = 0;
  requestId: string;
}

import { ReviewDto } from './create-review.dto';
import { RoomDto } from './room-dto';

export class HotelFetchDto {
  id: string;
  adminemail: string;
  name: string;
  place: string;
  description: string;
  tags: string[];
  room: RoomDto[];
  reviews: ReviewDto[];
}

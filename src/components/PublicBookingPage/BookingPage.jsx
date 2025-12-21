//levlpro-mvp\src\components\PublicBookingPage\BookingPage.jsx
import { useParams } from "react-router-dom";

export default function BookingPage() {
  const { providerId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl">Booking for: {providerId}</h1>
    </div>
  );
}

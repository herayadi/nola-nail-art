import BookingWizard from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Book Appointment | Nola Nail Art",
  description: "Bikin janji temu untuk perawatan kuku cantikmu.",
};

export default function BookingPage() {
  return (
    <div style={{ paddingTop: "var(--space-5xl)", paddingBottom: "var(--space-4xl)" }}>
      <BookingWizard />
    </div>
  );
}

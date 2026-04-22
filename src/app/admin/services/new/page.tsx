import ServiceForm from "../ServiceForm";

export default function NewServicePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tambah Layanan Baru</h1>
        <p className="text-gray-400">Buat layanan baru untuk ditampilkan di katalog web.</p>
      </div>
      <ServiceForm />
    </div>
  );
}

export const dynamic = 'force-dynamic';
import PortfolioForm from "../PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tambah Hasil Karya</h1>
        <p className="text-gray-400">Tambahkan foto terbaru ke galeri portfolio.</p>
      </div>
      <PortfolioForm />
    </div>
  );
}


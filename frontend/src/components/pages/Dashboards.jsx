import FileUpload from '../files/FileUpload';
import FileGrid from '../files/FileGrid';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 order-2 md:order-1">
          <FileGrid />
        </div>
        <div className="md:col-span-1 order-1 md:order-2">
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
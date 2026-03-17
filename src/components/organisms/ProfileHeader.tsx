export function ProfileHeader() {
  return (
    <div className="flex items-center space-x-10 py-12">
      {/* Avatar Circle */}
      <div className="w-48 h-48 rounded-full border-2 border-gray-200 bg-gray-50 flex-shrink-0" />
      
      {/* User Info */}
      <div className="flex flex-col">
        <h1 className="text-5xl font-bold text-black mb-2">Test user 001</h1>
        <p className="text-2xl text-gray-700 font-medium">Lasallian Developer Since 2024</p>
        <div className="mt-4 space-y-1">
          <p className="text-lg text-gray-500">Detail 1</p>
          <p className="text-lg text-gray-500">Detail 2</p>
        </div>
      </div>
    </div>
  );
}
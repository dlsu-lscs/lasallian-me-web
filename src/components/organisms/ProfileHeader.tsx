

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  image?: string;
}



export function ProfileHeader({ name, email, image }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-10 py-12">
      {/* Avatar */}
      <div className="w-48 h-48 rounded-full border-2 border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {image ? (
          <img src={image} alt={name || "Profile Name"} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl font-bold text-gray-400">
            {name?.charAt(0) ?? '?'}
          </span>
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-black mb-2">{name ?? 'Unknown User'}</h1>
        <p className="text-xl text-gray-700 font-medium">Lasallian</p>
        {email && (
          <div className="mt-2  ">
            <p className="text-lg text-gray-500">{email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
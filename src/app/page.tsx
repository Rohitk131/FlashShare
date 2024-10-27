import Upload from "@/components/Upload";
export default function Home() {
  return (
    <div className="w-full h-full ">
      <div className="relative">
   
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-600 to-green-700 pt-5 pl-5 animate-pulse">
          Flash
          <span className="bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
            Share
          </span>
        </h1>

        {/* Lightning bolt decorative element */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative w-full h-full">
            <div className="absolute top-2 left-3 text-green-400 text-lg animate-bounce ">
              ⚡
            </div>
            
          </div>
        </div>

        {/* Glowing underline effect */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mt-2 animate-pulse"></div>
      </div>
      <div className="flex items-center justify-center h-screen">
        <Upload />
      </div>
    </div>
  );
}

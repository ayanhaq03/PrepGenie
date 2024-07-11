import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
      <div className="container mx-auto px-6 py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-8">
            Welcome to PrepGenie
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8">
            Your Ultimate AI Interview Preparation Tool
          </p>
          <Link href="/dashboard">
            <h2 className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-all">
              Start Your Prep Now
            </h2>
          </Link>
        </div>
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
          <Image
            src="/heroimg.png"
            alt="AI Interview"
            width={600}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
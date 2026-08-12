import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-hh-green/5 via-transparent to-hh-pink/5 pointer-events-none" />
      
      <div className="z-10 bg-black/60 p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-hh-green via-hh-yellow to-hh-pink">
          HackerHouse ID Generator
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Welcome to the dashboard. Here you can configure and generate your hacker identity card.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition cursor-pointer">
            <h3 className="text-xl font-bold mb-2 text-hh-green">Create New ID</h3>
            <p className="text-sm text-gray-400">Generate a fresh identity for the hackathon.</p>
          </div>
          <div className="p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition cursor-pointer">
            <h3 className="text-xl font-bold mb-2 text-hh-pink">My Cards</h3>
            <p className="text-sm text-gray-400">View and edit your previously generated IDs.</p>
          </div>
        </div>

        <Link 
          href="/" 
          className="inline-block px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/10"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}

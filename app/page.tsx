import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Overlay Access Manager</h1>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link 
            href="/admin"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Admin Panel
          </Link>
          <Link 
            href="/overlay"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Overlay Demo
          </Link>
        </div>
      </div>
    </main>
  )
}

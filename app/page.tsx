import GifCreator from '@/components/GifCreator/GifCreator'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-center">GIF Creator</h1>
      <GifCreator />
    </main>
  )
}
import ParticleSystem from "@/components/ui/particles"
import VideoInput from "@/components/video-input"
import Head from "next/head"

export default function Home() {
  return (
    <>
    <Head>
      <title>universal downloader</title>
        <link rel="icon" href="../public/thi.png" />
    </Head>

        <div className="w-screen h-screen relative overflow-hidden">
      <ParticleSystem />

      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="text-center space-y-6 md:space-y-8 w-full max-w-2xl">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-50 tracking-tight leading-tight">
              universal downloader
            </h2>
            <p className="text-base md:text-xl text-gray-300/90 max-w-xl mx-auto px-4">
              supports yt, instagram, twitter, and ++ platforms
            </p>
          </div>

          <div className="flex justify-center">
            <VideoInput />
          </div>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6 text-center">
        <p className="text-gray-400/70 text-xs md:text-sm">@buggedplanet on all social medias</p>
      </footer>
    </div>
    </>
  )
}

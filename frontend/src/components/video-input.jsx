"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, ExternalLink, CheckCircle, ArrowDown, FileDown } from "lucide-react"
//  https://buggedplanet.fly.dev

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

function ProgressBar({
  progress = 0,
  stage = "Iniciando...",
  isCompleted = false,
  downloadSpeed = null,
  estimatedTime = null,
}) {
  
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            {!isCompleted ? (
              <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
          <span className="text-sm text-gray-300 font-medium">{stage}</span>
        </div>
        <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
      </div>

      {(downloadSpeed || estimatedTime) && (
        <div className="flex justify-between text-xs text-gray-400">
          {downloadSpeed && <span>Velocidade: {downloadSpeed}</span>}
          {estimatedTime && <span>Tempo restante: {estimatedTime}</span>}
        </div>
      )}

      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out relative ${
            isCompleted
              ? "bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-500/30"
              : "bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-500/20"
          }`}
          style={{ width: `${progress}%` }}
        >
          {!isCompleted && progress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          )}
          {isCompleted && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-ping"></div>
          )}
        </div>
      </div>

      {/* {isCompleted && (
        <div className="flex items-center justify-center space-x-2 text-green-400 animate-fade-in">
          <CheckCircle className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Download concluído com sucesso!</span>
        </div>
      )} */}
    </div>
  )
}

export default function VideoInput() {
  const [url, setUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState("Iniciando...")
  const [isCompleted, setIsCompleted] = useState(false)
  const [downloadSpeed, setDownloadSpeed] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(null)
  const [error, setError] = useState("")
  const progressIntervalRef = useRef(null)
  const downloadStartTimeRef = useRef(null)
  const abortControllerRef = useRef(null)

  // useEffect(() => {
  //   if (!url) {
  //     setThumbnail("")
  //     return
  //   }
  //   const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&/]+)/)?.[1]
  //   if (ytId) {
  //     setThumbnail(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`)
  //   } else {
  //     setThumbnail("")
  //   }
  // }, [url])

  const clearAllTimers = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`
    if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
  }

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`
  }

  const simulateRealisticDownloadProgress = () => {
    downloadStartTimeRef.current = Date.now()
    let currentProgress = 0
    let lastProgressTime = Date.now()
    let lastProgress = 0

    const stages = [
      { name: "Analisando URL...", duration: 800, progressEnd: 5 },
      { name: "Conectando ao servidor...", duration: 1200, progressEnd: 15 },
      { name: "Obtendo informações do vídeo...", duration: 1500, progressEnd: 25 },
      { name: "Preparando download...", duration: 800, progressEnd: 30 },
    ]

    let currentStageIndex = 0

    // const processInitialStages = () => {
    //   if (currentStageIndex < stages.length) {
    //     const stage = stages[currentStageIndex]
    //     setStage(stage.name)

    //     const stageStartTime = Date.now()
    //     const stageInterval = setInterval(() => {
    //       const elapsed = Date.now() - stageStartTime
    //       const stageProgress = Math.min(
    //         (elapsed / stage.duration) * (stage.progressEnd - currentProgress),
    //         stage.progressEnd - currentProgress,
    //       )

    //       setProgress(currentProgress + stageProgress)

    //       if (elapsed >= stage.duration) {
    //         clearInterval(stageInterval)
    //         currentProgress = stage.progressEnd
    //         currentStageIndex++
    //         processInitialStages()
    //       }
    //     }, 100)
    //   } else {
        
    //     setStage("Baixando vídeo...")
    //     startDownloadProgress()
    //   }
    // }

    
    const startDownloadProgress = () => {
      progressIntervalRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = now - downloadStartTimeRef.current

        const baseIncrement = Math.random() * 2 + 0.5
        const timeBasedIncrement = Math.min((elapsed / 1000) * 0.5, 5)
        const increment = baseIncrement + timeBasedIncrement

        currentProgress = Math.min(currentProgress + increment, 95)
        setProgress(currentProgress)

        const timeDiff = (now - lastProgressTime) / 1000
        const progressDiff = currentProgress - lastProgress

        if (timeDiff > 0 && progressDiff > 0) {
          const simulatedSpeed = (progressDiff / timeDiff) * 50000 + Math.random() * 100000
          setDownloadSpeed(formatSpeed(simulatedSpeed))

          const remainingProgress = 100 - currentProgress
          const currentRate = progressDiff / timeDiff
          if (currentRate > 0) {
            const estimatedSeconds = remainingProgress / currentRate
            setEstimatedTime(formatTime(estimatedSeconds))
          }
        }

        lastProgressTime = now
        lastProgress = currentProgress

        if (currentProgress >= 95) {
          setStage("Processando...")
          setDownloadSpeed(null)
          setEstimatedTime(null)
        }
      }, 200)
    }

    processInitialStages()
  }


  const completeDownload = (downloadData) => {
    clearAllTimers()

    setStage("Finalizando...")
    setDownloadSpeed(null)
    setEstimatedTime(null)

    let finalProgress = progress
    const completionInterval = setInterval(() => {
      finalProgress = Math.min(finalProgress + 3, 100)
      setProgress(finalProgress)

      if (finalProgress >= 100) {
        clearInterval(completionInterval)
        setIsCompleted(true)

        setTimeout(() => {
          setDownloadUrl(downloadData.download_url)
        }, 500)
      }
    }, 50)
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setDownloadUrl("")
    setLoading(true)
    setProgress(0)
    setIsCompleted(false)
    setStage("Iniciando...")
    setDownloadSpeed(null)
    setEstimatedTime(null)

    abortControllerRef.current = new AbortController()

    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/upload/?video_url=${encodeURIComponent(url)}`, {
        method: "POST",
        signal: abortControllerRef.current.signal,
      })

      let data
      try {
        data = await res.json()
        if(data.status_code == 404){
          setError("Erro inesperado ao baixar o vídeo, contate o administrador.")
        }
        setThumbnail(data.thumbnail || "")
      } catch {
        data = { detail: res.statusText || "Erro inesperado" }
      }

      if (!res.ok) {
        throw new Error(data.detail)
      }

      completeDownload(data)
    } catch (err) {
      if (err.name === "AbortError") {
        return 
      }

      clearAllTimers()
      setError(err.message)
      setLoading(false)
      setProgress(0)
      setIsCompleted(false)
      setDownloadSpeed(null)
      setEstimatedTime(null)
    }
  }

  useEffect(() => {
    if (isCompleted && downloadUrl) {
      const resetTimer = setTimeout(() => {
        setLoading(false)
        setProgress(0)
        setIsCompleted(false)
        setStage("Iniciando...")
        setDownloadSpeed(null)
        setEstimatedTime(null)
      }, 4000)

      return () => clearTimeout(resetTimer)
    }
  }, [isCompleted, downloadUrl])

  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])







  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border-gray-700/40 shadow-2xl shadow-gray-900/30">
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <Input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value.trim())}
              className="bg-gray-800/60 border-gray-600/50 text-gray-50 placeholder:text-gray-400/70 focus:border-blue-400/70 focus:ring-blue-400/30 h-12 text-base"
              disabled={loading}
            />

            {thumbnail && (
              <div className="flex justify-center">
                <Image
                  src={thumbnail || "/placeholder.svg"}
                  onError={() => setThumbnail("")}
                  alt="Video thumbnail"
                  width={280}
                  height={158}
                  className="rounded-lg border border-gray-600/40 shadow-lg max-w-full h-auto"
                  unoptimized
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/40 border border-red-600/50">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {loading && (
            <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-600/40">
              <ProgressBar
                progress={progress}
                stage={stage}
                isCompleted={isCompleted}
                downloadSpeed={downloadSpeed}
                estimatedTime={estimatedTime}
              />
            </div>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!url || loading}
              className="w-full bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-500 hover:to-blue-500 text-gray-50 font-medium py-3 h-12 transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-900/40 border border-blue-500/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  {isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                      Concluído!
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4 animate-pulse" />
                      Processando...
                    </>
                  )}
                </span>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  generate download link
                </>
              )}
            </Button>
          </div>

          {downloadUrl && (
            <div className="p-4 rounded-lg bg-green-900/20 border border-green-600/40 animate-fade-in">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-green-300 hover:text-green-200 transition-colors font-medium"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Baixar vídeo!
              </a>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

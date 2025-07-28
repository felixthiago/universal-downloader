"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VideoInput() {
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Gera preview da thumbnail sempre que a URL mudar
  useEffect(() => {
    if (!url) {
      setThumbnail("");
      return;
    }
    const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&/]+)/)?.[1];
    if (ytId) {
      setThumbnail(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
    } else {
      setThumbnail(""); // para outros hosts, ou implementar canvas/CORS aqui
    }
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDownloadUrl("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/upload/?video_url=${encodeURIComponent(url)}`,
        { method: "POST" }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        data = { detail: res.statusText || "Erro inesperado" };
      }

      if (!res.ok) {
        throw new Error(data.detail);
      }

      setDownloadUrl(data.download_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="URL Do vídeo"
        value={url}
        onChange={(e) => setUrl(e.target.value.trim())}
      />
      {thumbnail && (
        <Image
          src={thumbnail}
          onError={() => setThumbnail("")}
          alt="Thumbnail preview"
          width={80}
          height={40}
          className="w-48 h-auto object-cover rounded border"
          unoptimized
        />
      )}

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" disabled={!url || loading}>
        {loading ? "Processando..." : "Gerar link"}
      </Button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 underline"
        >
          Baixar vídeo!
        </a>
      )}
    </form>
  );
}

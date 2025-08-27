import { useParams, useNavigate } from "react-router-dom"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ReelVideoPlayer from "@/components/HlsReel"
import { useReel } from "@/hooks/useReel"

export default function ReelDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: reel, isLoading, isError } = useReel(id as string)

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">Loading reel...</span>
        </div>
      </Layout>
    )
  }

  if (isError || !reel) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Reel not found</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </Layout>
    )
  }

  const views = reel.stats?.views ?? 0

  return (
    <Layout>
      <div className="px-4 py-6">
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft /> Back
        </Button>

        <div className="max-w-md mx-auto mb-6">
          <ReelVideoPlayer
            src={reel.videoUrl}
            shouldLoad={true}
            controls
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="max-w-md mx-auto text-white space-y-1">
          <h1 className="text-2xl font-bold">{reel.title}</h1>
          <p className="text-sm text-gray-400">{views} views</p>
          {reel.description && (
            <p className="mt-2 text-gray-200">{reel.description}</p>
          )}
        </div>
      </div>
    </Layout>
  )
}


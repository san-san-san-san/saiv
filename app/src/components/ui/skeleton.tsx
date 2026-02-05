import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="glass-card-static p-5 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

function SkeletonConversation() {
  return (
    <div className="flex items-center justify-between py-4 px-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  )
}

function SkeletonMessage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <div className="max-w-[80%] space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-20 w-64 rounded-2xl" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[80%] space-y-2">
          <Skeleton className="h-16 w-56 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonConversation, SkeletonMessage }

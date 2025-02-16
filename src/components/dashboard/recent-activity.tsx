import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Activity {
  user: {
    name: string
    image: string
    initials: string
  }
  action: string
  time: string
}

const activities: Activity[] = [
  {
    user: { name: "John Doe", image: "/avatars/01.png", initials: "JD" },
    action: "created a new project",
    time: "2 minutes ago"
  },
  {
    user: { name: "Sarah Smith", image: "/avatars/02.png", initials: "SS" },
    action: "uploaded new files",
    time: "1 hour ago"
  },
  {
    user: { name: "Mike Johnson", image: "/avatars/03.png", initials: "MJ" },
    action: "completed task",
    time: "3 hours ago"
  }
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action}
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  )
} 
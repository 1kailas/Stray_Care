import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { volunteerTasksApi, VolunteerTask } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle2, Circle, Clock, Calendar, 
  FileText, Play, CheckCheck, XCircle
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export function VolunteerTasks() {
  const queryClient = useQueryClient()
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [completionNotes, setCompletionNotes] = useState('')

  // Fetch volunteer's tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['my-volunteer-tasks'],
    queryFn: volunteerTasksApi.getMyTasks
  })

  // Update task status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      volunteerTasksApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-volunteer-tasks'] })
      toast.success('Task status updated successfully')
      setViewDialogOpen(false)
      setCompletionNotes('')
    },
    onError: () => {
      toast.error('Failed to update task status')
    }
  })

  // Filter tasks by status
  const pendingTasks = tasks.filter(t => t.status === 'PENDING')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED')

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string }> = {
      LOW: { className: 'bg-blue-100 text-blue-700 border-blue-200' },
      MEDIUM: { className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      HIGH: { className: 'bg-orange-100 text-orange-700 border-orange-200' },
      URGENT: { className: 'bg-red-100 text-red-700 border-red-200' },
    }
    const config = variants[priority] || variants.LOW
    return <Badge className={config.className}>{priority}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { icon: any; className: string }> = {
      PENDING: { icon: Circle, className: 'bg-slate-100 text-slate-700' },
      IN_PROGRESS: { icon: Play, className: 'bg-blue-100 text-blue-700' },
      COMPLETED: { icon: CheckCircle2, className: 'bg-green-100 text-green-700' },
      CANCELLED: { icon: XCircle, className: 'bg-red-100 text-red-700' },
    }
    const config = variants[status] || variants.PENDING
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const handleStartTask = (task: VolunteerTask) => {
    updateStatusMutation.mutate({ id: task.id, status: 'IN_PROGRESS' })
  }

  const handleCompleteTask = (task: VolunteerTask) => {
    setSelectedTask(task)
    setViewDialogOpen(true)
  }

  const confirmComplete = () => {
    if (selectedTask) {
      updateStatusMutation.mutate({ 
        id: selectedTask.id, 
        status: 'COMPLETED',
        notes: completionNotes
      })
    }
  }

  const renderTaskCard = (task: VolunteerTask) => (
    <Card key={task.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription className="mt-1">
              {task.description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Task Meta Information */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {task.dueDate && (
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4" />
              <span>
                Assigned {formatDistanceToNow(new Date(task.assignedDate), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Task Actions */}
          <div className="flex gap-2 pt-2">
            {task.status === 'PENDING' && (
              <Button
                onClick={() => handleStartTask(task)}
                className="flex-1"
                variant="outline"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Task
              </Button>
            )}
            {task.status === 'IN_PROGRESS' && (
              <Button
                onClick={() => handleCompleteTask(task)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            )}
            {task.status === 'COMPLETED' && task.completedDate && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Completed {formatDistanceToNow(new Date(task.completedDate), { addSuffix: true })}
              </div>
            )}
          </div>

          {/* Completion Notes */}
          {task.notes && task.status === 'COMPLETED' && (
            <div className="mt-2 p-3 bg-slate-50 rounded-md text-sm">
              <div className="font-medium text-slate-700 mb-1">Completion Notes:</div>
              <div className="text-slate-600">{task.notes}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Volunteer Tasks</h1>
        <p className="text-slate-600">
          Manage and track your assigned volunteer activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-2xl">{tasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-slate-600">{pendingTasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{inProgressTasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-green-600">{completedTasks.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tasks by Status */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Circle className="h-4 w-4 mr-2" />
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            <Play className="h-4 w-4 mr-2" />
            In Progress ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks assigned yet</h3>
                <p className="text-slate-500 text-center max-w-md">
                  You don't have any tasks assigned yet. Tasks will appear here once an administrator assigns them to you.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Circle className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500">No pending tasks</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500">No tasks in progress</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgressTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500">No completed tasks</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Complete Task Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Add notes about the task completion (optional)
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-md">
                <h4 className="font-semibold text-slate-900 mb-2">{selectedTask.title}</h4>
                <p className="text-sm text-slate-600">{selectedTask.description}</p>
              </div>
              <div>
                <Label htmlFor="completion-notes">Completion Notes (Optional)</Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Add any notes about how you completed this task..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmComplete}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
                <Button
                  onClick={() => setViewDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

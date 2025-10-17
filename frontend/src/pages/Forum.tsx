import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { forumApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, PlusCircle, Heart, MessageCircle, Search, TrendingUp, Send } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

export function Forum() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({})

  // Fetch forum posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forum'],
    queryFn: () => forumApi.getAll(),
  })

  // Fetch single post with comments when expanded
  const { data: expandedPost } = useQuery({
    queryKey: ['forum', expandedPostId],
    queryFn: () => forumApi.getById(expandedPostId!),
    enabled: !!expandedPostId,
  })

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: any) => forumApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum'] })
      setShowCreateDialog(false)
      toast.success('Post created successfully!')
    },
    onError: () => {
      toast.error('Failed to create post')
    },
  })

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: (postId: string) => forumApi.like(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum'] })
    },
  })

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      forumApi.addComment(postId, { content, authorName: user?.name }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum'] })
      queryClient.invalidateQueries({ queryKey: ['forum', variables.postId] })
      setCommentTexts(prev => ({ ...prev, [variables.postId]: '' }))
      toast.success('Comment added successfully!')
    },
    onError: () => {
      toast.error('Failed to add comment')
    },
  })

  // Handle create post
  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      author: user,
    }
    createPostMutation.mutate(data)
  }

  // Handle add comment
  const handleAddComment = (postId: string) => {
    const content = commentTexts[postId]
    if (!content || !content.trim()) {
      toast.error('Please enter a comment')
      return
    }
    addCommentMutation.mutate({ postId, content })
  }

  // Toggle comments view
  const toggleComments = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null)
    } else {
      setExpandedPostId(postId)
    }
  }

  // Filter posts
  const filteredPosts = posts.filter((post: any) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading forum posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            Community Forum
          </h1>
          <p className="text-muted-foreground mt-1">
            Share stories, ask questions, and connect with fellow animal lovers
          </p>
        </div>
        {user && (
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            New Post
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((sum: number, p: any) => sum + (p.likes || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((sum: number, p: any) => sum + (p.commentCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(posts.map((p: any) => p.author?.id)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try a different search term' : 'Be the first to start a discussion!'}
            </p>
            {user && !searchTerm && (
              <Button onClick={() => setShowCreateDialog(true)}>Create First Post</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post: any) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback>
                        {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        {post.isPinned && (
                          <Badge variant="secondary">Pinned</Badge>
                        )}
                        {post.isLocked && (
                          <Badge variant="destructive">Locked</Badge>
                        )}
                      </div>
                      <CardDescription>
                        by {post.author?.name || 'Anonymous'} •{' '}
                        {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeMutation.mutate(post.id)}
                    disabled={likeMutation.isPending}
                    className="gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    {post.likes || 0}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments?.length || 0} {post.comments?.length === 1 ? 'reply' : 'replies'}
                  </Button>
                  {post.likes > 10 && (
                    <div className="flex items-center gap-1 text-sm text-orange-600">
                      <TrendingUp className="w-4 h-4" />
                      Trending
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                {expandedPostId === post.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    {/* Existing Comments */}
                    {expandedPost?.comments && expandedPost.comments.length > 0 ? (
                      <div className="space-y-3">
                        {expandedPost.comments.map((comment: any) => (
                          <div key={comment.id} className="flex gap-3 bg-muted/30 p-3 rounded-lg">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {comment.authorName?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold">{comment.authorName || 'Anonymous'}</span>
                                <span className="text-xs text-muted-foreground">
                                  {comment.createdAt && new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No replies yet. Be the first to reply!
                      </p>
                    )}

                    {/* Add Comment Form */}
                    {user && !post.isLocked && (
                      <div className="flex gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Write a reply..."
                            value={commentTexts[post.id] || ''}
                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleAddComment(post.id)
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            disabled={addCommentMutation.isPending || !commentTexts[post.id]?.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {!user && (
                      <p className="text-sm text-center text-muted-foreground">
                        Please login to reply
                      </p>
                    )}
                    {post.isLocked && (
                      <p className="text-sm text-center text-muted-foreground">
                        This post is locked. No new replies allowed.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Post Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleCreatePost}>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share your thoughts with the community
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="What's on your mind?"
                  required
                  maxLength={100}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Share your story, ask a question, or start a discussion..."
                  rows={8}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPostMutation.isPending}>
                {createPostMutation.isPending ? 'Posting...' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

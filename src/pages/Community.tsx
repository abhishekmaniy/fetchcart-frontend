import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  Camera,
  Sparkles,
  ArrowLeft
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

interface Post {
  id: string
  title: string
  content: string
  image?: string
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  category: string
  likes: number
  comments: number
  shares: number
  createdAt: string
  trending?: boolean
}

const categories = [
  'All',
  'Electronics',
  'Home & Office',
  'Beauty & Health',
  'Fashion',
  'Sports',
  'Food & Drinks'
]

const Community = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Best Budget Gaming Setup Under $500',
      content:
        "After months of research and testing, I've put together the ultimate budget gaming setup that won't break the bank. Here's everything you need to know...",
      image:
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=200&fit=crop',
      author: {
        name: 'TechMaster92',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
        verified: true
      },
      category: 'Electronics',
      likes: 234,
      comments: 45,
      shares: 12,
      createdAt: '2024-01-15',
      trending: true
    },
    {
      id: '2',
      title: 'My Minimalist Home Office Transformation',
      content:
        'Transformed my cluttered spare room into a productive minimalist workspace. Here are the key items that made all the difference...',
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop',
      author: {
        name: 'MinimalLife',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop',
        verified: false
      },
      category: 'Home & Office',
      likes: 189,
      comments: 32,
      shares: 8,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Best Skincare Routine for Sensitive Skin',
      content:
        'After struggling with sensitive skin for years, I finally found products that work. Here is my complete routine and product recommendations...',
      image:
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=200&fit=crop',
      author: {
        name: 'SkincareSarah',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
        verified: true
      },
      category: 'Beauty & Health',
      likes: 156,
      comments: 28,
      shares: 15,
      createdAt: '2024-01-13',
      trending: true
    }
  ])

  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    image: ''
  })

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      image: newPost.image || undefined,
      author: {
        name: 'You',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop',
        verified: false
      },
      category: newPost.category,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setPosts([post, ...posts])
    setNewPost({ title: '', content: '', category: '', image: '' })
    setIsCreateModalOpen(false)

    toast({
      title: 'Post Created!',
      description: 'Your experience has been shared with the community.'
    })
  }

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    )
  }

  const filteredPosts = posts
    .filter(post => {
      const matchesCategory =
        filter === 'all' ||
        post.category.toLowerCase().includes(filter.toLowerCase())

      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likes - a.likes
      if (sortBy === 'trending') {
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <main className='relative min-h-screen overflow-hidden bg-hero px-4 py-6 sm:px-6 lg:px-8'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -top-32 -left-24 h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl' />
        <div className='absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-sky-400/20 blur-3xl' />
        <div className='absolute bottom-0 left-1/3 h-[280px] w-[280px] rounded-full bg-violet-400/20 blur-3xl' />
      </div>

      <div className='mx-auto max-w-6xl space-y-8'>
        <div className='flex items-center justify-between gap-4 rounded-3xl glass border border-border/70 p-4 shadow-soft'>
          <Button
            variant='ghost'
            onClick={() => navigate('/search')}
            className='rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>

          <div className='inline-flex items-center gap-2 rounded-full bg-accent/70 px-3 py-1 text-xs text-primary'>
            <Sparkles className='h-3.5 w-3.5' />
            Community
          </div>
        </div>

        <section className='text-center'>
          <div className='mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow'>
            <Sparkles className='h-6 w-6 text-white' />
          </div>

          <h1 className='font-display text-5xl tracking-tight sm:text-6xl'>
            Shopper <span className='text-gradient italic'>Community</span>
          </h1>

          <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
            Share shopping experiences, discover great product ideas, and
            connect with fellow smart shoppers.
          </p>
        </section>

        <section className='rounded-3xl glass border border-border/70 p-4 shadow-soft'>
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search community posts...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='h-11 rounded-2xl border-border/70 bg-card/70 pl-11'
              />
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className='h-11 w-full rounded-2xl border-border/70 bg-card/70 lg:w-52'>
                <SelectValue placeholder='Filter by category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='h-11 w-full rounded-2xl border-border/70 bg-card/70 lg:w-48'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='recent'>Most Recent</SelectItem>
                <SelectItem value='popular'>Most Popular</SelectItem>
                <SelectItem value='trending'>Trending</SelectItem>
              </SelectContent>
            </Select>

            <CreatePostDialog
              open={isCreateModalOpen}
              setOpen={setIsCreateModalOpen}
              newPost={newPost}
              setNewPost={setNewPost}
              handleCreatePost={handleCreatePost}
            />
          </div>
        </section>

        <section className='space-y-5'>
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </section>

        {filteredPosts.length === 0 && (
          <div className='rounded-3xl glass border border-border/70 p-12 text-center shadow-soft'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow'>
              <Search className='h-6 w-6 text-white' />
            </div>

            <h3 className='mt-5 text-xl font-semibold'>No posts found</h3>

            <p className='mt-2 text-sm text-muted-foreground'>
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Be the first to share your shopping experience!'}
            </p>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className='mt-6 rounded-2xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow'
            >
              <Plus className='mr-2 h-4 w-4' />
              Create First Post
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

const CreatePostDialog = ({
  open,
  setOpen,
  newPost,
  setNewPost,
  handleCreatePost
}: {
  open: boolean
  setOpen: (open: boolean) => void
  newPost: {
    title: string
    content: string
    category: string
    image: string
  }
  setNewPost: React.Dispatch<
    React.SetStateAction<{
      title: string
      content: string
      category: string
      image: string
    }>
  >
  handleCreatePost: () => void
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='h-11 rounded-2xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow'>
          <Plus className='mr-2 h-4 w-4' />
          Create Post
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-2xl rounded-3xl border border-border/70 bg-background/90 p-0 shadow-elegant backdrop-blur-xl'>
        <div className='relative overflow-hidden rounded-3xl p-6'>
          <div className='absolute -top-24 -left-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl' />
          <div className='absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl' />

          <div className='relative space-y-5'>
            <DialogHeader>
              <div className='mb-3 inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1 text-xs text-primary shadow-soft'>
                <Sparkles className='h-3.5 w-3.5' />
                Share experience
              </div>

              <DialogTitle className='font-display text-4xl tracking-tight'>
                Create <span className='text-gradient italic'>Post</span>
              </DialogTitle>
            </DialogHeader>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  placeholder="What's your experience about?"
                  value={newPost.title}
                  onChange={e =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className='mt-2 rounded-2xl border-border/70 bg-card/70'
                />
              </div>

              <div>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={newPost.category}
                  onValueChange={value =>
                    setNewPost({ ...newPost, category: value })
                  }
                >
                  <SelectTrigger className='mt-2 rounded-2xl border-border/70 bg-card/70'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='content'>Content</Label>
                <Textarea
                  id='content'
                  placeholder='Share your detailed experience, tips, and recommendations...'
                  value={newPost.content}
                  onChange={e =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows={6}
                  className='mt-2 resize-none rounded-2xl border-border/70 bg-card/70'
                />
              </div>

              <div>
                <Label htmlFor='image'>Image URL optional</Label>
                <div className='mt-2 flex gap-2'>
                  <Input
                    id='image'
                    placeholder='Paste image URL...'
                    value={newPost.image}
                    onChange={e =>
                      setNewPost({ ...newPost, image: e.target.value })
                    }
                    className='rounded-2xl border-border/70 bg-card/70'
                  />

                  <Button
                    variant='outline'
                    size='icon'
                    className='rounded-2xl border-border/70 bg-card/70'
                  >
                    <Camera className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='flex gap-2 pt-2'>
                <Button
                  onClick={handleCreatePost}
                  className='flex-1 rounded-2xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow'
                >
                  Share Experience
                </Button>

                <Button
                  variant='outline'
                  onClick={() => setOpen(false)}
                  className='rounded-2xl border-border/70 bg-card/70'
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const PostCard = ({
  post,
  onLike
}: {
  post: Post
  onLike: (postId: string) => void
}) => {
  return (
    <Card className='overflow-hidden rounded-3xl glass border-border/70 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant'>
      <CardContent className='p-0'>
        <div className='flex flex-col md:flex-row'>
          {post.image && (
            <div className='h-56 md:h-auto md:w-80 shrink-0 overflow-hidden bg-card/70'>
              <img
                src={post.image}
                alt={post.title}
                className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
              />
            </div>
          )}

          <div className='flex-1 p-5 sm:p-6'>
            <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-11 w-11 border border-border/70'>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>

                <div>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold'>{post.author.name}</span>
                    {post.author.verified && (
                      <Badge
                        variant='secondary'
                        className='rounded-full bg-accent text-primary'
                      >
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className='mt-1 flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <Calendar className='h-3.5 w-3.5' />
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <Badge
                  variant='outline'
                  className='rounded-full border-border/70 bg-card/70'
                >
                  {post.category}
                </Badge>

                {post.trending && (
                  <Badge className='rounded-full bg-primary-gradient text-white'>
                    <TrendingUp className='mr-1 h-3 w-3' />
                    Trending
                  </Badge>
                )}
              </div>
            </div>

            <h3 className='text-xl font-semibold tracking-tight text-foreground'>
              {post.title}
            </h3>

            <p className='mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground'>
              {post.content}
            </p>

            <div className='mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onLike(post.id)}
                  className='rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500'
                >
                  <Heart className='mr-2 h-4 w-4' />
                  {post.likes}
                </Button>

                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground'
                >
                  <MessageCircle className='mr-2 h-4 w-4' />
                  {post.comments}
                </Button>

                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground'
                >
                  <Share2 className='mr-2 h-4 w-4' />
                  {post.shares}
                </Button>
              </div>

              <Button
                variant='outline'
                size='sm'
                className='rounded-xl border-border/70 bg-card/70 hover:bg-accent'
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Community
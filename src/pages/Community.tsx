import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, Plus, Filter, Search, Calendar, TrendingUp, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  trending?: boolean;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Best Budget Gaming Setup Under $500",
      content: "After months of research and testing, I've put together the ultimate budget gaming setup that won't break the bank. Here's everything you need to know...",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=200&fit=crop",
      author: {
        name: "TechMaster92",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
        verified: true
      },
      category: "Electronics",
      likes: 234,
      comments: 45,
      shares: 12,
      createdAt: "2024-01-15",
      trending: true
    },
    {
      id: "2",
      title: "My Minimalist Home Office Transformation",
      content: "Transformed my cluttered spare room into a productive minimalist workspace. Here are the key items that made all the difference...",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop",
      author: {
        name: "MinimalLife",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop",
        verified: false
      },
      category: "Home & Office",
      likes: 189,
      comments: 32,
      shares: 8,
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      title: "Best Skincare Routine for Sensitive Skin",
      content: "After struggling with sensitive skin for years, I finally found products that work. Here's my complete routine and product recommendations...",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=200&fit=crop",
      author: {
        name: "SkincareSarah",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
        verified: true
      },
      category: "Beauty & Health",
      likes: 156,
      comments: 28,
      shares: 15,
      createdAt: "2024-01-13",
      trending: true
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    image: ""
  });
  const { toast } = useToast();

  const categories = ["All", "Electronics", "Home & Office", "Beauty & Health", "Fashion", "Sports", "Food & Drinks"];

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      image: newPost.image || undefined,
      author: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
        verified: false
      },
      category: newPost.category,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", category: "", image: "" });
    setIsCreateModalOpen(false);
    
    toast({
      title: "Post Created!",
      description: "Your experience has been shared with the community."
    });
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = filter === "all" || post.category.toLowerCase().includes(filter.toLowerCase());
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "trending") return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your shopping experiences, discover great products, and connect with fellow shoppers
          </p>
        </div>

        {/* Filters and Create Post */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
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
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What's your experience about?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your detailed experience, tips, and recommendations..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="image"
                      placeholder="Paste image URL or upload..."
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    />
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleCreatePost} className="flex-1">
                    Share Experience
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {post.image && (
                    <div className="md:w-80 h-48 md:h-auto">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{post.author.name}</span>
                            {post.author.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{post.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{post.category}</Badge>
                        {post.trending && (
                          <Badge className="bg-orange-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-2 hover:text-red-500"
                        >
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </Button>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">📝</div>
                <h3 className="text-xl font-semibold">No posts found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filter !== "all" 
                    ? "Try adjusting your filters or search terms"
                    : "Be the first to share your shopping experience!"
                  }
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Community;
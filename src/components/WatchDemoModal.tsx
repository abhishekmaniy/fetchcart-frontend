import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, X } from "lucide-react";
import { useState } from "react";

interface WatchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WatchDemoModal = ({ isOpen, onClose }: WatchDemoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-4xl'} p-0 overflow-hidden`}>
        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* Video Container */}
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            {/* Placeholder for video - replace with your actual video */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause className="h-12 w-12" />
                  ) : (
                    <Play className="h-12 w-12 ml-1" />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">FetchCart AI Demo</h3>
                  <p className="text-white/80">Watch how AI revolutionizes your shopping experience</p>
                  <div className="text-sm text-white/60">Duration: 2:34</div>
                </div>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 group">
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-1/3 rounded-full transition-all duration-300"></div>
                  </div>
                  
                  <span className="text-white text-sm">0:45 / 2:34</span>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video Info Section */}
          {!isFullscreen && (
            <div className="bg-background p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Experience the Future of Shopping</h3>
                <p className="text-muted-foreground">
                  Discover how FetchCart's AI-powered platform transforms your shopping experience 
                  with intelligent product recommendations, price comparisons, and personalized insights.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  AI-Powered Search
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Smart Comparisons
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Price Tracking
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Personalized Insights
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="flex-1" onClick={togglePlay}>
                  {isPlaying ? "Pause Demo" : "Watch Demo"}
                </Button>
                <Button variant="outline" onClick={() => window.open('/dashboard', '_blank')}>
                  Try It Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WatchDemoModal;
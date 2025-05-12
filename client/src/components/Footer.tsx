import { Heart, Wand2, MessageCircle, Lightbulb, Shield } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-20">
      {/* Purple gradient divider */}
      <div className="relative h-0.5 w-full bg-gradient-to-r from-purple-500/10 via-purple-500/50 to-purple-500/10 mb-8 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse rounded-full" style={{ width: '30%', animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
      </div>
      
      {/* Features section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-5 hover-card">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg">Bypass AI Detection</h3>
          </div>
          <p className="text-sm text-muted-foreground">Our advanced algorithms transform AI text to easily bypass detection tools while preserving meaning.</p>
        </div>
        
        <div className="glass-card p-5 hover-card">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg">Multiple Styles</h3>
          </div>
          <p className="text-sm text-muted-foreground">Choose from casual, formal, academic, creative, or technical writing styles to fit your needs.</p>
        </div>
        
        <div className="glass-card p-5 hover-card">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-md">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg">Smart Processing</h3>
          </div>
          <p className="text-sm text-muted-foreground">Powered by advanced DeepSeek models optimized for different content types and purposes.</p>
        </div>
      </div>
      
      {/* Copyright and links */}
      <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-purple-100 dark:border-purple-900/50">
        <div className="text-muted-foreground text-sm mb-4 md:mb-0 flex items-center">
          &copy; {currentYear} Humanize.AI
          <span className="mx-2 text-purple-500">•</span>
          <span className="flex items-center">Made with <Heart className="h-3 w-3 mx-1 text-red-500 fill-red-500" /> by Replit</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">Terms of Service</a>
          <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors flex items-center">
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

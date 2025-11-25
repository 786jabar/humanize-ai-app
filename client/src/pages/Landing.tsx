import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, GraduationCap, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>Humanize.AI | Transform AI Content into Natural Human-like Text</title>
        <meta name="description" content="Humanize.AI transforms AI-generated content into natural, human-like text that bypasses AI detection tools. Professional academic writing assistance." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        {/* Header */}
        <header className="border-b border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Humanize.AI
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
              Professional AI Text Humanization
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Transform AI Text into<br />Natural Human Writing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced AI-powered humanization with academic writing assistance, intelligent synonym suggestions, and complete AI detection bypass.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg px-8 py-6 h-auto"
              data-testid="button-get-started"
              disabled
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Ready to Transform Your Text
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 w-fit mb-4">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Academic Writing Assistant</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  18 expert templates for university-level writing. Transform text into formal scholarly content with theoretical frameworks and critical analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 w-fit mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Detection Bypass</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced algorithms ensure your humanized text passes all major AI detection tools while maintaining natural human writing patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 w-fit mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Intelligent Customization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Control writing style, tone, vocabulary level, sentence structure, and choose between multiple AI models for optimal results.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits List */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Humanize.AI?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "University-level academic writing templates",
                  "Multiple AI models (DeepSeek Chat, Coder, Instruct, V3)",
                  "Customizable writing styles and tones",
                  "Intelligent synonym suggestions",
                  "Grammar improvement and polish",
                  "UK and US English variants",
                  "Advanced paraphrasing levels",
                  "Real-time AI detection testing"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join professionals and students who trust Humanize.AI for natural, undetectable humanized content.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg px-8 py-6 h-auto"
              data-testid="button-cta-login"
              disabled
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Humanizing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-100 dark:border-purple-900 mt-20 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Humanize.AI. Transform AI content into natural human writing.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

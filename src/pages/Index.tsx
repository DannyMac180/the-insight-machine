import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import InsightDisplay from "@/components/InsightDisplay";
import { User } from "@supabase/supabase-js";
import { Upload } from "lucide-react";

const Index = () => {
  const [input, setInput] = React.useState("");
  const [insight, setInsight] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Checking session:", session);
      setUser(session?.user || null);
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user || null);
    });

    // Listen for our custom sign-in event
    const handleSignIn = () => {
      console.log("Custom sign-in event received");
      checkSession();
    };

    window.addEventListener('supabase.auth.sign-in', handleSignIn);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('supabase.auth.sign-in', handleSignIn);
    };
  }, []);

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut();
      setUser(null);
    } else {
      navigate('/auth');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("Please sign in to upload documents");
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document, or text file");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke('process-document', {
        body: formData,
        headers: {
          'x-user-id': user.id,
        }
      });

      if (response.error) throw response.error;

      setInput(response.data.text);
      toast.success("Document uploaded and processed successfully");
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error("Failed to process document");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsight = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text or upload a document to generate insights");
      return;
    }
    setIsLoading(true);
    try {
      // For now, we'll use a simple transformation
      // In a future iteration, we can integrate with an LLM
      const generatedInsight = `Insight generated from: ${input}`;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setInsight(generatedInsight);
      toast.success("Insight generated successfully");
    } catch (error) {
      toast.error("Failed to generate insight");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={handleAuth}
          >
            {user ? 'Sign Out' : 'Sign In'}
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-4xl font-semibold tracking-tight">The Insight Machine</h1>
            <p className="text-muted-foreground">Transform Information into Insight</p>
          </div>

          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="flex-shrink-0"
                >
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    disabled={isLoading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </label>
                <p className="text-sm text-muted-foreground">
                  Upload a PDF, Word doc, or text file
                </p>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="Share your thoughts or upload a document..."
                  className="min-h-[200px] resize-none text-lg p-4"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={generateInsight}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Generate Insight"}
              </Button>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {insight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <InsightDisplay insight={insight} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;

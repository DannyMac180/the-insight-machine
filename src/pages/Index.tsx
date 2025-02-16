
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import InsightDisplay from "@/components/InsightDisplay";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const [input, setInput] = React.useState("");
  const [insight, setInsight] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the session when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setUser(session?.user || null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
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

  const generateInsight = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text to generate insights");
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
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[200px] resize-none text-lg p-4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={generateInsight}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Insight"}
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

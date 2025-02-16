
import { Card } from "@/components/ui/card";
import { AuthButtons } from "@/components/AuthButtons";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate('/');
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4"
      >
        <Card className="p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Welcome to The Insight Machine</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>
          <AuthButtons />
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;

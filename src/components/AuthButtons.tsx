
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { GithubIcon, TwitterIcon } from "lucide-react";
import { toast } from "sonner";

export const AuthButtons = () => {
  const handleSocialLogin = async (provider: 'github' | 'twitter') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => handleSocialLogin('github')}
      >
        <GithubIcon className="w-5 h-5" />
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => handleSocialLogin('twitter')}
      >
        <TwitterIcon className="w-5 h-5" />
        Continue with Twitter
      </Button>
    </div>
  );
};

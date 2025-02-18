import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { GithubIcon } from "lucide-react";
import { toast } from "sonner";

export const AuthButtons = () => {
  const handleSocialLogin = async (provider: 'github' | 'google') => {
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
        onClick={() => handleSocialLogin('google')}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
          />
        </svg>
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => handleSocialLogin('github')}
      >
        <GithubIcon className="w-5 h-5" />
        Continue with GitHub
      </Button>
    </div>
  );
};

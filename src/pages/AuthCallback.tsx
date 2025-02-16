
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the session before redirecting
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Callback session check:", session);
      if (session) {
        // If we have a session, notify about auth state change before redirecting
        const event = new Event('supabase.auth.sign-in');
        window.dispatchEvent(event);
        navigate('/');
      } else {
        console.error("No session found in callback");
        navigate('/auth');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

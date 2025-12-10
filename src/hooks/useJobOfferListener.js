// src/hooks/useJobOfferListener.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useJobOfferListener(providerId) {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Fetch current job offer on mount
  useEffect(() => {
    if (!providerId) return;

    const fetchCurrentOffer = async () => {
      try {
        const { data, error } = await supabase.rpc("get_current_job_offer", {
          p_provider_id: providerId,
        });

        if (error) {
          console.error("Error fetching current offer:", error);
          return;
        }

        if (data && data.length > 0) {
          console.log("📋 Current job offer found:", data[0]);
          setCurrentOffer(data[0]);
        }
      } catch (err) {
        console.error("Exception fetching current offer:", err);
      }
    };

    fetchCurrentOffer();
  }, [providerId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!providerId) return;

    setIsListening(true);
    console.log("👂 Listening for job offers for provider:", providerId);

    // Subscribe to job_dispatch_queue changes
    const subscription = supabase
      .channel("job-offers")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "job_dispatch_queue",
          filter: `provider_id=eq.${providerId}`,
        },
        async (payload) => {
          console.log("🔔 New job offer received:", payload);

          // Fetch full job details
          const { data, error } = await supabase.rpc("get_current_job_offer", {
            p_provider_id: providerId,
          });

          if (!error && data && data.length > 0) {
            setCurrentOffer(data[0]);
            
            // Optional: Play notification sound
            try {
              const audio = new Audio("/notification.mp3");
              audio.play().catch((e) => console.log("Could not play sound:", e));
            } catch (e) {
              console.log("Audio not available");
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "job_dispatch_queue",
          filter: `provider_id=eq.${providerId}`,
        },
        (payload) => {
          console.log("📝 Job offer updated:", payload);
          
          // If this offer was responded to, clear it
          if (payload.new.response !== null) {
            setCurrentOffer(null);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("🔇 Unsubscribing from job offers");
      subscription.unsubscribe();
      setIsListening(false);
    };
  }, [providerId]);

  const acceptOffer = async () => {
    if (!currentOffer) return;

    try {
      console.log("✅ Accepting job:", currentOffer.job_id);
      
      const { data, error } = await supabase.rpc("accept_job", {
        p_job_id: currentOffer.job_id,
        p_provider_id: providerId,
      });

      if (error) throw error;

      if (data) {
        console.log("✅ Job accepted successfully!");
        alert("Job accepted! Check your schedule.");
        setCurrentOffer(null);
        
        // Reload the page to refresh job list
        window.location.reload();
        return true;
      } else {
        alert("This job has already been accepted by another provider.");
        setCurrentOffer(null);
        return false;
      }
    } catch (err) {
      console.error("Error accepting job:", err);
      alert("Failed to accept job. Please try again.");
      return false;
    }
  };

  const declineOffer = async () => {
    if (!currentOffer) return;

    try {
      console.log("❌ Declining job:", currentOffer.job_id);
      
      const { data, error } = await supabase.rpc("decline_job", {
        p_job_id: currentOffer.job_id,
        p_provider_id: providerId,
      });

      if (error) throw error;

      console.log("❌ Job declined. Next provider:", data);
      setCurrentOffer(null);
      return true;
    } catch (err) {
      console.error("Error declining job:", err);
      alert("Failed to decline job. Please try again.");
      return false;
    }
  };

  const handleTimeout = async () => {
    if (!currentOffer) return;

    try {
      console.log("⏱️ Job offer timed out:", currentOffer.job_id);
      
      const { data, error } = await supabase.rpc("expire_job_offer", {
        p_job_id: currentOffer.job_id,
        p_provider_id: providerId,
      });

      if (error) throw error;

      console.log("⏱️ Job offer expired. Next provider:", data);
      alert("You missed this job offer. It has been sent to another provider.");
      setCurrentOffer(null);
    } catch (err) {
      console.error("Error expiring job offer:", err);
    }
  };

  return {
    currentOffer,
    isListening,
    acceptOffer,
    declineOffer,
    handleTimeout,
  };
}
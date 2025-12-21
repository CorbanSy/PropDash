//levlpro-mvp\src\components\ProviderDashboard\Network\hooks\useNetworkData.js
import { useState, useEffect } from "react";
import { fetchNetworkData as fetchData } from "../utils/networkApi";
import { supabase } from "../../../../lib/supabaseClient";

export function useNetworkData(user) {
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [allProfessionals, setAllProfessionals] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNetworkData();
      fetchEarnings();
    }
  }, [user]);

  const fetchNetworkData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log("🔄 Fetching network data for user:", user.id);
    setLoading(true);
    try {
      const data = await fetchData(user.id);
      
      console.log("📊 Network Data Received:");
      console.log("  Connections:", data.connections.length);
      console.log("  Pending Invites:", data.pendingInvites.length);
      console.log("  Sent Invites:", data.sentInvites.length);
      
      setConnections(data.connections);
      setPendingInvites(data.pendingInvites);
      setSentInvites(data.sentInvites);
      setAllProfessionals(data.allProfessionals);
    } catch (error) {
      console.error("Error fetching network data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    if (!user) return;

    try {
      // Fetch referrals with job price info
      const { data, error } = await supabase
        .from("job_referrals")
        .select("commission_amount, commission_rate, original_job:jobs!job_referrals_original_job_id_fkey(price)")
        .eq("referring_provider_id", user.id)
        .in("status", ["completed", "paid"]);

      if (error) throw error;

      // Calculate total earnings
      const total = data.reduce((sum, referral) => {
        // Use commission_amount if set, otherwise calculate from price
        const amount = referral.commission_amount || 
          (referral.original_job?.price ? 
            Math.round(referral.original_job.price * referral.commission_rate) : 
            0);
        return sum + amount;
      }, 0);

      console.log("💰 Total earnings:", total / 100, "dollars");
      setTotalEarnings(total);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      setTotalEarnings(0);
    }
  };

  const stats = {
    verifiedPros: allProfessionals.filter(p => p.verification_status === "verified").length,
    totalEarnings,
  };

  return {
    loading,
    connections,
    allProfessionals,
    pendingInvites,
    sentInvites,
    stats,
    refreshData: fetchNetworkData,
  };
}
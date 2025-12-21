//levlpro-mvp\src\components\ProviderDashboard\Network\hooks\useConnectionActions.js
import { useState } from "react";
import {
  sendInvite,
  acceptInvite as acceptInviteApi,
  declineInvite as declineInviteApi,
  cancelInvite as cancelInviteApi,
} from "../utils/networkApi";

export function useConnectionActions(onRefresh) {
  const [loading, setLoading] = useState(false);

  const sendConnectionInvite = async (currentUserId, professionalId, message = "") => {
    setLoading(true);
    try {
      await sendInviteApi(currentUserId, professionalId, message);
      await onRefresh();
      return { success: true };
    } catch (error) {
      console.error("Error sending invite:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async (inviteId) => {
    setLoading(true);
    try {
      await acceptInviteApi(inviteId);
      await onRefresh();
      return { success: true };
    } catch (error) {
      console.error("Error accepting invite:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const declineInvite = async (inviteId) => {
    setLoading(true);
    try {
      await declineInviteApi(inviteId);
      await onRefresh();
      return { success: true };
    } catch (error) {
      console.error("Error declining invite:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const cancelInvite = async (inviteId) => {
    setLoading(true);
    try {
      await cancelInviteApi(inviteId);
      await onRefresh();
      return { success: true };
    } catch (error) {
      console.error("Error cancelling invite:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendConnectionInvite,
    acceptInvite,
    declineInvite,
    cancelInvite,
  };
}
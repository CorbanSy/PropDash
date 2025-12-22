import { UserCheck } from "lucide-react";
import { theme } from "../../../../../styles/theme";

export default function ConnectionsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className={theme.text.h2}>My Connections</h2>
        <p className={theme.text.body}>
          Manage your professional network and referral partnerships
        </p>
      </div>
    </div>
  );
}
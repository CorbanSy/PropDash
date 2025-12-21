//levlpro-mvp\src\components\ProviderDashboard\Network\components\MyConnections\ConnectionsGrid.jsx
import { Search } from "lucide-react";
import { theme } from "../../../../../styles/theme";
import PartnerCard from "../PartnerCard";

export default function ConnectionsGrid({
  connections,
  currentUserId,
  onViewProfile,
  onMessage,
  onRefer,
  onRefresh,
}) {
  if (connections.length === 0) {
    return (
      <div className={`${theme.card.base} ${theme.card.padding} text-center py-12`}>
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="text-slate-400" size={32} />
        </div>
        <h3 className={`${theme.text.h3} mb-2`}>No Matches Found</h3>
        <p className={theme.text.body}>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.map((partner) => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          onClick={() => onViewProfile(partner)}
          onMessage={onMessage}
          onRefer={onRefer}
        />
      ))}
    </div>
  );
}
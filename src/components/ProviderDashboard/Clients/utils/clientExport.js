// src/components/ProviderDashboard/Clients/utils/clientExport.js

/**
 * Export clients to CSV
 */
export const exportToCSV = (clients, jobs) => {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Total Spent",
    "Jobs Count",
    "Status",
    "Last Job Date",
    "Tags",
  ];

  const rows = clients.map(client => {
    const clientJobs = jobs.filter(j => j.customer_id === client.id);
    const totalSpent = clientJobs
      .filter(j => j.status === "completed")
      .reduce((sum, j) => sum + (j.total || 0), 0);

    const lastJob = clientJobs.length > 0 
      ? new Date(clientJobs[0].created_at).toLocaleDateString()
      : "N/A";

    return [
      client.full_name || "N/A",
      client.email || "N/A",
      client.phone || "N/A",
      `$${totalSpent.toFixed(2)}`,
      clientJobs.length,
      client.status || "Active",
      lastJob,
      (client.tags || []).join("; "),
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clients-export-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Export client jobs to CSV
 */
export const exportClientJobsToCSV = (client, jobs) => {
  const headers = [
    "Date",
    "Service",
    "Status",
    "Amount",
    "Notes",
  ];

  const rows = jobs.map(job => [
    new Date(job.created_at).toLocaleDateString(),
    job.service_name || "N/A",
    job.status || "N/A",
    `$${(job.total || 0).toFixed(2)}`,
    job.notes || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${client.full_name}-jobs-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
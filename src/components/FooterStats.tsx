
import React from "react";
import DashboardStats from "@/components/DashboardStats";

export default function FooterStats({ complaints }: { complaints: any[] }) {
  return (
    <div className="max-w-3xl mx-auto w-full mb-4">
      <DashboardStats complaints={complaints} />
    </div>
  );
}

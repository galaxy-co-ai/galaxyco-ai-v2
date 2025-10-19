/**
 * Data Management Hub - GalaxyCo.ai 2.0
 * Exports, Imports, Audit Logs
 * October 19, 2025
 */

"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Download,
  Upload,
  FileText,
  ChevronRight,
  Database,
} from "lucide-react";

export default function DataHub() {
  const dataSections = [
    {
      title: "Exports",
      href: "/data/exports",
      icon: Download,
      description: "Export data and generate reports",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Imports",
      href: "/data/imports",
      icon: Upload,
      description: "Import data from external sources",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Audit Log",
      href: "/data/audit-log",
      icon: FileText,
      description: "View system activity and changes",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Data Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Export, import, and audit your data
            </p>
          </div>
          <Database className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {dataSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

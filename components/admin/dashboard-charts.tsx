"use client";

import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});

interface DashboardChartsProps {
  data: { date: string; amount: number }[];
  total: number;
}

export function DashboardCharts({ data, total }: DashboardChartsProps) {
  const labels = data.map((d) => d.date);
  const amounts = data.map((d) => d.amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Donations",
        data: amounts,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₦${(context.raw as number).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₦${(value as number).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="rounded-lg border border-border/40 bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Donations This Month</h2>
        <p className="text-2xl font-bold text-primary">
          ₦{total.toLocaleString()}
        </p>
      </div>

      <div className="h-64">
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No donations this month
          </div>
        )}
      </div>
    </div>
  );
}

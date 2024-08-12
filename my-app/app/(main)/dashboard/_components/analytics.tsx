"use client";

import React from "react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book } from "@prisma/client";

interface AnalyticsProp {
  totals: {
    bookings: Book[] | null;
    completed: Book[] | null;
  };
  notConfirmBooks: Book[];
}

const chartConfig = {
  booked: {
    label: "Booked",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-4))",
  },
  totalSales: {
    label: "Total Sales",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const config = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const Analytics = ({ totals, notConfirmBooks }: AnalyticsProp) => {
  const totalSales = totals.completed?.reduce(
    (accumulator, item) => accumulator + item.price,
    0
  );

  const dashboard = [
    {
      name: "Booked",
      total: totals.bookings?.length,
      fill: "var(--color-booked)",
    },
    {
      name: "Pending",
      total: notConfirmBooks?.length,
      fill: "var(--color-pending)",
    },
    {
      name: "Completed",
      total: totals.completed?.length,
      fill: "var(--color-completed)",
    },
    {
      name: "Total Sales",
      total: totalSales,
      fill: "var(--color-totalSales)",
    },
  ];

  const startDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  );
  const endDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  const filteredBTotalsByMonth = totals.completed?.filter((item) => {
    const createdAt = new Date(item.createdAt);
    return createdAt >= startDate && createdAt <= endDate;
  });

  const combinedTotalsByDate = filteredBTotalsByMonth?.reduce((acc, item) => {
    const date = item.createdAt.toLocaleDateString("en-US", {
      dateStyle: "short",
    });
    if (!acc[date]) {
      acc[date] = { date, totalPrice: 0, count: 0 };
    }
    acc[date].totalPrice += item.price;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { date: string; totalPrice: number; count: number }>);

  const chartData = combinedTotalsByDate
    ? Object.values(combinedTotalsByDate).map((item) => ({
        date: item.date,
        total: item.totalPrice,
        count: item.count,
        fill: "var(--color-completed)",
      }))
    : [];

  return (
    <div className="mt-14">
      <h1 className="text-3xl font-bold mb-5">Analytics</h1>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>Booked, Pending and Completed</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={dashboard}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="total"
                  fill="var(--color-desktop)"
                  radius={8}
                  activeIndex={2}
                  activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke={props.payload.fill}
                      />
                    );
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Showing totals of Booked, Pending and Completed
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Area Chart - Interactive</CardTitle>
              <CardDescription>
                Showing total competed bookings this month.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={config}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="total"
                  type="natural"
                  fill="url(#fillDesktop)"
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

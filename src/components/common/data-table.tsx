"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  title,
  columns,
  data,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  const alignClass = (align?: string) =>
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-[#1E2942] dark:bg-[#121A2E]">
      {title && (
        <CardHeader className="border-b border-gray-100 dark:border-white/[0.04]">
          <CardTitle className="text-sm font-bold text-gray-900 sm:text-base dark:text-gray-200">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : "p-0"}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-left text-xs text-gray-500 dark:border-[#1E2942] dark:bg-white/[0.02] dark:text-gray-500">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 py-3 font-medium sm:px-5 sm:py-3.5 ${alignClass(col.align)} ${
                      col.hideOnMobile ? "hidden sm:table-cell" : ""
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={`border-b border-gray-100 transition-colors last:border-0 dark:border-[#1E2942]/50 ${
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                      : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-3 sm:px-5 ${alignClass(col.align)} ${
                        col.hideOnMobile ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

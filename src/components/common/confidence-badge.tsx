import { Badge } from "@/components/ui/badge";

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  if (confidence >= 95) {
    return (
      <Badge className="border-0 bg-emerald-100 text-xs text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
        {confidence}%
      </Badge>
    );
  }
  if (confidence >= 80) {
    return (
      <Badge className="border-0 bg-yellow-100 text-xs text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400">
        {confidence}%
      </Badge>
    );
  }
  return (
    <Badge className="border-0 bg-red-100 text-xs text-red-600 dark:bg-red-500/15 dark:text-red-400">
      {confidence}%
    </Badge>
  );
}

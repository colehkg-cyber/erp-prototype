interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-500">{description}</p>
    </div>
  );
}

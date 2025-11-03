
interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="py-10 md:py-12 bg-card border-b">
      <div className="container mx-auto px-5 md:px-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">{title}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  );
}

    
interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="py-16 md:py-20 bg-card border-b">
      <div className="container max-w-screen-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">{title}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  );
}

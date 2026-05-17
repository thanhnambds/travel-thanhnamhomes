export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="bg-white">
      <div className="container-page py-10 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-coral">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-brand-ink">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="bg-white">
      <div className="container-page py-16 md:py-24">
        <p className="mono-label text-sm uppercase text-brand-coral">{eyebrow}</p>
        <h1 className="display-type mt-6 max-w-5xl text-6xl font-normal leading-none text-brand-primary md:text-7xl">{title}</h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-brand-slate">{description}</p>
      </div>
    </section>
  );
}

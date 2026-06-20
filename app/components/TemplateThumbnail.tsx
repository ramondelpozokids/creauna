'use client';

import { useState } from 'react';
import { templateImageUrl, categoryFallbackDataUrl } from '../lib/templateImages';
import type { TemplateCategory } from '../data/templates';

type Props = {
  slug: string;
  name: string;
  categoryKey: TemplateCategory;
  className?: string;
};

export default function TemplateThumbnail({ slug, name, categoryKey, className = '' }: Props) {
  const [src, setSrc] = useState(() => templateImageUrl(slug));

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setSrc(categoryFallbackDataUrl(categoryKey, name))}
      className={className}
    />
  );
}

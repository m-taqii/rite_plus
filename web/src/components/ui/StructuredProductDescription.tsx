'use client';

import React, { useMemo } from 'react';

interface StructuredProductDescriptionProps {
  description: string;
  fallbackMetadata?: {
    name?: string;
    genericName?: string;
    manufacturer?: string;
    form?: string;
    dosage?: string;
    packSize?: string;
  };
  className?: string;
}

type ParsedBlock =
  | { type: 'key_value'; key: string; value: string }
  | { type: 'heading'; text: string }
  | { type: 'bullet_list'; items: string[] }
  | { type: 'paragraph'; text: string };

function formatInlineText(text: string) {
  // 1. Support markdown **bold**
  if (text.includes('**')) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-gray-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  // 2. Highlight leading all-caps product phrase (e.g. "CLAIR SOFT OIL FREE ACNE WASH,")
  const leadingCapsMatch = text.match(/^([A-Z0-9\s/&-]{4,50},?)\s+(.*)$/);
  if (leadingCapsMatch && leadingCapsMatch[1].trim().length > 3) {
    return (
      <>
        <strong className="font-bold text-gray-950">
          {leadingCapsMatch[1]}
        </strong>{' '}
        <span>{leadingCapsMatch[2]}</span>
      </>
    );
  }

  return text;
}

export default function StructuredProductDescription({
  description,
  fallbackMetadata,
  className = '',
}: StructuredProductDescriptionProps) {
  const blocks = useMemo(() => {
    if (!description || !description.trim()) {
      return [];
    }

    const lines = description.split(/\r?\n/);
    const parsed: ParsedBlock[] = [];
    let currentBulletList: string[] | null = null;

    const flushBulletList = () => {
      if (currentBulletList && currentBulletList.length > 0) {
        parsed.push({ type: 'bullet_list', items: [...currentBulletList] });
        currentBulletList = null;
      }
    };

    // Common key-value patterns
    const kvPattern =
      /^(Product Name|Ingredients|Product Type|Pack Size|Company|Manufacturer|Brand|Used For|Usage|Indication|Indications|Composition|Active Formula|Strength|Form|Dosage|Warnings|Storage|Precautions|Prescription):\s*(.*)$/i;

    // Generic key-value pattern (Word(s) ending with colon, followed by value)
    const genericKvPattern = /^([A-Z][A-Za-z0-9\s/&-]{1,32}):\s*(.+)$/;

    // Standalone headings like "Product Detail", "How to use:", "Overview", "Precautions"
    const headingPattern =
      /^(Product Detail|Product Details|Product Description|How to use:?|Directions for use:?|Directions:?|Clinical Overview:?|Precautions:?|Storage Conditions:?|Side Effects:?|Key Benefits:?|Warnings:?)$/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        flushBulletList();
        continue;
      }

      // 1. Check if bullet point
      const bulletMatch = line.match(/^([•\-\*–—]|\d+\.|\d+\))\s*(.+)$/);
      if (bulletMatch) {
        if (!currentBulletList) currentBulletList = [];
        currentBulletList.push(bulletMatch[2].trim());
        continue;
      } else {
        flushBulletList();
      }

      // 2. Check if heading (either explicitly recognized heading, or a short line ending with colon with no value)
      if (headingPattern.test(line) || (/^[A-Za-z0-9\s/&-]{2,40}:$/.test(line) && !line.toLowerCase().startsWith('http'))) {
        parsed.push({ type: 'heading', text: line });
        continue;
      }

      // 3. Check if specific or generic Key-Value pair
      const specificMatch = line.match(kvPattern);
      if (specificMatch) {
        const key = specificMatch[1].trim();
        const value = specificMatch[2].trim();
        if (value) {
          parsed.push({ type: 'key_value', key, value });
        } else {
          parsed.push({ type: 'heading', text: key });
        }
        continue;
      }

      const genericMatch = line.match(genericKvPattern);
      if (genericMatch && !genericMatch[1].toLowerCase().includes('http')) {
        parsed.push({
          type: 'key_value',
          key: genericMatch[1].trim(),
          value: genericMatch[2].trim(),
        });
        continue;
      }

      // 4. Default to standard paragraph
      parsed.push({ type: 'paragraph', text: line });
    }

    flushBulletList();
    return parsed;
  }, [description]);

  if (blocks.length === 0) {
    return (
      <div className={`text-sm text-gray-500 leading-relaxed ${className}`}>
        No detailed description provided for this product.
      </div>
    );
  }

  return (
    <div className={`space-y-3.5 text-[14px] sm:text-[15px] font-sans leading-[1.65] text-gray-800 ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'key_value') {
          return (
            <p key={index} className="leading-relaxed text-gray-800">
              <strong className="font-bold text-gray-950 mr-1.5 select-text">
                {block.key}:
              </strong>
              <span className="text-gray-700 font-normal wrap-break-word">
                {formatInlineText(block.value)}
              </span>
            </p>
          );
        }

        if (block.type === 'heading') {
          return (
            <h4
              key={index}
              className="text-[15px] sm:text-base font-bold text-gray-950 pt-2 pb-0.5 tracking-tight first:pt-0"
            >
              {block.text}
            </h4>
          );
        }

        if (block.type === 'bullet_list') {
          return (
            <ul key={index} className="space-y-1.5 pl-1 my-2 list-none">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-gray-800 leading-relaxed"
                >
                  <span className="text-gray-950 font-bold select-none text-base leading-4 mt-0.5">
                    •
                  </span>
                  <span>{formatInlineText(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="text-[14px] sm:text-[15px] text-gray-800 leading-relaxed">
              {formatInlineText(block.text)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

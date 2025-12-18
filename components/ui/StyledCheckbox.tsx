// components/ui/StyledCheckbox.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface StyledCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  linkUrl?: string;
  linkText?: string;
}

export const StyledCheckbox = ({ id, checked, onChange, label, linkUrl, linkText }: StyledCheckboxProps) => {
  return (
    <div className="flex items-start gap-3 my-3">
      {/* Stilurile specifice Uiverse */}
      <style jsx>{`
        .check {
          cursor: pointer;
          position: relative;
          margin: 0;
          width: 18px;
          height: 18px;
          -webkit-tap-highlight-color: transparent;
          transform: translate3d(0, 0, 0);
          flex-shrink: 0; /* Previne turtirea checkbox-ului */
        }
        .check:before {
          content: "";
          position: absolute;
          top: -15px;
          left: -15px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(34,50,84,0.03);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .check svg {
          position: relative;
          z-index: 1;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke: #c8ccd4;
          stroke-width: 1.5;
          transform: translate3d(0, 0, 0);
          transition: all 0.2s ease;
        }
        .check svg path {
          stroke-dasharray: 60;
          stroke-dashoffset: 0;
        }
        .check svg polyline {
          stroke-dasharray: 22;
          stroke-dashoffset: 66;
        }
        .check:hover:before {
          opacity: 1;
        }
        .check:hover svg {
          stroke: #4285f4;
        }
        /* Logica de check bazată pe input */
        .custom-input:checked + .check svg {
          stroke: #4285f4;
        }
        .custom-input:checked + .check svg path {
          stroke-dashoffset: 60;
          transition: all 0.3s linear;
        }
        .custom-input:checked + .check svg polyline {
          stroke-dashoffset: 42;
          transition: all 0.2s linear;
          transition-delay: 0.15s;
        }
      `}</style>

      <div className="relative pt-1">
        <input 
          type="checkbox" 
          id={id} 
          className="custom-input" 
          style={{ display: 'none' }} 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id} className="check">
          <svg width="18px" height="18px" viewBox="0 0 18 18">
            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
            <polyline points="1 9 7 14 15 4"></polyline>
          </svg>
        </label>
      </div>
      
      <label htmlFor={id} className="text-sm text-muted-foreground cursor-pointer select-none leading-tight">
        {label} {' '}
        {linkUrl && linkText && (
          <Link href={linkUrl} target="_blank" className="text-primary hover:underline font-medium">
            {linkText}
          </Link>
        )}
      </label>
    </div>
  );
};
'use client';

import React from 'react';

const TECH_ITEMS = [
  {
    name: 'git',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.59 13.41L10.59 21.41C11.37 22.19 12.63 22.19 13.41 21.41L21.41 13.41C22.19 12.63 22.19 11.37 21.41 10.59L13.41 2.59C12.63 1.81 11.37 1.81 10.59 2.59L8.41 4.77L10.93 7.29C11.53 7.11 12.22 7.25 12.71 7.74C13.34 8.37 13.44 9.31 13.04 10.04L15.54 12.54C16.27 12.14 17.21 12.24 17.84 12.87C18.62 13.65 18.62 14.91 17.84 15.69C17.06 16.47 15.8 16.47 15.02 15.69C14.43 15.1 14.29 14.23 14.61 13.53L12.33 11.25V16.71C12.57 16.85 12.78 17.05 12.92 17.31C13.43 18.25 13.08 19.43 12.14 19.94C11.2 20.45 10.02 20.1 9.51 19.16C9 18.22 9.35 17.04 10.29 16.53C10.64 16.34 11.04 16.28 11.41 16.34V10.87C11.04 10.93 10.64 10.87 10.29 10.68C9.69 10.36 9.31 9.77 9.25 9.13L6.71 6.59L2.59 10.71C1.81 11.49 1.81 12.75 2.59 13.41Z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.438 21.8 8.207 23.387C8.807 23.498 9.025 23.127 9.025 22.812C9.025 22.532 9.015 21.792 9.01 20.808C5.672 21.533 4.969 19.2 4.969 19.2C4.423 17.812 3.637 17.443 3.637 17.443C2.548 16.698 3.719 16.713 3.719 16.713C4.922 16.798 5.556 17.953 5.556 17.953C6.626 19.785 8.364 19.255 9.05 18.948C9.158 18.173 9.468 17.643 9.81 17.343C7.145 17.04 4.343 16.01 4.343 11.415C4.343 10.105 4.81 9.035 5.578 8.198C5.454 7.893 5.044 6.668 5.696 5.018C5.696 5.018 6.704 4.695 8.997 6.25C9.954 5.983 10.98 5.85 12 5.845C13.02 5.85 14.046 5.983 15.006 6.25C17.297 4.695 18.303 5.018 18.303 5.018C18.957 6.668 18.547 7.893 18.424 8.198C19.194 9.035 19.657 10.105 19.657 11.415C19.657 16.023 16.85 17.035 14.175 17.333C14.607 17.705 14.992 18.438 14.992 19.562C14.992 21.173 14.978 22.472 14.978 22.812C14.978 23.13 15.192 23.507 15.8 23.385C20.562 21.797 24 17.308 24 12C24 5.37 18.627 0 12 0Z" />
      </svg>
    ),
  },
  {
    name: 'Flutter',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.314 0L2.3 12L6.071 15.771L21.856 0H14.314ZM14.314 10.771L8.714 16.371L14.314 21.971L21.856 21.971L16.256 16.371L21.856 10.771H14.314Z" />
      </svg>
    ),
  },
  {
    name: 'Dart',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.1 4.1L12 0l7.9 4.1L24 12l-4.1 7.9L12 24l-7.9-4.1L0 12l4.1-7.9zm0.8 0.8v14.2L12 22.7l7.1-3.6V4.9L12 1.3 4.9 4.9z" />
      </svg>
    ),
  },
  {
    name: 'React',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15">
        <ellipse cx="12" cy="12" rx="10" ry="4.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'node',
    badge: 'JS',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2ZM11.2 18.5L5.5 15.2V11.2L9.2 13.3V15.4L11.2 16.5V18.5ZM12.8 18.5V16.5L14.8 15.4V13.3L18.5 11.2V15.2L12.8 18.5ZM18.5 9.5L14.8 11.6L12 10L14.8 8.4L18.5 9.5ZM12 8.3L9.2 6.7L12 5.1L14.8 6.7L12 8.3ZM5.5 9.5L9.2 8.4L12 10L9.2 11.6L5.5 9.5Z" />
      </svg>
    ),
  },
  {
    name: 'mongoDB',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C11.5 0.5 7 5.5 7 12C7 17.5 10.5 22 12 24C13.5 22 17 17.5 17 12C17 5.5 12.5 0.5 12 0ZM12 2.5C12.3 3.5 15.5 8 15.5 12C15.5 16 13 19.5 12 21.2V2.5Z" />
      </svg>
    ),
  },
  {
    name: 'python',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.914 0C8.58 0 8.789 1.455 8.789 1.455l.006 1.51h3.188v.455H6.287S4.1 3.167 4.1 6.518c0 3.35 1.905 3.24 1.905 3.24h1.138V8.143s-.062-1.905 1.874-1.905h3.226s1.812.029 1.812-1.782V1.812S14.28 0 11.914 0zm-1.72 1.026a.637.637 0 1 1 0 1.274.637.637 0 0 1 0-1.274zM17.713 5.253s-1.138.03-1.138 1.615v1.615h-3.226s-1.812-.03-1.812 1.782v2.793s-.228 1.812 2.138 1.812c3.334 0 3.125-1.455 3.125-1.455l-.006-1.51h-3.188v-.455h5.727s2.187.253 2.187-3.098c0-3.35-1.905-3.24-1.905-3.24h-1.138v1.615s.062 1.905-1.874 1.905h-3.226s-1.812-.029-1.812 1.782v2.793s-.228 1.812 2.138 1.812c2.366 0 1.905-1.812 1.905-1.812v-1.615h1.138s1.905.11 1.905-3.24c0-3.351-2.187-3.098-2.187-3.098h-.569zm-1.898 9.388a.637.637 0 1 1 0 1.274.637.637 0 0 1 0-1.274z" />
      </svg>
    ),
  },
];

export function FloatingTechRow() {
  return (
    <div className="w-full overflow-hidden pointer-events-none select-none opacity-90 py-2">
      {/* Seamless Marquee Track */}
      <div className="animate-marquee flex items-center gap-14 sm:gap-20 md:gap-28 lg:gap-32">
        {/* Set 1 */}
        {TECH_ITEMS.map((item, idx) => (
          <div key={`tech-1-${idx}`} className="flex flex-col items-center justify-center gap-1.5 text-[#bbf200] flex-shrink-0">
            {item.icon}
            <span className="font-heading font-black text-xs sm:text-sm md:text-base tracking-tight text-[#bbf200]">
              {item.name}
              {item.badge && (
                <span className="text-[10px] font-mono border border-[#bbf200]/70 rounded px-1 py-0.2 ml-1 align-middle">
                  {item.badge}
                </span>
              )}
            </span>
          </div>
        ))}

        {/* Set 2 (Duplicate for infinite seamless loop) */}
        {TECH_ITEMS.map((item, idx) => (
          <div key={`tech-2-${idx}`} className="flex flex-col items-center justify-center gap-1.5 text-[#bbf200] flex-shrink-0">
            {item.icon}
            <span className="font-heading font-black text-xs sm:text-sm md:text-base tracking-tight text-[#bbf200]">
              {item.name}
              {item.badge && (
                <span className="text-[10px] font-mono border border-[#bbf200]/70 rounded px-1 py-0.2 ml-1 align-middle">
                  {item.badge}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

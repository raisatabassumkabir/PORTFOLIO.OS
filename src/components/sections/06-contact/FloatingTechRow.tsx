'use client';

import React from 'react';

const TECH_ITEMS = [
  {
    name: 'git',
    icon: (
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.59 13.41L10.59 21.41C11.37 22.19 12.63 22.19 13.41 21.41L21.41 13.41C22.19 12.63 22.19 11.37 21.41 10.59L13.41 2.59C12.63 1.81 11.37 1.81 10.59 2.59L8.41 4.77L10.93 7.29C11.53 7.11 12.22 7.25 12.71 7.74C13.34 8.37 13.44 9.31 13.04 10.04L15.54 12.54C16.27 12.14 17.21 12.24 17.84 12.87C18.62 13.65 18.62 14.91 17.84 15.69C17.06 16.47 15.8 16.47 15.02 15.69C14.43 15.1 14.29 14.23 14.61 13.53L12.33 11.25V16.71C12.57 16.85 12.78 17.05 12.92 17.31C13.43 18.25 13.08 19.43 12.14 19.94C11.2 20.45 10.02 20.1 9.51 19.16C9 18.22 9.35 17.04 10.29 16.53C10.64 16.34 11.04 16.28 11.41 16.34V10.87C11.04 10.93 10.64 10.87 10.29 10.68C9.69 10.36 9.31 9.77 9.25 9.13L6.71 6.59L2.59 10.71C1.81 11.49 1.81 12.75 2.59 13.41Z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    icon: (
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.438 21.8 8.207 23.387C8.807 23.498 9.025 23.127 9.025 22.812C9.025 22.532 9.015 21.792 9.01 20.808C5.672 21.533 4.969 19.2 4.969 19.2C4.423 17.812 3.637 17.443 3.637 17.443C2.548 16.698 3.719 16.713 3.719 16.713C4.922 16.798 5.556 17.953 5.556 17.953C6.626 19.785 8.364 19.255 9.05 18.948C9.158 18.173 9.468 17.643 9.81 17.343C7.145 17.04 4.343 16.01 4.343 11.415C4.343 10.105 4.81 9.035 5.578 8.198C5.454 7.893 5.044 6.668 5.696 5.018C5.696 5.018 6.704 4.695 8.997 6.25C9.954 5.983 10.98 5.85 12 5.845C13.02 5.85 14.046 5.983 15.006 6.25C17.297 4.695 18.303 5.018 18.303 5.018C18.957 6.668 18.547 7.893 18.424 8.198C19.194 9.035 19.657 10.105 19.657 11.415C19.657 16.023 16.85 17.035 14.175 17.333C14.607 17.705 14.992 18.438 14.992 19.562C14.992 21.173 14.978 22.472 14.978 22.812C14.978 23.13 15.192 23.507 15.8 23.385C20.562 21.797 24 17.308 24 12C24 5.37 18.627 0 12 0Z" />
      </svg>
    ),
  },
  {
    name: 'Flutter',
    icon: (
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.314 0L2.3 12L6.071 15.771L21.856 0H14.314ZM14.314 10.771L8.714 16.371L14.314 21.971L21.856 21.971L16.256 16.371L21.856 10.771H14.314Z" />
      </svg>
    ),
  },
  {
    name: 'Dart',
    icon: (
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.1 4.1L12 0l7.9 4.1L24 12l-4.1 7.9L12 24l-7.9-4.1L0 12l4.1-7.9zm0.8 0.8v14.2L12 22.7l7.1-3.6V4.9L12 1.3 4.9 4.9z" />
      </svg>
    ),
  },
  {
    name: 'React',
    icon: (
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15">
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
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2ZM11.2 18.5L5.5 15.2V11.2L9.2 13.3V15.4L11.2 16.5V18.5ZM12.8 18.5V16.5L14.8 15.4V13.3L18.5 11.2V15.2L12.8 18.5ZM18.5 9.5L14.8 11.6L12 10L14.8 8.4L18.5 9.5ZM12 8.3L9.2 6.7L12 5.1L14.8 6.7L12 8.3ZM5.5 9.5L9.2 8.4L12 10L9.2 11.6L5.5 9.5Z" />
      </svg>
    ),
  },
  {
    name: 'mongoDB',
    icon: (
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C11.5 0.5 7 5.5 7 12C7 17.5 10.5 22 12 24C13.5 22 17 17.5 17 12C17 5.5 12.5 0.5 12 0ZM12 2.5C12.3 3.5 15.5 8 15.5 12C15.5 16 13 19.5 12 21.2V2.5Z" />
      </svg>
    ),
  },
  {
    name: 'python',
    icon: (
      <svg className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#bbf200] drop-shadow-[0_0_6px_rgba(187,242,0,0.25)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
      </svg>
    ),
  },
];

export function FloatingTechRow() {
  return (
    <div className="w-full overflow-hidden pointer-events-none select-none opacity-90 py-2 flex">
      {/* Seamless Infinite Marquee Track */}
      <div className="flex shrink-0 animate-marquee items-center">
        {/* Track Half 1 */}
        <div className="flex shrink-0 items-center gap-16 sm:gap-20 md:gap-24 lg:gap-28 pr-16 sm:pr-20 md:pr-24 lg:pr-28">
          {TECH_ITEMS.map((item, idx) => (
            <div key={`tech-1-${idx}`} className="flex flex-col items-center justify-center gap-2 text-[#bbf200] flex-shrink-0">
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

        {/* Track Half 2 (Exact duplicate for seamless looping without jump) */}
        <div className="flex shrink-0 items-center gap-16 sm:gap-20 md:gap-24 lg:gap-28 pr-16 sm:pr-20 md:pr-24 lg:pr-28" aria-hidden="true">
          {TECH_ITEMS.map((item, idx) => (
            <div key={`tech-2-${idx}`} className="flex flex-col items-center justify-center gap-2 text-[#bbf200] flex-shrink-0">
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
    </div>
  );
}

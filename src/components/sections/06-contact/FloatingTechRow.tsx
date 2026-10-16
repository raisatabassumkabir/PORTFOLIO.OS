'use client';

import React from 'react';

export function FloatingTechRow() {
  return (
    <div className="w-full flex items-center justify-between px-6 sm:px-12 md:px-16 text-[#bbf200] opacity-90 pointer-events-none select-none">
      {/* Left 3 Tech Brands */}
      <div className="flex items-center gap-8 sm:gap-14 md:gap-20">
        {/* git */}
        <div className="flex items-center gap-2 text-[#bbf200]">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.59 13.41L10.59 21.41C11.37 22.19 12.63 22.19 13.41 21.41L21.41 13.41C22.19 12.63 22.19 11.37 21.41 10.59L13.41 2.59C12.63 1.81 11.37 1.81 10.59 2.59L8.41 4.77L10.93 7.29C11.53 7.11 12.22 7.25 12.71 7.74C13.34 8.37 13.44 9.31 13.04 10.04L15.54 12.54C16.27 12.14 17.21 12.24 17.84 12.87C18.62 13.65 18.62 14.91 17.84 15.69C17.06 16.47 15.8 16.47 15.02 15.69C14.43 15.1 14.29 14.23 14.61 13.53L12.33 11.25V16.71C12.57 16.85 12.78 17.05 12.92 17.31C13.43 18.25 13.08 19.43 12.14 19.94C11.2 20.45 10.02 20.1 9.51 19.16C9 18.22 9.35 17.04 10.29 16.53C10.64 16.34 11.04 16.28 11.41 16.34V10.87C11.04 10.93 10.64 10.87 10.29 10.68C9.69 10.36 9.31 9.77 9.25 9.13L6.71 6.59L2.59 10.71C1.81 11.49 1.81 12.75 2.59 13.41Z" />
          </svg>
          <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight lowercase">
            git
          </span>
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-2 text-[#bbf200]">
          <svg className="w-7 h-7 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.438 21.8 8.207 23.387C8.807 23.498 9.025 23.127 9.025 22.812C9.025 22.532 9.015 21.792 9.01 20.808C5.672 21.533 4.969 19.2 4.969 19.2C4.423 17.812 3.637 17.443 3.637 17.443C2.548 16.698 3.719 16.713 3.719 16.713C4.922 16.798 5.556 17.953 5.556 17.953C6.626 19.785 8.364 19.255 9.05 18.948C9.158 18.173 9.468 17.643 9.81 17.343C7.145 17.04 4.343 16.01 4.343 11.415C4.343 10.105 4.81 9.035 5.578 8.198C5.454 7.893 5.044 6.668 5.696 5.018C5.696 5.018 6.704 4.695 8.997 6.25C9.954 5.983 10.98 5.85 12 5.845C13.02 5.85 14.046 5.983 15.006 6.25C17.297 4.695 18.303 5.018 18.303 5.018C18.957 6.668 18.547 7.893 18.424 8.198C19.194 9.035 19.657 10.105 19.657 11.415C19.657 16.023 16.85 17.035 14.175 17.333C14.607 17.705 14.992 18.438 14.992 19.562C14.992 21.173 14.978 22.472 14.978 22.812C14.978 23.13 15.192 23.507 15.8 23.385C20.562 21.797 24 17.308 24 12C24 5.37 18.627 0 12 0Z" />
          </svg>
          <span className="font-heading font-bold text-sm sm:text-lg tracking-tight">
            GitHub
          </span>
        </div>

        {/* Flutter */}
        <div className="flex items-center gap-2 text-[#bbf200]">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.314 0L2.3 12L6.071 15.771L21.856 0H14.314ZM14.314 10.771L8.714 16.371L14.314 21.971L21.856 21.971L16.256 16.371L21.856 10.771H14.314Z" />
          </svg>
        </div>
      </div>

      {/* Right 3 Tech Brands */}
      <div className="flex items-center gap-8 sm:gap-14 md:gap-20">
        {/* Node.js */}
        <div className="flex items-center gap-2 text-[#bbf200]">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2ZM11.2 18.5L5.5 15.2V11.2L9.2 13.3V15.4L11.2 16.5V18.5ZM12.8 18.5V16.5L14.8 15.4V13.3L18.5 11.2V15.2L12.8 18.5ZM18.5 9.5L14.8 11.6L12 10L14.8 8.4L18.5 9.5ZM12 8.3L9.2 6.7L12 5.1L14.8 6.7L12 8.3ZM5.5 9.5L9.2 8.4L12 10L9.2 11.6L5.5 9.5Z" />
          </svg>
          <span className="font-heading font-bold text-sm sm:text-base tracking-tight">
            node<span className="text-[10px] font-mono border border-[#bbf200]/70 rounded px-0.5 ml-1">JS</span>
          </span>
        </div>

        {/* MongoDB */}
        <div className="flex items-center gap-1.5 text-[#bbf200]">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C11.5 0.5 7 5.5 7 12C7 17.5 10.5 22 12 24C13.5 22 17 17.5 17 12C17 5.5 12.5 0.5 12 0ZM12 2.5C12.3 3.5 15.5 8 15.5 12C15.5 16 13 19.5 12 21.2V2.5Z" />
          </svg>
          <span className="font-heading font-medium text-xs sm:text-sm tracking-tight lowercase">
            mongoDB
          </span>
        </div>

        {/* Python */}
        <div className="flex items-center gap-1.5 text-[#bbf200]">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.91 0C5.98 0 6.35 2.58 6.35 2.58L6.36 5.25H12V6.08H3.83C3.83 6.08 0 5.64 0 11.59C0 17.54 3.34 17.27 3.34 17.27H5.34V14.47C5.34 14.47 5.23 11.1 8.64 11.1H14.18C14.18 11.1 17.38 11.2 17.38 8.08V2.78C17.38 2.78 17.82 0 11.91 0ZM8.96 1.7C9.53 1.7 10 2.17 10 2.74C10 3.31 9.53 3.78 8.96 3.78C8.39 3.78 7.92 3.31 7.92 2.74C7.92 2.17 8.39 1.7 8.96 1.7ZM12.09 24C18.02 24 17.65 21.42 17.65 21.42L17.64 18.75H12V17.92H20.17C20.17 17.92 24 18.36 24 12.41C24 6.46 20.66 6.73 20.66 6.73H18.66V9.53C18.66 9.53 18.77 12.9 15.36 12.9H9.82C9.82 12.9 6.62 12.8 6.62 15.92V21.22C6.62 21.22 6.18 24 12.09 24ZM15.04 22.3C14.47 22.3 14 21.83 14 21.26C14 20.69 14.47 20.22 15.04 20.22C15.61 20.22 16.08 20.69 16.08 21.26C16.08 21.83 15.61 22.3 15.04 22.3Z" />
          </svg>
          <span className="font-heading font-medium text-xs sm:text-sm tracking-tight lowercase">
            python
          </span>
        </div>
      </div>
    </div>
  );
}

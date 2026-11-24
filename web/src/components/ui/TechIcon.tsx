import React from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiJsonwebtokens,
  SiGit,
  SiGithub,
  SiVercel,
  SiRender,
  SiLinux,
  SiFirebase,
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiJupyter,
  SiC,
  SiCplusplus,
  SiPostgresql,
  SiThreedotjs,
  SiVite,
  SiDaisyui,
  SiCloudinary,
  SiFramer,
  SiMysql,
  SiGooglegemini,
  SiVitest,
  SiStripe,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import {
  TbDatabase,
  TbApi,
  TbShieldLock,
  TbCode,
  TbChartLine,
} from "react-icons/tb";

interface TechConfig {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number | string }>;
  color: string;
}

const TECH_MAP: Record<string, TechConfig> = {
  // Frontend
  react: { icon: SiReact, color: "#61DAFB" },
  "react 19": { icon: SiReact, color: "#61DAFB" },
  nextjs: { icon: SiNextdotjs, color: "#E2E8F0" },
  "next.js": { icon: SiNextdotjs, color: "#E2E8F0" },
  "next.js 15": { icon: SiNextdotjs, color: "#E2E8F0" },
  "next.js 16": { icon: SiNextdotjs, color: "#E2E8F0" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  tailwindcss: { icon: SiTailwindcss, color: "#38BDF8" },
  "tailwind css": { icon: SiTailwindcss, color: "#38BDF8" },
  html5: { icon: SiHtml5, color: "#E34F26" },
  html: { icon: SiHtml5, color: "#E34F26" },
  css3: { icon: SiCss, color: "#2965F1" },
  css: { icon: SiCss, color: "#2965F1" },
  vite: { icon: SiVite, color: "#A855F7" },
  daisyui: { icon: SiDaisyui, color: "#1AD1A5" },
  "daisyui 5": { icon: SiDaisyui, color: "#1AD1A5" },
  "lucide react": { icon: TbCode, color: "#F43F5E" },
  "react three fiber": { icon: SiThreedotjs, color: "#E2E8F0" },
  "three.js": { icon: SiThreedotjs, color: "#E2E8F0" },
  threejs: { icon: SiThreedotjs, color: "#E2E8F0" },
  "framer motion": { icon: SiFramer, color: "#EC4899" },
  vitest: { icon: SiVitest, color: "#FCC72B" },
  stripe: { icon: SiStripe, color: "#635BFF" },
  zustand: { icon: TbCode, color: "#F59E0B" },

  // Backend
  nodejs: { icon: SiNodedotjs, color: "#22C55E" },
  "node.js": { icon: SiNodedotjs, color: "#22C55E" },
  node: { icon: SiNodedotjs, color: "#22C55E" },
  express: { icon: SiExpress, color: "#E2E8F0" },
  mongodb: { icon: SiMongodb, color: "#22C55E" },
  mongoose: { icon: SiMongodb, color: "#84CC16" },
  "rest apis": { icon: TbApi, color: "#F43F5E" },
  "rest api": { icon: TbApi, color: "#F43F5E" },
  "jwt auth": { icon: SiJsonwebtokens, color: "#D946EF" },
  jwt: { icon: SiJsonwebtokens, color: "#D946EF" },
  "better auth": { icon: TbShieldLock, color: "#A855F7" },
  "neon postgres": { icon: SiPostgresql, color: "#3B82F6" },
  postgres: { icon: SiPostgresql, color: "#3B82F6" },
  postgresql: { icon: SiPostgresql, color: "#3B82F6" },
  sql: { icon: TbDatabase, color: "#F59E0B" },
  mysql: { icon: SiMysql, color: "#0284C7" },
  "dexie (indexeddb)": { icon: TbDatabase, color: "#10B981" },
  dexie: { icon: TbDatabase, color: "#10B981" },
  indexeddb: { icon: TbDatabase, color: "#10B981" },
  "vercel edge functions": { icon: SiVercel, color: "#E2E8F0" },
  "vercel edge": { icon: SiVercel, color: "#E2E8F0" },
  cloudinary: { icon: SiCloudinary, color: "#3B82F6" },
  "gemini api": { icon: SiGooglegemini, color: "#8E75FF" },
  gemini: { icon: SiGooglegemini, color: "#8E75FF" },

  // Tools
  git: { icon: SiGit, color: "#F97316" },
  github: { icon: SiGithub, color: "#E2E8F0" },
  "vs code": { icon: VscVscode, color: "#007ACC" },
  vscode: { icon: VscVscode, color: "#007ACC" },
  vercel: { icon: SiVercel, color: "#E2E8F0" },
  render: { icon: SiRender, color: "#2DD4BF" },
  linux: { icon: SiLinux, color: "#FBBF24" },
  firebase: { icon: SiFirebase, color: "#F59E0B" },

  // ML & Data
  python: { icon: SiPython, color: "#38BDF8" },
  tensorflow: { icon: SiTensorflow, color: "#FB923C" },
  pytorch: { icon: SiPytorch, color: "#EF4444" },
  "scikit-learn": { icon: SiScikitlearn, color: "#F59E0B" },
  pandas: { icon: SiPandas, color: "#818CF8" },
  numpy: { icon: SiNumpy, color: "#60A5FA" },
  jupyter: { icon: SiJupyter, color: "#FB923C" },
  geopandas: { icon: SiPandas, color: "#818CF8" },
  matplotlib: { icon: TbChartLine, color: "#38BDF8" },
  c: { icon: SiC, color: "#94A3B8" },
  "c++": { icon: SiCplusplus, color: "#60A5FA" },
  cpp: { icon: SiCplusplus, color: "#60A5FA" },
};

function normalizeTechName(name: string): string {
  return name.trim().toLowerCase();
}

interface TechIconProps {
  name: string;
  size?: number | string;
  colored?: boolean;
  className?: string;
}

export function TechIcon({
  name,
  size = 14,
  colored = true,
  className = "",
}: TechIconProps) {
  // If this is a count badge like "+2", do not render an icon
  if (name.startsWith("+")) {
    return null;
  }

  const normalized = normalizeTechName(name);
  const config = TECH_MAP[normalized];

  if (!config) {
    // Subtle fallback code icon for any unlisted tech
    return (
      <TbCode
        size={size}
        className={`inline-block flex-shrink-0 opacity-70 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const IconComponent = config.icon;

  return (
    <IconComponent
      size={size}
      className={`inline-block flex-shrink-0 transition-colors ${className}`}
      style={colored ? { color: config.color } : undefined}
      aria-hidden="true"
    />
  );
}

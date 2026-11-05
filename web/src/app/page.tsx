/*
 * Home page (/) — one scrolling page with all six required sections.
 *
 * Hallmark editorial order (v2 redesign):
 *   TopBar, Hero, Projects (01), Skills (02), About (03), Education (04), Contact (05), Footer.
 *
 * This is a Server Component (no "use client" directive). Server Components
 * render on the server and send fully-formed HTML to the browser, so the
 * content is visible without JavaScript — PRD §5.5 requires this.
 *
 * The "use client" sections (TopBar, HeroSection, ContactSection) are
 * imported as Client Components inside this Server Component. Next.js
 * handles the boundary automatically.
 */

import { TopBar }          from "@/components/ui/TopBar";
import { SocialRail }      from "@/components/ui/SocialRail";
import { SectionRail }     from "@/components/ui/SectionRail";
import { HeroSection }     from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection }   from "@/components/sections/SkillsSection";
import { AboutSection }    from "@/components/sections/AboutSection";
import { EducationSection } from "@/components/sections/EducationSection";import { ContactSection }  from "@/components/sections/ContactSection";
import { Footer }          from "@/components/ui/Footer";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import {
  getProfile,
  getSkills,
  getProjects,
  getEducation,
} from "@/lib/api";

export default async function HomePage() {
  const [profile, skills, { featured, mlProjects, all }, education] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getProjects(),
      getEducation(),
    ]);

  return (
    <>
      {/* Sticky top navigation bar */}
      <TopBar profile={profile} />

      {/* Fixed vertical social icon rail (desktop only — left side) */}
      <SocialRail profile={profile} />

      {/* Fixed vertical section link rail (desktop only — right side) */}
      <SectionRail />

      <main>
        <HeroSection profile={profile} />
        <ProjectsSection
          featuredProjects={featured}
          mlProjects={mlProjects}
          totalPublished={all.filter((p) => p.status === "published").length}
        />
        <SkillsSection skills={skills} />
        <AboutSection profile={profile} />
        <EducationSection education={education} />
        <ContactSection profile={profile} />
      </main>

      <Footer profile={profile} />

      {/* Sticky bottom action bar on mobile only */}
      <MobileActionBar profile={profile} />
    </>
  );
}

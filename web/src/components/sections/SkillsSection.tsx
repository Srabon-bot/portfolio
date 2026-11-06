"use client";

/*
 * SkillsSection — rebalanced 2-column grid layout.
 *
 * Hiring-ready features:
 * - 4 balanced categories:
 *     1. Frontend (7)
 *     2. Backend & Database (7)
 *     3. Tooling & Deployment (6)
 *     4. AI/ML & Languages (9)
 * - Highlighted core MERN stack chips (MongoDB, Express, React, Node.js)
 * - MERN legend indicator under section subtitle
 * - Framer Motion stagger entrance respecting reduced-motion
 * - Hover border transition without blur or colored glow
 */

import { motion, type Variants } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

/* Category mapping from skill name to group title */
const SKILL_GROUP_MAP: Record<string, string> = {
  // Frontend (7)
  "React": "Frontend",
  "Next.js": "Frontend",
  "TypeScript": "Frontend",
  "JavaScript": "Frontend",
  "Tailwind CSS": "Frontend",
  "HTML5": "Frontend",
  "CSS3": "Frontend",

  // Backend & Database (7)
  "Node.js": "Backend & Database",
  "Express": "Backend & Database",
  "REST APIs": "Backend & Database",
  "JWT auth": "Backend & Database",
  "MongoDB": "Backend & Database",
  "SQL": "Backend & Database",
  "Firebase": "Backend & Database",

  // Tooling & Deployment (6)
  "Git": "Tooling & Deployment",
  "GitHub": "Tooling & Deployment",
  "VS Code": "Tooling & Deployment",
  "Linux": "Tooling & Deployment",
  "Vercel": "Tooling & Deployment",
  "Render": "Tooling & Deployment",

  // AI/ML & Languages (9)
  "Python": "AI/ML & Languages",
  "C": "AI/ML & Languages",
  "C++": "AI/ML & Languages",
  "TensorFlow": "AI/ML & Languages",
  "PyTorch": "AI/ML & Languages",
  "scikit-learn": "AI/ML & Languages",
  "Pandas": "AI/ML & Languages",
  "NumPy": "AI/ML & Languages",
  "Jupyter": "AI/ML & Languages",
};

const GROUP_ORDER = [
  "Frontend",
  "Backend & Database",
  "Tooling & Deployment",
  "AI/ML & Languages",
] as const;

/* Core MERN stack for hiring highlight */
const MERN_CORE = new Set(["MongoDB", "Express", "React", "Node.js"]);

interface SkillGroup {
  title: string;
  skills: Skill[];
}

function groupSkills(skills: Skill[]): SkillGroup[] {
  const sorted = [...skills].sort((a, b) => a.order - b.order);

  const groups: Record<string, Skill[]> = {
    "Frontend": [],
    "Backend & Database": [],
    "Tooling & Deployment": [],
    "AI/ML & Languages": [],
  };

  const otherSkills: Skill[] = [];

  sorted.forEach((skill) => {
    const targetGroup = SKILL_GROUP_MAP[skill.name];
    if (targetGroup && groups[targetGroup]) {
      groups[targetGroup].push(skill);
    } else {
      otherSkills.push(skill);
    }
  });

  const result: SkillGroup[] = GROUP_ORDER.map((title) => ({
    title,
    skills: groups[title],
  }));

  if (otherSkills.length > 0) {
    result.push({ title: "Other", skills: otherSkills });
  }

  return result;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.05,
      ease: "easeOut",
    },
  }),
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const groups = groupSkills(skills);

  return (
    <section
      id="skills"
      aria-label="Skills and technologies"
      className="section-pad"
      style={{ scrollMarginTop: "4.5rem" }}
    >
      <Container>
        <SectionHeading
          title="Skills"
          index="02"
          kicker="My Toolbox"
          subtitle="Technologies and tools I use to build scalable web applications"
          id="skills-heading"
        />

              {/* Core stack (MERN) legend under subtitle */}
        <div className="flex items-center gap-2.5 -mt-6 mb-8" aria-label="Skill highlight legend">
          <span
            className="inline-block w-3.5 h-3.5 rounded-full flex-shrink-0"
            style={{ background: "var(--color-peach)", border: "2px solid var(--color-ink)" }}
            aria-hidden="true"
          />
          <span className="text-xs font-bold text-faint">
            Core stack (MERN)
          </span>
        </div>

        {/* Balanced 2-column grid: 1 col below sm, 2x2 from sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {groups.map((group, index) => {
            /* Each toolbox panel gets its own pastel clay fill */
            const pastels = ["var(--color-peach)", "var(--color-sky)", "var(--color-mint)", "var(--color-lavender)"];
            const pastel = pastels[index % pastels.length];

            return (
            <motion.div
              key={group.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardVariants}
              className="rounded-card p-5 md:p-6 flex flex-col"
              style={{
                background: "var(--color-surface)",
                border: "2.5px solid var(--color-ink)",
                boxShadow: "5px 5px 0 var(--color-ink-shadow)",
                transition: "transform 0.2s, box-shadow 0.2s",
                gap: "var(--space-block)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "3px 3px 0 var(--color-ink-shadow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "5px 5px 0 var(--color-ink-shadow)";
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <h3
                  className="inline-flex items-center text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-text"
                  style={{
                    background: pastel,
                    border: "2px solid var(--color-ink)",
                    boxShadow: "2px 2px 0 var(--color-ink-shadow)",
                  }}
                >
                  {group.title}
                </h3>
                <span className="text-xs font-bold text-faint">
                  {group.skills.length} skills
                </span>
              </div>

              {/* Chips wrap */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const isHighlighted = MERN_CORE.has(skill.name);
                  return (
                    <Chip
                      key={skill._id || skill.name}
                      label={skill.name}
                      size="md"
                      highlight={isHighlighted}
                    />
                  );
                })}
                {group.skills.length === 0 && (
                  <span className="text-faint text-xs italic font-bold">
                    No skills listed
                  </span>
                )}
              </div>
            </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

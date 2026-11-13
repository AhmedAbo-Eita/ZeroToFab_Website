import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Layers, Star } from 'lucide-react';
import { CourseLevel, CourseModule } from '../types/course';
import { EyebrowBrick } from './BrandMark';
import { CourseThumbnailSvg } from './PcbArtwork';

interface CurriculumSectionProps {
  eyebrow: string;
  heading: string;
  showCountdown: boolean;
  countdownLabel: string;
  countdownEndIso: string;
  courses: CourseModule[];
  completedLessonIds: string[];
  onSelectCourse: (course: CourseModule) => void;
}

type FilterOption = 'All' | CourseLevel | 'Free';

function computeSecondsLeft(iso: string): number {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return 42 * 3600;
  const diff = Math.floor((target - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  eyebrow,
  heading,
  showCountdown,
  countdownLabel,
  countdownEndIso,
  courses,
  completedLessonIds,
  onSelectCourse,
}) => {
  const [filter, setFilter] = useState<FilterOption>('All');
  const [secondsLeft, setSecondsLeft] = useState(() =>
    computeSecondsLeft(countdownEndIso)
  );

  useEffect(() => {
    setSecondsLeft(computeSecondsLeft(countdownEndIso));
    const id = setInterval(() => {
      setSecondsLeft(computeSecondsLeft(countdownEndIso));
    }, 1000);
    return () => clearInterval(id);
  }, [countdownEndIso]);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  const filtered = courses.filter((c) => {
    if (filter === 'All') return true;
    if (filter === 'Free') return c.price === 0;
    return c.level === filter;
  });

  return (
    <section
      id="curriculum"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t-2 border-[#E8E6DC]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <EyebrowBrick label={eyebrow} />
          <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#141413] max-w-2xl leading-tight">
            {heading}
          </h2>
        </div>

        {/* Brutalist Live Countdown Timer Bar */}
        {showCountdown && (
          <div className="inline-flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border-2 border-[#141413] shadow-[4px_4px_0px_#141413]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#141413] px-1">
              {countdownLabel}
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              {[
                { val: pad(days), label: 'Days' },
                { val: pad(hours), label: 'Hrs' },
                { val: pad(mins), label: 'Min' },
                { val: pad(secs), label: 'Sec' },
              ].map((unit, i) => (
                <React.Fragment key={unit.label}>
                  <div className="flex flex-col items-center justify-center min-w-[46px] py-1.5 px-2 bg-[#D97757] text-[#141413] border-2 border-[#141413] rounded">
                    <span className="text-base font-bold leading-none">
                      {unit.val}
                    </span>
                    <span className="text-[9px] font-bold uppercase mt-0.5 opacity-80">
                      {unit.label}
                    </span>
                  </div>
                  {i < 3 && <span className="font-bold text-[#141413]">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Level Filter Tabs (Public student view only — no upload buttons) */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {(['All', 'Beginner', 'Intermediate', 'Advanced', 'Free'] as FilterOption[]).map(
          (tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold border-2 border-[#141413] rounded-md transition-all cursor-pointer ${
                  active
                    ? 'bg-[#D97757] text-[#141413] shadow-[3px_3px_0px_#141413]'
                    : 'bg-[#FAF9F5] text-[#141413] hover:bg-[#F0EEE6]'
                }`}
              >
                {tab === 'All' ? 'All Tracks' : tab}
              </button>
            );
          }
        )}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course, idx) => {
          const completedInMod = course.lessons.filter((l) =>
            completedLessonIds.includes(l.id)
          ).length;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="brutal-card bg-[#FFFFFF] rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <CourseThumbnailSvg
                  theme={course.thumbnailTheme}
                  number={course.number}
                />

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-mono font-bold border border-[#141413] rounded ${
                        course.level === 'Beginner'
                          ? 'bg-[#F0EEE6] text-[#141413]'
                          : course.level === 'Intermediate'
                          ? 'bg-[#E5984B]/30 text-[#141413]'
                          : 'bg-[#D97757]/30 text-[#141413]'
                      }`}
                    >
                      {course.level}
                    </span>

                    <div className="flex items-center gap-3 text-xs text-[#5C5A54] font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {course.lessons.length} lessons
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.totalHours}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#141413] tracking-tight mb-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[#5C5A54] leading-relaxed mb-4">
                    {course.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[11px] font-mono bg-[#FAF9F5] border border-[#E8E6DC] rounded text-[#4A4843]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm pt-3 border-t border-[#E8E6DC]">
                    <div className="flex items-center gap-1.5 font-bold text-[#141413]">
                      <Star className="w-4 h-4 fill-[#D97757] text-[#D97757]" />
                      <span>{course.rating.toFixed(1)}</span>
                      <span className="text-[#5C5A54] font-normal">
                        ({course.ratingCount})
                      </span>
                    </div>

                    {completedInMod > 0 && (
                      <span className="font-mono text-xs text-[#C96442] font-bold">
                        {completedInMod}/{course.lessons.length} done
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <div className="flex items-baseline justify-between mb-3">
                  {course.price === 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#141413]">
                        Free
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#141413] text-[#FAF9F5] rounded">
                        OPEN ACCESS
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#141413]">
                        ${course.price}
                      </span>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-sm text-[#78756E] line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                      {course.discountPercent && course.discountPercent > 0 && (
                        <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#141413] text-[#D97757] rounded">
                          {course.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className={`brutal-btn w-full py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    course.price === 0
                      ? 'bg-[#C96442] text-[#FAF9F5] hover:bg-[#D97757] hover:text-[#141413]'
                      : 'bg-[#D97757] text-[#141413]'
                  }`}
                >
                  <span>
                    {course.price === 0 ? 'Watch Free Module' : 'Open Module'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  FolderPlus,
  HardDrive,
  Plus,
  Trash2,
  Upload,
  UploadCloud,
  Video,
} from 'lucide-react';
import {
  CourseLevel,
  CourseModule,
  GoogleDriveConfig,
  Lesson,
  ResourceAttachment,
  SiteSectionsConfig,
} from '../../types/course';
import { formatFileSize, saveMediaBlob } from '../../utils/mediaStorage';
import {
  extractGoogleDriveFileId,
  requestGoogleDriveToken,
  uploadVideoToGoogleDrive,
} from '../../utils/googleDrive';
import { sanitizeExternalUrl } from '../../utils/security';

interface AdminCoursesPanelProps {
  courses: CourseModule[];
  sections: SiteSectionsConfig;
  driveConfig: GoogleDriveConfig;
  onUpdateCourses: (next: CourseModule[]) => void;
  onUpdateSections: (next: SiteSectionsConfig) => void;
  onNotify: (msg: string) => void;
}

export const AdminCoursesPanel: React.FC<AdminCoursesPanelProps> = ({
  courses,
  sections,
  driveConfig,
  onUpdateCourses,
  onUpdateSections,
  onNotify,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || ''
  );

  // Add Course Form
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newLevel, setNewLevel] = useState<CourseLevel>('Beginner');
  const [newPrice, setNewPrice] = useState('99');
  const [newOrigPrice, setNewOrigPrice] = useState('169');
  const [newHours, setNewHours] = useState('4.0 hrs');
  const [newTheme, setNewTheme] =
    useState<CourseModule['thumbnailTheme']>('4layer');
  const [newTags, setNewTags] = useState('KiCad 8, 4-Layer, DFM');

  // Add Lesson Form
  const [lesTitle, setLesTitle] = useState('');
  const [lesDuration, setLesDuration] = useState('18:00');
  const [lesSummary, setLesSummary] = useState('');
  const [lesNotes, setLesNotes] = useState('');
  const [videoSource, setVideoSource] = useState<
    'gdrive-link' | 'gdrive-upload' | 'local' | 'youtube' | 'mp4'
  >('gdrive-link');
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [driveOnDemand, setDriveOnDemand] = useState(
    driveConfig.defaultOnDemand
  );
  const [driveMakePublic, setDriveMakePublic] = useState(
    !driveConfig.proxyBaseUrl.trim()
  );
  const [externalUrl, setExternalUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  const selectedCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleCourseFieldChange = (
    id: string,
    patch: Partial<CourseModule>
  ) => {
    const next = courses.map((c) => {
      if (c.id !== id) return c;
      const merged = { ...c, ...patch };
      // Auto-recompute discountPercent if price/originalPrice changed
      if (
        ('price' in patch || 'originalPrice' in patch) &&
        merged.originalPrice &&
        merged.originalPrice > merged.price &&
        merged.price > 0
      ) {
        merged.discountPercent = Math.round(
          ((merged.originalPrice - merged.price) / merged.originalPrice) * 100
        );
      } else if (merged.price === 0) {
        merged.discountPercent = 0;
      }
      return merged;
    });
    onUpdateCourses(next);
  };

  const handleMoveCourse = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= courses.length) return;
    const copy = [...courses];
    const [moved] = copy.splice(idx, 1);
    copy.splice(target, 0, moved);
    const renumbered = copy.map((c, i) => ({
      ...c,
      number: String(i + 1).padStart(2, '0'),
    }));
    onUpdateCourses(renumbered);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const price = Math.max(0, Number(newPrice) || 0);
    const orig = Math.max(0, Number(newOrigPrice) || 0);
    const discount =
      price > 0 && orig > price ? Math.round(((orig - price) / orig) * 100) : 0;

    const created: CourseModule = {
      id: `mod-${Date.now()}`,
      number: String(courses.length + 1).padStart(2, '0'),
      title: newTitle.trim(),
      subtitle:
        newSubtitle.trim() ||
        'Hands-on PCB engineering module with schematic & layout files.',
      level: newLevel,
      category: newLevel,
      rating: 5.0,
      ratingCount: 1,
      price,
      originalPrice: orig > price ? orig : undefined,
      discountPercent: discount || undefined,
      totalHours: newHours.trim() || '2.0 hrs',
      thumbnailTheme: newTheme,
      tags: newTags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      lessons: [],
    };
    onUpdateCourses([...courses, created]);
    setSelectedCourseId(created.id);
    setNewTitle('');
    setNewSubtitle('');
    onNotify(`Added course "${created.title}".`);
  };

  const handleDeleteCourse = (id: string) => {
    const remaining = courses
      .filter((c) => c.id !== id)
      .map((c, i) => ({ ...c, number: String(i + 1).padStart(2, '0') }));
    onUpdateCourses(remaining);
    if (selectedCourseId === id && remaining[0]) {
      setSelectedCourseId(remaining[0].id);
    }
    onNotify('Course deleted.');
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !lesTitle.trim()) return;

    setUploading(true);
    setUploadPct(0);
    try {
      const lessonId = `les-${Date.now()}`;
      let videoType: Lesson['videoType'] = 'demo';
      let driveFileId: string | undefined;
      let videoMediaKey: string | undefined;
      let videoUrl: string | undefined;

      if (videoSource === 'gdrive-link') {
        const extracted = extractGoogleDriveFileId(driveUrlInput);
        if (!extracted) {
          onNotify('Please paste a valid Google Drive share link or File ID.');
          setUploading(false);
          return;
        }
        videoType = 'gdrive';
        driveFileId = extracted;
      } else if (videoSource === 'gdrive-upload') {
        if (!videoFile) {
          onNotify('Please select a video file to upload to Google Drive.');
          setUploading(false);
          return;
        }
        if (!driveConfig.clientId.trim()) {
          onNotify(
            'Set your Google OAuth Client ID in Settings & Google Drive tab first (or use "Google Drive Link").'
          );
          setUploading(false);
          return;
        }
        const token = await requestGoogleDriveToken(driveConfig.clientId);
        const uploaded = await uploadVideoToGoogleDrive({
          file: videoFile,
          accessToken: token,
          folderId: driveConfig.folderId,
          makePublicLink: driveMakePublic,
          onProgress: (pct) => setUploadPct(pct),
        });
        videoType = 'gdrive';
        driveFileId = uploaded.fileId;
      } else if (videoSource === 'local') {
        if (!videoFile) {
          onNotify('Please choose a local video file.');
          setUploading(false);
          return;
        }
        videoMediaKey = `vid-${lessonId}`;
        await saveMediaBlob(videoMediaKey, videoFile);
        videoType = 'uploaded';
      } else if (videoSource === 'youtube' || videoSource === 'mp4') {
        // Reject non-http(s) protocols (e.g. javascript:, data:) before saving lesson links
        const safeUrl = sanitizeExternalUrl(externalUrl);
        if (!safeUrl) {
          onNotify(
            videoSource === 'youtube'
              ? 'Please enter a valid http(s) YouTube URL.'
              : 'Please enter a valid http(s) MP4 URL.'
          );
          setUploading(false);
          return;
        }
        videoType = videoSource;
        videoUrl = safeUrl;
      }

      const attachments: ResourceAttachment[] = [];
      for (let i = 0; i < attachmentFiles.length; i++) {
        const f = attachmentFiles[i];
        const key = `att-${lessonId}-${i}`;
        await saveMediaBlob(key, f);
        const lower = f.name.toLowerCase();
        attachments.push({
          id: key,
          name: f.name,
          type: lower.endsWith('.pdf')
            ? 'pdf'
            : lower.endsWith('.zip') || lower.includes('gerber')
            ? 'gerber'
            : lower.includes('bom') || lower.endsWith('.csv')
            ? 'bom'
            : 'schematic',
          sizeLabel: formatFileSize(f.size),
          mediaKey: key,
        });
      }

      const newLesson: Lesson = {
        id: lessonId,
        title: lesTitle.trim(),
        duration: lesDuration.trim() || '15:00',
        summary:
          lesSummary.trim() ||
          'Practical PCB design lesson uploaded via Admin Dashboard.',
        notes:
          lesNotes.trim() ||
          '### Lesson Notes\n- Uploaded from Admin Dashboard.',
        videoType,
        driveFileId,
        driveRequestOnDemand: driveOnDemand,
        videoMediaKey,
        videoUrl,
        attachments,
        isFreePreview: true,
      };

      onUpdateCourses(
        courses.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, lessons: [...c.lessons, newLesson] }
            : c
        )
      );

      setLesTitle('');
      setLesSummary('');
      setLesNotes('');
      setDriveUrlInput('');
      setExternalUrl('');
      setVideoFile(null);
      setAttachmentFiles([]);
      onNotify(
        videoType === 'gdrive'
          ? 'Google Drive video lesson published (on-demand streaming enabled)!'
          : 'Lesson added to course!'
      );
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  const handleDeleteLesson = (courseId: string, lessonId: string) => {
    onUpdateCourses(
      courses.map((c) =>
        c.id === courseId
          ? { ...c, lessons: c.lessons.filter((l) => l.id !== lessonId) }
          : c
      )
    );
    onNotify('Lesson deleted.');
  };

  return (
    <div className="space-y-8">
      {/* Curriculum Section Header & Countdown Pricing Control */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-bold">
            Curriculum Section &amp; Offer Countdown
          </h3>
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={sections.showCurriculum}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  showCurriculum: e.target.checked,
                })
              }
              className="w-4 h-4 accent-[#D97757]"
            />
            Show Curriculum Section
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Eyebrow Label
            </label>
            <input
              type="text"
              value={sections.curriculumEyebrow}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  curriculumEyebrow: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={sections.curriculumHeading}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  curriculumHeading: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E8E6DC] grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={sections.showCountdown}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  showCountdown: e.target.checked,
                })
              }
              className="w-4 h-4 accent-[#D97757]"
            />
            Show Countdown Timer
          </label>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Countdown Label
            </label>
            <input
              type="text"
              value={sections.countdownLabel}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  countdownLabel: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Extend Offer By
            </label>
            <div className="flex gap-2">
              {[24, 48, 72].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => {
                    onUpdateSections({
                      ...sections,
                      countdownEndIso: new Date(
                        Date.now() + hrs * 3600 * 1000
                      ).toISOString(),
                    });
                    onNotify(`Countdown reset to ${hrs} hours.`);
                  }}
                  className="px-3 py-2 text-xs font-mono font-bold bg-[#F0EEE6] hover:bg-[#D97757] border-2 border-[#141413] rounded cursor-pointer"
                >
                  +{hrs}h
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Editor + New Course Builder */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Course List + Pricing Editor */}
        <div className="xl:col-span-7 space-y-4">
          <h3 className="text-lg font-bold">
            All Courses &amp; Pricing ({courses.length})
          </h3>

          {courses.map((course, idx) => {
            const isSelected = selectedCourse?.id === course.id;
            return (
              <div
                key={course.id}
                className={`p-5 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#141413] shadow-[5px_5px_0px_#D97757]'
                    : 'bg-[#FFFFFF] border-[#141413] shadow-[3px_3px_0px_#141413]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseId(course.id)}
                    className="font-mono text-xs font-bold px-2.5 py-1 bg-[#D97757] border border-[#141413] rounded cursor-pointer"
                  >
                    MOD [{course.number}] · {course.lessons.length} LESSONS
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveCourse(idx, -1)}
                      title="Move up"
                      className="p-1.5 border border-[#141413] rounded hover:bg-[#F0EEE6] cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveCourse(idx, 1)}
                      title="Move down"
                      className="p-1.5 border border-[#141413] rounded hover:bg-[#F0EEE6] cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course.id)}
                      title="Delete course"
                      className="p-1.5 border border-[#141413] rounded text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#5C5A54] mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) =>
                        handleCourseFieldChange(course.id, {
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-sm font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#5C5A54] mb-1">
                      Subtitle / Pitch
                    </label>
                    <textarea
                      rows={2}
                      value={course.subtitle}
                      onChange={(e) =>
                        handleCourseFieldChange(course.id, {
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#5C5A54] mb-1">
                      Level
                    </label>
                    <select
                      value={course.level}
                      onChange={(e) =>
                        handleCourseFieldChange(course.id, {
                          level: e.target.value as CourseLevel,
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-xs font-bold"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#5C5A54] mb-1">
                      Total Hours
                    </label>
                    <input
                      type="text"
                      value={course.totalHours}
                      onChange={(e) =>
                        handleCourseFieldChange(course.id, {
                          totalHours: e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
                    />
                  </div>

                  {/* Pricing Controls */}
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#C96442] mb-1">
                      Sale Price ($ USD, 0 = Free)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={course.price}
                      onChange={(e) =>
                        handleCourseFieldChange(course.id, {
                          price: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#5C5A54] mb-1">
                      Original Price ($ Strikethrough)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={course.originalPrice ?? ''}
                      placeholder="Optional"
                      onChange={(e) =>
                        handleCourseFieldChange(course.id, {
                          originalPrice: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E6DC]">
                  <span className="font-mono text-xs text-[#5C5A54]">
                    {course.discountPercent
                      ? `Auto-discount badge: ${course.discountPercent}% OFF`
                      : course.price === 0
                      ? 'Displayed as FREE'
                      : 'Standard pricing'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`px-3 py-1 text-xs font-bold rounded border border-[#141413] cursor-pointer ${
                      isSelected
                        ? 'bg-[#141413] text-[#FAF9F5]'
                        : 'bg-[#F0EEE6] hover:bg-[#D97757]'
                    }`}
                  >
                    {isSelected ? 'Managing Lessons Below ↓' : 'Manage Lessons'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Add New Course Form */}
        <div className="xl:col-span-5">
          <form
            onSubmit={handleCreateCourse}
            className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4 sticky top-6"
          >
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#C96442]" />
              <span>Add New Course Module</span>
            </h3>

            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Rigid-Flex & HDI Microvia PCB Design"
                className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                Course Summary
              </label>
              <textarea
                rows={2}
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="What students will build..."
                className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  Level
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as CourseLevel)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  Duration Label
                </label>
                <input
                  type="text"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newOrigPrice}
                  onChange={(e) => setNewOrigPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                PCB Cover Style
              </label>
              <select
                value={newTheme}
                onChange={(e) =>
                  setNewTheme(e.target.value as CourseModule['thumbnailTheme'])
                }
                className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
              >
                <option value="schematic">Schematic Capture</option>
                <option value="4layer">4-Layer STM32</option>
                <option value="power">Power &amp; GaN SMPS</option>
                <option value="highspeed">High-Speed DDR4</option>
                <option value="rf">RF &amp; BLE Antenna</option>
                <option value="dfm">DFM &amp; Panelization</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
              />
            </div>

            <button
              type="submit"
              className="brutal-btn w-full py-3 bg-[#D97757] text-[#141413] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course Module</span>
            </button>
          </form>
        </div>
      </div>

      {/* Selected Course Lesson & Google Drive Video Uploader */}
      {selectedCourse && (
        <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[6px_6px_0px_#141413]">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b-2 border-[#E8E6DC]">
            <div>
              <span className="font-mono text-xs font-bold text-[#C96442] uppercase">
                Editing Lessons for MOD [{selectedCourse.number}]
              </span>
              <h3 className="text-xl font-bold">{selectedCourse.title}</h3>
            </div>
            <select
              value={selectedCourse.id}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded font-bold text-sm"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  MOD [{c.number}] {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Existing Lessons */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase text-[#5C5A54]">
                Published Lessons ({selectedCourse.lessons.length})
              </h4>
              {selectedCourse.lessons.length === 0 ? (
                <p className="text-sm text-[#5C5A54] italic p-4 bg-[#FAF9F5] rounded border border-[#E8E6DC]">
                  No lessons yet. Upload your first lesson on the right.
                </p>
              ) : (
                selectedCourse.lessons.map((l, idx) => (
                  <div
                    key={l.id}
                    className="p-3.5 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-sm">
                        {idx + 1}. {l.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-[11px] text-[#5C5A54]">
                        <span>{l.duration}</span>
                        <span className="px-1.5 py-0.5 bg-[#141413] text-[#FAF9F5] rounded text-[10px]">
                          {l.videoType === 'gdrive'
                            ? `G-DRIVE (${l.driveRequestOnDemand ? 'ON-DEMAND' : 'AUTO'})`
                            : l.videoType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(selectedCourse.id, l.id)}
                      className="p-1.5 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add / Upload Lesson Form (with Google Drive Direct Upload + Link!) */}
            <form onSubmit={handleAddLesson} className="lg:col-span-7 space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase text-[#C96442]">
                Upload New Lesson Video
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={lesTitle}
                    onChange={(e) => setLesTitle(e.target.value)}
                    placeholder="e.g. DDR4 Fly-By Length Matching"
                    className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={lesDuration}
                    onChange={(e) => setLesDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                  />
                </div>
              </div>

              {/* Video Hosting Mode Selector */}
              <div className="p-4 bg-[#FAF9F5] border-2 border-[#141413] rounded-xl space-y-3">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#C96442]" />
                  <span>Choose Video Hosting Source</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'gdrive-link', label: 'Google Drive Link / ID' },
                    { id: 'gdrive-upload', label: 'Direct Upload to Google Drive' },
                    { id: 'local', label: 'Local Browser Upload' },
                    { id: 'youtube', label: 'YouTube Link' },
                    { id: 'mp4', label: 'Direct MP4 URL' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setVideoSource(opt.id as typeof videoSource)
                      }
                      className={`px-3 py-1.5 text-xs font-bold border-2 border-[#141413] rounded cursor-pointer ${
                        videoSource === opt.id
                          ? 'bg-[#D97757] text-[#141413]'
                          : 'bg-[#FFFFFF] hover:bg-[#F0EEE6]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {videoSource === 'gdrive-link' && (
                  <div className="space-y-2.5 pt-1">
                    <input
                      type="text"
                      value={driveUrlInput}
                      onChange={(e) => setDriveUrlInput(e.target.value)}
                      placeholder="Paste Google Drive link (https://drive.google.com/file/d/.../view) or File ID"
                      className="w-full px-3 py-2 bg-[#FFFFFF] border-2 border-[#141413] rounded text-sm"
                    />
                    <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={driveOnDemand}
                        onChange={(e) => setDriveOnDemand(e.target.checked)}
                        className="w-4 h-4 accent-[#D97757]"
                      />
                      <span>
                        Load &amp; stream on-demand only when student clicks &quot;Request &amp; Load Video&quot;
                      </span>
                    </label>
                  </div>
                )}

                {videoSource === 'gdrive-upload' && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-[#FFFFFF] border border-[#141413] rounded text-xs text-[#5C5A54] flex items-start gap-2">
                      <HardDrive className="w-4 h-4 text-[#C96442] shrink-0 mt-0.5" />
                      <span>
                        Uploads the video straight to your Google Drive via
                        OAuth and sets on-demand streaming automatically.{' '}
                        {!driveConfig.clientId && (
                          <strong className="text-[#C96442]">
                            Configure your Google OAuth Client ID in Settings &amp;
                            Google Drive tab first.
                          </strong>
                        )}
                      </span>
                    </div>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#141413] rounded bg-[#FFFFFF] hover:bg-[#F0EEE6] cursor-pointer text-center">
                      <Upload className="w-5 h-5 text-[#C96442] mb-1" />
                      <span className="text-xs font-bold">
                        {videoFile
                          ? `${videoFile.name} (${formatFileSize(videoFile.size)})`
                          : 'Select video file (.mp4 / .webm) to upload to Google Drive'}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) =>
                          setVideoFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={driveMakePublic}
                        onChange={(e) => setDriveMakePublic(e.target.checked)}
                        className="w-4 h-4 accent-[#D97757]"
                      />
                      <span>
                        Make uploaded video link public (&quot;Anyone with the link can view&quot; — uncheck if using a private proxy)
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={driveOnDemand}
                        onChange={(e) => setDriveOnDemand(e.target.checked)}
                        className="w-4 h-4 accent-[#D97757]"
                      />
                      <span>Stream on-demand when requested by user</span>
                    </label>
                  </div>
                )}

                {videoSource === 'local' && (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#141413] rounded bg-[#FFFFFF] hover:bg-[#F0EEE6] cursor-pointer text-center">
                    <Upload className="w-5 h-5 text-[#C96442] mb-1" />
                    <span className="text-xs font-bold">
                      {videoFile
                        ? `${videoFile.name} (${formatFileSize(videoFile.size)})`
                        : 'Select local video file (.mp4 / .webm)'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        setVideoFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                )}

                {(videoSource === 'youtube' || videoSource === 'mp4') && (
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder={
                      videoSource === 'youtube'
                        ? 'https://www.youtube.com/watch?v=...'
                        : 'https://cdn.example.com/lesson.mp4'
                    }
                    className="w-full px-3 py-2 bg-[#FFFFFF] border-2 border-[#141413] rounded text-sm"
                  />
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                  Summary
                </label>
                <input
                  type="text"
                  value={lesSummary}
                  onChange={(e) => setLesSummary(e.target.value)}
                  placeholder="Brief lesson overview..."
                  className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                  Engineering Notes &amp; Checklists
                </label>
                <textarea
                  rows={3}
                  value={lesNotes}
                  onChange={(e) => setLesNotes(e.target.value)}
                  placeholder="Stackup dimensions, impedance targets, DFM notes..."
                  className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                  Attach Gerbers, BOM, Schematics or PDFs
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setAttachmentFiles(Array.from(e.target.files || []))
                  }
                  className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-2 file:border-[#141413] file:font-bold file:bg-[#F0EEE6] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="brutal-btn px-6 py-3 bg-[#D97757] text-[#141413] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  {uploading
                    ? uploadPct > 0
                      ? `Uploading to Google Drive (${uploadPct}%)...`
                      : 'Publishing Lesson...'
                    : 'Publish Lesson'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

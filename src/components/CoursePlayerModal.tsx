import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Loader2,
  Play,
  X,
} from 'lucide-react';
import {
  CourseModule,
  GoogleDriveConfig,
  Lesson,
  ResourceAttachment,
} from '../types/course';
import { getMediaBlobUrl } from '../utils/mediaStorage';
import {
  getGoogleDriveDirectDownloadUrl,
  getGoogleDrivePreviewUrl,
} from '../utils/googleDrive';

interface CoursePlayerModalProps {
  course: CourseModule | null;
  driveConfig: GoogleDriveConfig;
  completedLessonIds: string[];
  onToggleComplete: (lessonId: string) => void;
  onClose: () => void;
}

function toYoutubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return url;
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  driveConfig,
  completedLessonIds,
  onToggleComplete,
  onClose,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string | null>(null);
  // Google Drive On-Demand Request State (never fetches Drive stream until user requests it)
  const [driveStreamRequested, setDriveStreamRequested] = useState(false);
  const [driveStreamLoading, setDriveStreamLoading] = useState(false);

  useEffect(() => {
    if (course && course.lessons.length > 0) {
      setActiveLessonId(course.lessons[0].id);
    }
  }, [course?.id]);

  const activeLesson: Lesson | undefined = useMemo(() => {
    if (!course) return undefined;
    return (
      course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0]
    );
  }, [course, activeLessonId]);

  // Reset on-demand Google Drive stream state when switching lessons
  useEffect(() => {
    setDriveStreamRequested(false);
    setDriveStreamLoading(false);
  }, [activeLesson?.id]);

  useEffect(() => {
    let revokedUrl: string | null = null;
    let cancelled = false;

    async function loadVideo() {
      setResolvedVideoUrl(null);
      if (!activeLesson) return;

      if (activeLesson.videoType === 'uploaded' && activeLesson.videoMediaKey) {
        const url = await getMediaBlobUrl(activeLesson.videoMediaKey);
        if (!cancelled && url) {
          revokedUrl = url;
          setResolvedVideoUrl(url);
        }
      } else if (activeLesson.videoUrl) {
        setResolvedVideoUrl(activeLesson.videoUrl);
      }
    }

    loadVideo();
    return () => {
      cancelled = true;
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [activeLesson?.id, activeLesson?.videoMediaKey, activeLesson?.videoUrl]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (course) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [course, onClose]);

  const handleRequestDriveStream = () => {
    setDriveStreamLoading(true);
    setDriveStreamRequested(true);
  };

  const handleDownloadAttachment = async (att: ResourceAttachment) => {
    if (att.driveFileId) {
      window.open(
        getGoogleDriveDirectDownloadUrl(att.driveFileId),
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }
    if (att.mediaKey) {
      const url = await getMediaBlobUrl(att.mediaKey);
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = att.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      }
    }
    if (att.url) {
      window.open(att.url, '_blank', 'noopener,noreferrer');
      return;
    }
    const blob = new Blob(
      [
        `ZeroToFab PCB Masterclass Resource\nFile: ${att.name}\nModule: ${course?.title}\nLesson: ${activeLesson?.title}`,
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      att.name.endsWith('.pdf') || att.name.endsWith('.zip')
        ? `${att.name}.txt`
        : att.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!course) return null;

  const completedCount = course.lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  const progressPct =
    course.lessons.length > 0
      ? Math.round((completedCount / course.lessons.length) * 100)
      : 0;

  const youtubeEmbed =
    activeLesson?.videoType === 'youtube' && resolvedVideoUrl
      ? toYoutubeEmbed(resolvedVideoUrl)
      : null;

  const isDriveLesson =
    activeLesson?.videoType === 'gdrive' && Boolean(activeLesson.driveFileId);
  const requireClickToRequest =
    activeLesson?.driveRequestOnDemand ?? driveConfig.defaultOnDemand;

  const driveSrc =
    isDriveLesson && activeLesson?.driveFileId
      ? driveConfig.proxyBaseUrl?.trim()
        ? `${driveConfig.proxyBaseUrl.replace(/\/$/, '')}?fileId=${encodeURIComponent(
            activeLesson.driveFileId
          )}`
        : getGoogleDrivePreviewUrl(activeLesson.driveFileId)
      : null;

  const shouldRenderDrivePlayer =
    isDriveLesson && (!requireClickToRequest || driveStreamRequested);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#141413]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[92vh] bg-[#FAF9F5] border-[3px] border-[#141413] rounded-2xl shadow-[8px_8px_0px_#D97757] flex flex-col overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-5 py-4 bg-[#141413] text-[#FAF9F5] flex items-center justify-between gap-4 border-b-2 border-[#141413]">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 bg-[#D97757] text-[#141413] font-mono text-[11px] font-bold rounded">
                  MOD [{course.number}] · {course.level.toUpperCase()}
                </span>
                <span className="font-mono text-xs text-[#B0AEA5]">
                  {progressPct}% Completed
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg truncate">
                {course.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              aria-label="Close classroom"
              className="p-2 rounded bg-[#2A2926] hover:bg-[#D97757] hover:text-[#141413] text-[#FAF9F5] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Video & Notes + Syllabus Sidebar */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 p-5 sm:p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-[#E8E6DC]">
              {activeLesson ? (
                <>
                  {/* Video Player Viewport */}
                  <div className="relative aspect-video w-full bg-[#141413] rounded-xl border-2 border-[#141413] overflow-hidden mb-5 shadow-[4px_4px_0px_#141413]">
                    {isDriveLesson ? (
                      shouldRenderDrivePlayer && driveSrc ? (
                        <>
                          {driveStreamLoading && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#141413] text-[#FAF9F5] gap-2">
                              <Loader2 className="w-7 h-7 text-[#D97757] animate-spin" />
                              <span className="font-mono text-xs text-[#B0AEA5]">
                                Requesting video stream from Google Drive...
                              </span>
                            </div>
                          )}
                          {driveConfig.proxyBaseUrl?.trim() ? (
                            <video
                              src={driveSrc}
                              controls
                              autoPlay
                              onLoadedData={() => setDriveStreamLoading(false)}
                              className="w-full h-full object-contain bg-black"
                            />
                          ) : (
                            <iframe
                              src={driveSrc}
                              title={activeLesson.title}
                              onLoad={() => setDriveStreamLoading(false)}
                              className="w-full h-full border-0"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            />
                          )}
                        </>
                      ) : (
                        /* On-Demand Google Drive Request Gate */
                        <div className="w-full h-full pcb-grid-bg flex flex-col items-center justify-center p-6 text-center text-[#FAF9F5]">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1C1C1A] border border-[#D97757]/60 font-mono text-[11px] font-bold text-[#D97757] mb-4">
                            <HardDrive className="w-3.5 h-3.5" />
                            <span>GOOGLE DRIVE · ON-DEMAND STREAM</span>
                          </div>
                          <h4 className="font-bold text-lg sm:text-xl max-w-md mb-2">
                            {activeLesson.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#B0AEA5] max-w-md mb-6">
                            Video is stored on Google Drive and loaded only when
                            you request it. Click below to stream this lesson.
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                              onClick={handleRequestDriveStream}
                              className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#D97757] hover:bg-[#E87A54] text-[#141413] font-bold text-sm rounded border-2 border-[#FAF9F5] shadow-[4px_4px_0px_#FAF9F5] transition-all cursor-pointer"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>Request &amp; Load Video</span>
                            </button>
                            {activeLesson.driveFileId && (
                              <a
                                href={`https://drive.google.com/file/d/${activeLesson.driveFileId}/view`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-3 bg-[#1C1C1A] hover:bg-[#2A2926] text-[#FAF9F5] font-bold text-xs rounded border border-[#FAF9F5]/40 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open in Drive</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    ) : youtubeEmbed ? (
                      <iframe
                        src={youtubeEmbed}
                        title={activeLesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : resolvedVideoUrl &&
                      (activeLesson.videoType === 'uploaded' ||
                        activeLesson.videoType === 'mp4') ? (
                      <video
                        key={resolvedVideoUrl}
                        src={resolvedVideoUrl}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <div className="w-full h-full pcb-grid-bg flex flex-col items-center justify-center p-6 text-center text-[#FAF9F5]">
                        <div className="w-16 h-16 rounded-full bg-[#D97757] text-[#141413] border-2 border-[#FAF9F5] flex items-center justify-center mb-4">
                          <Play className="w-7 h-7 fill-current ml-1" />
                        </div>
                        <p className="font-mono text-xs uppercase tracking-widest text-[#E5984B] mb-1">
                          Lesson Overview &amp; Notes
                        </p>
                        <h4 className="font-bold text-lg sm:text-xl max-w-md mb-2">
                          {activeLesson.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#B0AEA5] max-w-md">
                          Review the engineering design checklist and downloadable
                          project files below.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lesson Header + Complete Toggle */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="font-mono text-xs text-[#C96442] font-bold">
                        DURATION: {activeLesson.duration}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-[#141413] mt-0.5">
                        {activeLesson.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onToggleComplete(activeLesson.id)}
                      className={`brutal-btn inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold cursor-pointer ${
                        completedLessonIds.includes(activeLesson.id)
                          ? 'bg-[#141413] text-[#FAF9F5]'
                          : 'bg-[#D97757] text-[#141413]'
                      }`}
                    >
                      {completedLessonIds.includes(activeLesson.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#D97757]" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-[#141413] inline-block" />
                          <span>Mark Complete</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm sm:text-base text-[#4A4843] mb-5 leading-relaxed">
                    {activeLesson.summary}
                  </p>

                  {/* Engineering Notes Box */}
                  <div className="bg-[#FFFFFF] border-2 border-[#141413] rounded-xl p-5 mb-5">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#C96442] mb-3">
                      <FileText className="w-4 h-4" />
                      <span>Engineering Notes &amp; Design Rules</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-[#141413] leading-relaxed">
                      {activeLesson.notes}
                    </pre>
                  </div>

                  {/* Downloadable Attachments */}
                  {activeLesson.attachments.length > 0 && (
                    <div>
                      <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413] mb-2.5">
                        Project Files &amp; Gerbers ({activeLesson.attachments.length})
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeLesson.attachments.map((att) => (
                          <button
                            key={att.id}
                            onClick={() => handleDownloadAttachment(att)}
                            className="flex items-center justify-between p-3 bg-[#F0EEE6] hover:bg-[#D97757]/25 border-2 border-[#141413] rounded-lg text-left transition-colors cursor-pointer"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-mono text-xs font-bold text-[#141413] truncate">
                                {att.name}
                              </div>
                              <div className="text-[11px] text-[#5C5A54] uppercase">
                                {att.type} · {att.sizeLabel}
                              </div>
                            </div>
                            <Download className="w-4 h-4 text-[#141413] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-[#5C5A54]">
                  No lessons available in this module yet.
                </div>
              )}
            </div>

            {/* Syllabus Sidebar */}
            <div className="lg:col-span-4 p-5 bg-[#F0EEE6]">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
                  Module Syllabus ({course.lessons.length})
                </h5>
                <span className="font-mono text-xs font-bold text-[#C96442]">
                  {completedCount}/{course.lessons.length}
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#FAF9F5] border border-[#141413] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-[#D97757] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="space-y-2.5">
                {course.lessons.map((les, idx) => {
                  const isActive = les.id === activeLesson?.id;
                  const isDone = completedLessonIds.includes(les.id);
                  return (
                    <button
                      key={les.id}
                      onClick={() => setActiveLessonId(les.id)}
                      className={`w-full text-left p-3.5 rounded-lg border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#D97757] border-[#141413] shadow-[3px_3px_0px_#141413]'
                          : 'bg-[#FAF9F5] border-[#141413] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-[#141413]" />
                          ) : (
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#141413] font-mono text-[10px] font-bold">
                              {idx + 1}
                            </span>
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm text-[#141413] leading-snug">
                            {les.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-[#141413]/75">
                            <span>{les.duration}</span>
                            {les.videoType === 'gdrive' && (
                              <span className="px-1.5 py-0.2 bg-[#141413] text-[#E5984B] rounded text-[10px]">
                                G-DRIVE
                              </span>
                            )}
                            {les.videoType === 'uploaded' && (
                              <span className="px-1.5 py-0.2 bg-[#141413] text-[#FAF9F5] rounded text-[10px]">
                                HD VIDEO
                              </span>
                            )}
                            {les.videoType === 'youtube' && (
                              <span className="px-1.5 py-0.2 bg-[#141413] text-[#D97757] rounded text-[10px]">
                                STREAM
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

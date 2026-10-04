import { Button, Card, Input } from '../ui/Primitives';
import React, { useState } from 'react';
import { MessageSquare, ArrowUp, Download, Eye, FileText, MoreHorizontal } from 'lucide-react';

export interface CommentItem {
  id: string;
  authorName: string;
  authorRole: string;
  avatarInitials: string;
  avatarBg?: string;
  date: string;
  text: string;
  attachment?: {
    name: string;
    subtext: string;
    url?: string;
  };
}

interface ReferenceCommentsCardProps {
  title?: string;
  subtitle?: string;
  comments: CommentItem[];
  onAddComment?: (text: string) => void;
  placeholder?: string;
}

export const ReferenceCommentsCard: React.FC<ReferenceCommentsCardProps> = ({
  title = 'Operational Activity & Notes',
  subtitle = 'Job verification logs and station communications',
  comments: initialComments,
  onAddComment,
  placeholder = 'Add operational notes or comments...',
}) => {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newComment: CommentItem = {
      id: `CMT-${Date.now()}`,
      authorName: 'Suresh Parmar',
      authorRole: 'Artisan Bench #4',
      avatarInitials: 'SP',
      avatarBg: 'bg-amber-600 text-white',
      date: 'Just now',
      text: inputText.trim(),
    };
    setComments((prev) => [...prev, newComment]);
    if (onAddComment) onAddComment(inputText.trim());
    setInputText('');
  };

  return (
    <Card padding="md" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 font-sans text-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Comments Feed */}
        <div className="space-y-4 pt-3">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              {/* Comment Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      comment.avatarBg || 'bg-slate-900 text-white'
                    }`}
                  >
                    {comment.avatarInitials}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">{comment.authorName}</span>
                    <span className="text-[10px] text-slate-400 block leading-tight">{comment.authorRole}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{comment.date}</span>
                  <Button variant="ghost" size="icon" className="" aria-label="More actions">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Comment Body */}
              <p className="text-slate-700 text-xs pl-9 leading-relaxed">{comment.text}</p>

              {/* Attachment Preview Box (Matching Image 1 & 5) */}
              {comment.attachment && (
                <div className="sm:ml-9 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs truncate">{comment.attachment.name}</div>
                      <div className="text-[10px] text-slate-400">{comment.attachment.subtext}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon"
                      type="button"
                      className="transition-colors"
                      title="Download Evidence File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon"
                      type="button"
                      className="transition-colors"
                      title="Preview Scale Evidence"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Box at Bottom (Matching Image 1 & 5) */}
      <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-w-0 flex-1 transition-all"
        />
        <Button variant="primary" size="icon"
          type="submit"
          aria-label="Post comment"
          disabled={!inputText.trim()}
          className="w-10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </Button>
      </form>
    </Card>
  );
};

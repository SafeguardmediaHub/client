'use client';

import { Paperclip, Send, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

interface ContactFormProps {
  initialCategory?: string;
  initialSubject?: string;
}

export function ContactForm({
  initialCategory,
  initialSubject,
}: ContactFormProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState(initialSubject || '');
  const [category, setCategory] = useState(initialCategory || '');
  const [priority, setPriority] = useState('normal');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !subject || !category || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Support request submitted successfully!');
      // Reset form
      setSubject('');
      setMessage('');
      setAttachment(null);
      setCategory('');
      setPriority('normal');
    } catch (_error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
    >
      <h2
        className="text-2xl font-bold text-gray-900 mb-6"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        Contact Support
      </h2>

      <div className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-semibold text-sm text-gray-700"
          >
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={!!user}
            className="border-gray-300 rounded-xl h-11"
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label
            htmlFor="subject"
            className="font-semibold text-sm text-gray-700"
          >
            Subject *
          </Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            required
            maxLength={100}
            className="border-gray-300 rounded-xl h-11"
          />
          <p className="text-xs text-gray-500">
            {subject.length}/100 characters
          </p>
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="font-semibold text-sm text-gray-700"
            >
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-gray-300 rounded-xl h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="account">Account Issue</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="priority"
              className="font-semibold text-sm text-gray-700"
            >
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="border-gray-300 rounded-xl h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label
            htmlFor="message"
            className="font-semibold text-sm text-gray-700"
          >
            Message *
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide as much detail as possible..."
            required
            maxLength={2000}
            className="border-gray-300 rounded-xl min-h-32 resize-none"
          />
          <p className="text-xs text-gray-500">
            {message.length}/2000 characters
          </p>
        </div>

        {/* Attachment */}
        <div className="space-y-2">
          <Label
            htmlFor="attachment"
            className="font-semibold text-sm text-gray-700"
          >
            Attachment (Optional)
          </Label>
          <div className="flex items-center gap-3">
            <input
              id="attachment"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('attachment')?.click()}
              className="border-gray-300 rounded-xl"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            {attachment && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="truncate max-w-xs">{attachment.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Max file size: 10MB</p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-11"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

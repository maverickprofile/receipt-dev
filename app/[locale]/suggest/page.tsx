"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ThumbsUp,
    ThumbsDown,
    CheckCircle2,
    ChevronUp,
    ChevronDown,
    Plus,
    FileText,
    Sparkles,
    MessageCircle,
    X,
    Send,
    Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/auth-client";

// Types
interface Comment {
    id: string;
    content: string;
    userName: string;
    userImage: string | null;
    createdAt: string;
}

interface Suggestion {
    id: string;
    title: string;
    description: string;
    status: "pending" | "approved" | "in_progress" | "done";
    userId: string | null;
    userName: string;
    userImage: string | null;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    comments: Comment[];
}

// Status config
const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        icon: ThumbsDown,
        color: "text-slate-600",
        bgColor: "bg-slate-100 dark:bg-slate-800",
        badgeColor: "bg-slate-200 text-slate-700",
    },
    approved: {
        label: "Approved",
        icon: ThumbsUp,
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        badgeColor: "bg-amber-100 text-amber-700",
    },
    in_progress: {
        label: "In Progress",
        icon: Sparkles,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        badgeColor: "bg-blue-100 text-blue-700",
    },
    done: {
        label: "Done",
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        badgeColor: "bg-green-100 text-green-700",
    },
};

// Format date
function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

// Feature Detail Modal
function FeatureDetailModal({
    suggestion,
    isOpen,
    onClose,
    onVote,
    onComment,
}: {
    suggestion: Suggestion;
    isOpen: boolean;
    onClose: () => void;
    onVote: (id: string, direction: "up" | "down") => Promise<void>;
    onComment: (id: string, content: string) => Promise<void>;
}) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const config = STATUS_CONFIG[suggestion.status];

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        await onComment(suggestion.id, newComment);
        setNewComment("");
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pr-6 sm:pr-8">
                        {suggestion.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Vote & Status */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onVote(suggestion.id, "up")}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                            >
                                <ChevronUp className="w-5 h-5" />
                            </button>
                            <span className="font-bold text-lg">{suggestion.upvotes}</span>
                            <button
                                onClick={() => onVote(suggestion.id, "down")}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badgeColor}`}>
                            {config.label}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {suggestion.description}
                    </p>

                    {/* Comments */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                            Comments:
                        </h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto">
                            {suggestion.comments && suggestion.comments.length > 0 ? (
                                suggestion.comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={comment.userImage || undefined} />
                                            <AvatarFallback>
                                                {comment.userName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {comment.userName}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm">No comments yet</p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="mt-4 flex gap-2">
                            <Input
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                            />
                            <Button
                                onClick={handleSubmitComment}
                                disabled={isSubmitting || !newComment.trim()}
                                size="icon"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Feature Card Component
function FeatureCard({
    suggestion,
    onVote,
    onClick,
}: {
    suggestion: Suggestion;
    onVote: (id: string, direction: "up" | "down") => Promise<void>;
    onClick: () => void;
}) {
    return (
        <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
            <CardContent className="p-4">
                <div className="flex gap-3">
                    {/* Vote buttons */}
                    <div
                        className="flex flex-col items-center gap-1 pt-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => onVote(suggestion.id, "up")}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                            <ChevronUp className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                        </button>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {suggestion.upvotes}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                            {suggestion.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {suggestion.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-blue-600 hover:text-blue-700">
                                See more
                            </span>
                            {suggestion.comments && suggestion.comments.length > 0 && (
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <MessageCircle className="w-3 h-3" />
                                    {suggestion.comments.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Column Component
function StatusColumn({
    status,
    suggestions,
    onVote,
    onCardClick,
}: {
    status: keyof typeof STATUS_CONFIG;
    suggestions: Suggestion[];
    onVote: (id: string, direction: "up" | "down") => Promise<void>;
    onCardClick: (suggestion: Suggestion) => void;
}) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    const count = suggestions.length;

    return (
        <div className="flex-1 min-w-[250px] sm:min-w-[280px] max-w-full sm:max-w-[320px]">
            {/* Column Header */}
            <div className={`${config.bgColor} rounded-t-lg px-3 sm:px-4 py-2 sm:py-3 border-b`}>
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="font-medium text-sm sm:text-base text-slate-900 dark:text-white">
                        {config.label}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 ml-1">{count}</span>
                </div>
            </div>

            {/* Column Content */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 sm:p-3 min-h-[300px] sm:min-h-[400px] rounded-b-lg border border-t-0">
                {suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                        <FeatureCard
                            key={suggestion.id}
                            suggestion={suggestion}
                            onVote={onVote}
                            onClick={() => onCardClick(suggestion)}
                        />
                    ))
                ) : (
                    <div className="text-center text-slate-400 py-6 sm:py-8 text-sm">No features yet</div>
                )}
            </div>
        </div>
    );
}

export default function SuggestFeaturePage() {
    const { toast } = useToast();
    const { data: session } = useSession();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState("votes");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newFeature, setNewFeature] = useState({ title: "", description: "" });
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch suggestions
    const fetchSuggestions = async () => {
        try {
            const res = await fetch("/api/suggestions");
            const data = await res.json();
            if (data.suggestions) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleVote = async (id: string, direction: "up" | "down") => {
        try {
            const res = await fetch(`/api/suggestions/${id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    voteType: direction,
                    userId: session?.user?.id || null,
                }),
            });
            const data = await res.json();
            if (data.suggestion) {
                setSuggestions((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, ...data.suggestion } : s))
                );
                if (selectedSuggestion?.id === id) {
                    setSelectedSuggestion({ ...selectedSuggestion, ...data.suggestion });
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to vote",
                variant: "destructive",
            });
        }
    };

    const handleComment = async (id: string, content: string) => {
        try {
            const res = await fetch(`/api/suggestions/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    userId: session?.user?.id || null,
                    userName: session?.user?.name || "Anon",
                    userImage: session?.user?.image || null,
                }),
            });
            const data = await res.json();
            if (data.comment) {
                setSuggestions((prev) =>
                    prev.map((s) =>
                        s.id === id
                            ? { ...s, comments: [...(s.comments || []), data.comment] }
                            : s
                    )
                );
                if (selectedSuggestion?.id === id) {
                    setSelectedSuggestion({
                        ...selectedSuggestion,
                        comments: [...(selectedSuggestion.comments || []), data.comment],
                    });
                }
                toast({
                    title: "Comment added!",
                    description: "Your comment has been posted.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add comment",
                variant: "destructive",
            });
        }
    };

    const handleSubmitFeature = async () => {
        if (!newFeature.title.trim()) {
            toast({
                title: "Title required",
                description: "Please enter a title for your feature request.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newFeature.title,
                    description: newFeature.description,
                    userId: session?.user?.id || null,
                    userName: session?.user?.name || "Anon",
                    userImage: session?.user?.image || null,
                }),
            });
            const data = await res.json();
            if (data.suggestion) {
                setSuggestions((prev) => [{ ...data.suggestion, comments: [] }, ...prev]);
                setNewFeature({ title: "", description: "" });
                setIsDialogOpen(false);
                toast({
                    title: "Feature submitted!",
                    description: "Your feature request has been added to the roadmap.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit feature",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFeaturesByStatus = (status: keyof typeof STATUS_CONFIG) => {
        return suggestions
            .filter((f) => f.status === status)
            .sort((a, b) => (sortBy === "votes" ? b.upvotes - a.upvotes : 0));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Header */}
            <section className="py-6 sm:py-8 px-4 sm:px-6 border-b">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                Suggest a Feature
                            </h1>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                                Help us make MakeReceipt better by sharing your ideas
                            </p>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Suggest Feature
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Suggest a new feature</DialogTitle>
                                    <DialogDescription>
                                        Describe the feature you'd like to see in MakeReceipt.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="feature-title">Title</Label>
                                        <Input
                                            id="feature-title"
                                            placeholder="e.g., Add QR code support"
                                            value={newFeature.title}
                                            onChange={(e) =>
                                                setNewFeature((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="feature-desc">Description</Label>
                                        <Textarea
                                            id="feature-desc"
                                            placeholder="Describe how this feature would help you..."
                                            rows={4}
                                            value={newFeature.description}
                                            onChange={(e) =>
                                                setNewFeature((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSubmitFeature}
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Feature"
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </section>

            {/* Roadmap */}
            <section className="py-6 sm:py-8 px-4 sm:px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Roadmap Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center md:text-left">
                            Roadmap
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                    {session ? session.user?.name : "Anonymous session"}
                                </span>
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full sm:w-[140px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="votes">Sort by Votes</SelectItem>
                                    <SelectItem value="newest">Sort by Newest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Kanban Board */}
                    {isLoading ? (
                        <div className="flex justify-center py-16 sm:py-20">
                            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                            <StatusColumn
                                status="pending"
                                suggestions={getFeaturesByStatus("pending")}
                                onVote={handleVote}
                                onCardClick={setSelectedSuggestion}
                            />
                            <StatusColumn
                                status="approved"
                                suggestions={getFeaturesByStatus("approved")}
                                onVote={handleVote}
                                onCardClick={setSelectedSuggestion}
                            />
                            <StatusColumn
                                status="in_progress"
                                suggestions={getFeaturesByStatus("in_progress")}
                                onVote={handleVote}
                                onCardClick={setSelectedSuggestion}
                            />
                            <StatusColumn
                                status="done"
                                suggestions={getFeaturesByStatus("done")}
                                onVote={handleVote}
                                onCardClick={setSelectedSuggestion}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Feature Detail Modal */}
            {selectedSuggestion && (
                <FeatureDetailModal
                    suggestion={selectedSuggestion}
                    isOpen={!!selectedSuggestion}
                    onClose={() => setSelectedSuggestion(null)}
                    onVote={handleVote}
                    onComment={handleComment}
                />
            )}
        </div>
    );
}

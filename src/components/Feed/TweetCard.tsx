import { Tweet, Agent } from "@/lib/simulation/types";
import { useState, useEffect } from "react";
import { MessageCircle, Repeat2, Heart, Share, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import agentsData from "@/lib/simulation/agent_config.json";
import Link from "next/link";

const SimpleTime = (timestampString: string) => {
    const diff = Date.now() - new Date(timestampString).getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
};

export default function TweetCard({ tweet, agent, loggedInUser }: { tweet: Tweet; agent: Agent; loggedInUser?: Agent | null }) {
    const [liked, setLiked] = useState(false);
    const [retweeted, setRetweeted] = useState(false);
    const [likeCount, setLikeCount] = useState(tweet.likes);
    const [retweetCount, setRetweetCount] = useState(Math.floor(tweet.likes / 3));
    const [expanded, setExpanded] = useState(false);

    // Reply State
    const [replies, setReplies] = useState<Tweet[]>([]);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        const fetchReplies = async () => {
            const { data } = await supabase
                .from('tweets')
                .select('*')
                .eq('parent_id', tweet.id)
                .order('created_at', { ascending: true });

            if (data) {
                setReplies(data);
            }
        };
        fetchReplies();
    }, [tweet.id]);

    const handlePostReply = async () => {
        if (!replyText.trim() || !loggedInUser) return;

        const { data, error } = await supabase.from('tweets').insert({
            agent_id: loggedInUser.id,
            content: replyText.trim(),
            likes: 0,
            parent_id: tweet.id
        }).select().single();

        if (data) {
            setReplies(prev => [...prev, data]);
            setReplyText("");
            setShowReplyInput(false);
        }
    };

    const isLongForm = tweet.content.length > 280;
    const displayContent = expanded ? tweet.content : tweet.content.slice(0, 280);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked) setLikeCount(prev => prev - 1);
        else setLikeCount(prev => prev + 1);
        setLiked(!liked);
    };

    const handleRetweet = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (retweeted) setRetweetCount(prev => prev - 1);
        else setRetweetCount(prev => prev + 1);
        setRetweeted(!retweeted);
    };

    return (
        <div className="bg-background border-b border-border/50 p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="flex gap-3">
                {/* Avatar Column */}
                <div className="flex-shrink-0">
                    <Link href={`/profile/${agent.id}`}>
                        <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 shrink-0 hover:bg-primary/20 transition-colors cursor-pointer`}>
                            <img src="/logo.svg" alt="Agent Logo" className="w-[70%] h-[70%] object-contain" />
                        </div>
                    </Link>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-1 text-sm leading-4 mb-0.5">
                        <Link href={`/profile/${agent.id}`} className="hover:underline flex items-center gap-1 truncate">
                            <span className={`font-bold ${agent.color} truncate`}>{agent.name}</span>
                            <span className="text-muted-foreground truncate text-xs">{agent.handle}</span>
                        </Link>
                        <span className="text-muted-foreground mx-1">·</span>
                        <span className="text-muted-foreground hover:underline text-xs">{SimpleTime(tweet.created_at)}</span>
                    </div>

                    {/* Body */}
                    <div className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                        {tweet.parent_id && <span className="text-muted-foreground mr-1 text-primary">Replying...</span>}

                        {displayContent}
                        {isLongForm && !expanded && <span className="text-muted-foreground">...</span>}

                        {isLongForm && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                className="ml-1 text-primary hover:underline text-xs font-bold inline-block"
                            >
                                {expanded ? "Show Less" : "Read More"}
                            </button>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between mt-3 text-muted-foreground w-full max-w-md">
                        {/* Reply */}
                        <div
                            onClick={(e) => { e.stopPropagation(); setShowReplyInput(!showReplyInput); }}
                            className="group/btn flex items-center hover:text-blue-500 transition-colors cursor-pointer"
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 transition-colors text-muted-foreground group-hover/btn:text-blue-500">
                                <MessageCircle size={18} />
                            </div>
                            <span className="text-sm px-1 group-hover/btn:text-blue-500">{replies.length > 0 ? replies.length : Math.floor(Math.random() * 10)}</span>
                        </div>
                        {/* Retweet */}
                        <button
                            onClick={handleRetweet}
                            className={`group/btn flex items-center transition-colors ${retweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 transition-colors text-muted-foreground group-hover/btn:text-green-500">
                                <Repeat2 size={18} className={retweeted ? "text-green-500" : ""} />
                            </div>
                            <span className={`text-sm px-1 ${retweeted ? 'text-green-500' : 'group-hover/btn:text-green-500'}`}>{retweetCount}</span>
                        </button>
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className={`group/btn flex items-center transition-colors ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        >
                            <div className="p-2 rounded-full group-hover/btn:bg-pink-600/10 transition-colors text-muted-foreground group-hover/btn:text-pink-600">
                                <Heart size={18} className={liked ? "fill-pink-600 text-pink-600" : ""} />
                            </div>
                            <span className={`text-sm px-1 ${liked ? 'text-pink-600' : 'group-hover/btn:text-pink-600'}`}>{likeCount}</span>
                        </button>
                        {/* Share */}
                        <div className="group/btn flex items-center hover:text-blue-500 transition-colors cursor-pointer">
                            <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 transition-colors text-muted-foreground group-hover/btn:text-blue-500">
                                <Share size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Reply Input Box */}
                    {showReplyInput && loggedInUser && (
                        <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-primary/20">
                                <img src="/logo.svg" className="w-[70%] h-[70%] object-contain" />
                            </div>
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Post your reply..."
                                className="flex-1 bg-transparent border-b border-border/50 focus:border-primary outline-none text-sm pb-1 font-sans"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handlePostReply();
                                }}
                            />
                            <button
                                onClick={handlePostReply}
                                disabled={!replyText.trim()}
                                className="text-primary disabled:opacity-50 hover:bg-primary/10 p-1.5 rounded-full transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    )}

                    {/* Nested Replies */}
                    {replies.length > 0 && (
                        <div className="mt-4 border-l border-border/50 pl-4 space-y-4">
                            {replies.map(reply => {
                                const replyAgentInfo = agentsData.find((a: any) => a.id === reply.agent_id) as Agent;
                                const displayAgent = replyAgentInfo || {
                                    id: reply.agent_id,
                                    name: "System Admin",
                                    handle: "@SysAdmin",
                                    role: "Admin",
                                    avatar: "A",
                                    color: "text-primary",
                                    systemPrompt: ""
                                };
                                return (
                                    <TweetCard
                                        key={reply.id}
                                        tweet={reply}
                                        agent={displayAgent}
                                        loggedInUser={loggedInUser}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

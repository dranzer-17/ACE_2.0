// frontend/app/dashboard/student/collaboration/page.tsx
import { PostCard } from "@/components/collaboration/post-card";
import { CollaborationPost } from "@/types/collaboration";

async function getCollaborationPosts(): Promise<CollaborationPost[]> {
  // Fetch posts from your backend API
  const res = await fetch('http://localhost:8000/api/student/collaboration/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function CollaborationPage() {
  const posts = await getCollaborationPosts();

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold tracking-tight">Collaboration Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {posts.map((post: CollaborationPost) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}